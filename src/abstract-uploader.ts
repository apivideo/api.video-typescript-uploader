export const MIN_CHUNK_SIZE = 1024 * 1024 * 5; // 5mb
export const DEFAULT_CHUNK_SIZE = 1024 * 1024 * 50; // 50mb
export const MAX_CHUNK_SIZE = 1024 * 1024 * 128; // 128mb
export const DEFAULT_RETRIES = 6;
export const DEFAULT_API_HOST = "ws.api.video";

export declare type VideoUploadResponse = {
    readonly videoId: string;
    readonly title?: string;
    readonly description?: string;
    readonly _public?: boolean;
    readonly panoramic?: boolean;
    readonly mp4Support?: boolean;
    readonly publishedAt?: Date;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
    readonly tags?: string[];
    readonly metadata?: {
        readonly key?: string;
        readonly value?: string;
    }[];
    readonly source?: {
        readonly type?: string;
        readonly uri?: string;
    };
    readonly assets?: {
        readonly iframe?: string;
        readonly player?: string;
        readonly hls?: string;
        readonly thumbnail?: string;
        readonly mp4?: string;
    };
};

type RetryStrategy = (retryCount: number, error: VideoUploadError) => number | null;

interface Origin {
    name: string;
    version: string;
}

export interface CommonOptions {
    apiHost?: string;
    retries?: number;
    videoName?: string;
    retryStrategy?: RetryStrategy;
    origin?: {
        application?: Origin;
        sdk?: Origin;
    };
}

export interface WithUploadToken {
    uploadToken: string;
    videoId?: string;
}

export interface WithAccessToken {
    accessToken: string;
    refreshToken?: string;
    videoId: string;
}

export interface WithApiKey {
    apiKey: string;
    videoId: string;
}

export type VideoUploadError = {
    status?: number;
    type?: string;
    title?: string;
    reason?: string;
    raw: string;
}

type HXRRequestParams = {
    parts?: {
        currentPart: number;
        totalParts: number | "*";
    },
    onProgress?: (e: ProgressEvent) => void;
    body: Document | XMLHttpRequestBodyInit | null;
}

let PACKAGE_VERSION = "";
try {
    // @ts-ignore
    PACKAGE_VERSION = __PACKAGE_VERSION__ || "";
} catch (e) {
    // ignore
}

export const DEFAULT_RETRY_STRATEGY = (maxRetries: number) => {
    return (retryCount: number, error: VideoUploadError) => {
        if ((error.status && error.status >= 400 && error.status < 500) || retryCount >= maxRetries) {
            return null;
        }
        return Math.floor(200 + 2000 * retryCount * (retryCount + 1));
    }
};

export abstract class AbstractUploader<T> {
    protected uploadEndpoint: string;
    protected videoId?: string;
    protected retries: number;
    protected headers: { [name: string]: string } = {};
    protected onProgressCallbacks: ((e: T) => void)[] = [];
    protected onPlayableCallbacks: ((e: VideoUploadResponse) => void)[] = [];
    protected refreshToken?: string;
    protected apiHost: string;
    protected retryStrategy: RetryStrategy;

    constructor(options: CommonOptions & (WithAccessToken | WithUploadToken | WithApiKey)) {
        this.apiHost = options.apiHost || DEFAULT_API_HOST;

        if (options.hasOwnProperty("uploadToken")) {
            const optionsWithUploadToken = options as WithUploadToken;
            if (optionsWithUploadToken.videoId) {
                this.videoId = optionsWithUploadToken.videoId;
            }
            this.uploadEndpoint = `https://${this.apiHost}/upload?token=${optionsWithUploadToken.uploadToken}`;

        } else if (options.hasOwnProperty("accessToken")) {
            const optionsWithAccessToken = options as WithAccessToken;
            if (!optionsWithAccessToken.videoId) {
                throw new Error("'videoId' is missing");
            }
            this.refreshToken = optionsWithAccessToken.refreshToken;
            this.uploadEndpoint = `https://${this.apiHost}/videos/${optionsWithAccessToken.videoId}/source`;
            this.headers.Authorization = `Bearer ${optionsWithAccessToken.accessToken}`;
        } else if (options.hasOwnProperty("apiKey")) {
            const optionsWithApiKey = options as WithApiKey;
            if (!optionsWithApiKey.videoId) {
                throw new Error("'videoId' is missing");
            }
            this.uploadEndpoint = `https://${this.apiHost}/videos/${optionsWithApiKey.videoId}/source`;
            this.headers.Authorization = `Basic ${btoa(optionsWithApiKey.apiKey + ":")}`;
        } else {
            throw new Error(`You must provide either an accessToken, an uploadToken or an API key`);
        }
        this.headers["AV-Origin-Client"] = "typescript-uploader:" + PACKAGE_VERSION;
        this.retries = options.retries || DEFAULT_RETRIES;
        this.retryStrategy = options.retryStrategy || DEFAULT_RETRY_STRATEGY(this.retries);

        if (options.origin) {
            if (options.origin.application) {
                AbstractUploader.validateOrigin("application", options.origin.application);
                this.headers["AV-Origin-App"] = `${options.origin.application.name}:${options.origin.application.version}`;
            }
            if (options.origin.sdk) {
                AbstractUploader.validateOrigin("sdk", options.origin.sdk);
                this.headers["AV-Origin-Sdk"] = `${options.origin.sdk.name}:${options.origin.sdk.version}`;
            }
        }
    }

    public onProgress(cb: (e: T) => void) {
        this.onProgressCallbacks.push(cb);
    }

    public onPlayable(cb: (e: VideoUploadResponse) => void) {
        this.onPlayableCallbacks.push(cb);
    }

    protected async waitForPlayable(video: VideoUploadResponse) {
        const hls = video.assets?.hls;

        while (true) {
            await this.sleep(500);

            const hlsRes = await fetch(hls!);

            if(hlsRes.status === 202) {
                continue;
            }

            if((await hlsRes.text()).length === 0) {
                continue;
            }

            break;
        }

        this.onPlayableCallbacks.forEach(cb => cb(video));
    };

    protected parseErrorResponse(xhr: XMLHttpRequest): VideoUploadError {
        try {
            const parsedResponse = JSON.parse(xhr.response);

            return {
                status: xhr.status,
                raw: xhr.response,
                ...parsedResponse
            }
        } catch (e) {
            // empty
        }

        return {
            status: xhr.status,
            raw: xhr.response,
            reason: "UNKWOWN",
        }
    }

    protected apiResponseToVideoUploadResponse(response: any): VideoUploadResponse {
        const res = {
            ...response,
            _public: response.public,
            publishedAt: response.publishedAt ? new Date(response.publishedAt) : undefined,
            createdAt: response.createdAt ? new Date(response.createdAt) : undefined,
            updatedAt: response.updatedAt ? new Date(response.updatedAt) : undefined,
        };
        delete res.public;
        return res;
    }

    protected sleep(duration: number): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), duration);
        })
    }


    protected xhrWithRetrier(params: HXRRequestParams): Promise<VideoUploadResponse> {
        return this.withRetrier(() => this.createXhrPromise(params))
    }

    protected createFormData(file: Blob, fileName: string, startByte?: number, endByte?: number): FormData {
        const chunk = (startByte || endByte)
            ? file.slice(startByte, endByte)
            : file;
        const chunkForm = new FormData();
        if (this.videoId) {
            chunkForm.append("videoId", this.videoId);
        }
        chunkForm.append("file", chunk, fileName);
        return chunkForm;
    }

    public doRefreshToken(): Promise<void> {
        return new Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.open("POST", `https://${this.apiHost}/auth/refresh`);
            for (const headerName of Object.keys(this.headers)) {
                if (headerName !== "Authorization") xhr.setRequestHeader(headerName, this.headers[headerName]);
            }
            xhr.onreadystatechange = (_) => {
                if (xhr.readyState === 4 && xhr.status >= 400) {
                    reject(this.parseErrorResponse(xhr));
                }
            }
            xhr.onload = (_) => {
                const response = JSON.parse(xhr.response);
                if (response.refresh_token && response.access_token) {
                    this.headers.Authorization = `Bearer ${response.access_token}`;
                    this.refreshToken = response.refresh_token;
                    resolve();
                    return;
                }
                reject(this.parseErrorResponse(xhr));
            };
            xhr.send(JSON.stringify({
                refreshToken: this.refreshToken
            }));
        });
    }
    private createXhrPromise(params: HXRRequestParams): Promise<VideoUploadResponse> {
        return new Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.open("POST", `${this.uploadEndpoint}`, true);
            if (params.parts) {
                xhr.setRequestHeader("Content-Range", `part ${params.parts.currentPart}/${params.parts.totalParts}`);
            }
            for (const headerName of Object.keys(this.headers)) {
                xhr.setRequestHeader(headerName, this.headers[headerName]);
            }
            if (params.onProgress) {
                xhr.upload.onprogress = (e) => params.onProgress!(e);
            }
            xhr.onreadystatechange = (_) => {
                if (xhr.readyState === 4) { // DONE
                    if (xhr.status === 401 && this.refreshToken) {
                        return this.doRefreshToken()
                            .then(() => this.createXhrPromise(params))
                            .then(res => resolve(res))
                            .catch((e) => reject(e));
                    } else if (xhr.status >= 400) {
                        reject(this.parseErrorResponse(xhr));
                        return;
                    }
                }
            };
            xhr.onerror = (e) => {
                reject({
                    status: undefined,
                    raw: undefined,
                    reason: "NETWORK_ERROR",
                });
            }
            xhr.ontimeout = (e) => {
                reject({
                    status: undefined,
                    raw: undefined,
                    reason: "NETWORK_TIMEOUT",
                });
            }
            xhr.onload = (_) => {
                if (xhr.status < 400) {
                    resolve(this.apiResponseToVideoUploadResponse(JSON.parse(xhr.response)));
                }
            };
            xhr.send(params.body);
        });
    }

    private async withRetrier(fn: () => Promise<VideoUploadResponse>): Promise<VideoUploadResponse> {
        return new Promise(async (resolve, reject) => {
            let retriesCount = 0;
            while (true) {
                try {
                    const res = await fn();
                    resolve(res);
                    return;
                } catch (e: any) {
                    const retryDelay = this.retryStrategy(retriesCount, e);
                    if (retryDelay === null) {
                        reject(e);
                        return;
                    }
                    console.log(`video upload: ${e.reason || "ERROR"}, will be retried in ${retryDelay} ms`);
                    await this.sleep(retryDelay);
                    retriesCount++;
                }
            }
        });
    }

    private static validateOrigin(type: string, origin: Origin) {
        if (!origin.name) {
            throw new Error(`${type} name is required`);
        }
        if (!origin.version) {
            throw new Error(`${type} version is required`);
        }
        if (!/^[\w-]{1,50}$/.test(origin.name)) {
            throw new Error(
                `Invalid ${type} name value. Allowed characters: A-Z, a-z, 0-9, '-', '_'. Max length: 50.`
            );
        }
        if (!/^\d{1,3}(\.\d{1,3}(\.\d{1,3})?)?$/.test(origin.version)) {
            throw new Error(
                `Invalid ${type} version value. The version should match the xxx[.yyy][.zzz] pattern.`
            );
        }
    }
}
