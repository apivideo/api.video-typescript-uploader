interface OptionsWithUploadToken extends Options {
    uploadToken: string;
}
interface OptionsWithAccessToken extends Options {
    accessToken: string;
    videoId: string;
}
interface Options {
    file: File;
    chunkSize?: number;
    apiHost?: string;
    retries?: number;
}

interface UploadProgressEvent {
    loaded: number;
    total: number;
}

const DEFAULT_CHUNK_SIZE = 1024 * 1024; // 1mb
const DEFAULT_RETRIES = 5;
const DEFAULT_API_HOST = "ws.api.video";

export class VideoUploader {
    private file: File;
    private chunkSize: number;
    private uploadEndpoint: string;
    private currentChunk: number = 0;
    private chunksCount: number;
    private fileSize: number;
    private fileName: string;
    private videoId?: string;
    private retries: number;
    private onProgressCallbacks: ((e: UploadProgressEvent) => void)[] = [];
    private headers: { [name: string]: string } = {};

    constructor(options: OptionsWithAccessToken | OptionsWithUploadToken) {
        const apiHost = options.apiHost || DEFAULT_API_HOST;

        if (!options.file) {
            throw new Error("'file' is missing");
        }

        if (options.hasOwnProperty("uploadToken")) {
            const optionsWithUploadToken = options as OptionsWithUploadToken;
            this.uploadEndpoint = `https://${apiHost}/upload?token=${optionsWithUploadToken.uploadToken}`;

        } else if (options.hasOwnProperty("accessToken")) {
            const optionsWithAccessToken = options as OptionsWithAccessToken;
            if (!optionsWithAccessToken.videoId) {
                throw new Error("'videoId' is missing");
            }
            this.uploadEndpoint = `https://${apiHost}/videos/${optionsWithAccessToken.videoId}/source`;
            this.headers.Authorization = `Bearer ${optionsWithAccessToken.accessToken}`;
        } else {
            throw new Error(`You must provide either an accessToken or an uploadToken`);
        }

        this.chunkSize = options.chunkSize || DEFAULT_CHUNK_SIZE;
        this.retries = options.retries || DEFAULT_RETRIES;
        this.file = options.file;
        this.fileSize = this.file.size;
        this.fileName = this.file.name;

        this.chunksCount = Math.ceil(this.fileSize / this.chunkSize);
    }

    public onProgress(cb: () => UploadProgressEvent) {
        this.onProgressCallbacks.push(cb);
    }

    public upload(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            let response;
            let retriesCount = 0;
            while (this.currentChunk < this.chunksCount) {
                try {
                    response = await this.uploadCurrentChunk();
                    this.videoId = response.videoId;
                    this.currentChunk++;

                } catch (e) {
                    if(retriesCount >= this.retries) {
                        reject(e);
                        break;
                    }
                    await this.sleep(200 + retriesCount * 500);
                    retriesCount++;
                }
            }
            resolve(response);
        });
    }

    private sleep(duration: number): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), duration);
        })
    }

    private createFormData(startByte: number, endByte: number): FormData {
        const chunk = this.file.slice(startByte, endByte);
        const chunkForm = new FormData();
        if (this.videoId) {
            chunkForm.append("videoId", this.videoId);
        }
        chunkForm.append("file", chunk, this.fileName);
        return chunkForm;
    }

    private uploadCurrentChunk(): Promise<any> {
        return new Promise((resolve, reject) => {
            const firstByte = this.currentChunk * this.chunkSize;
            const computedLastByte = (this.currentChunk + 1) * this.chunkSize;
            const lastByte = (computedLastByte > this.fileSize ? this.fileSize : computedLastByte);

            const contentRange = `bytes ${firstByte}-${lastByte - 1}/${this.fileSize}`;

            const xhr = new window.XMLHttpRequest();
            xhr.open("POST", `${this.uploadEndpoint}`, true);
            xhr.setRequestHeader("Content-Range", contentRange);
            for (const headerName of Object.keys(this.headers)) {
                xhr.setRequestHeader(headerName, this.headers[headerName]);
            }
            xhr.onreadystatechange = (e) => {
                if (xhr.readyState === 4) { // DONE
                    if (xhr.status >= 400) {
                        reject({
                            status: xhr.status,
                            message: xhr.response
                        });
                    }
                }
            };
            xhr.onload = (e) => resolve(JSON.parse(xhr.response));
            xhr.onprogress = (e) => this.onProgressCallbacks.forEach(cb => cb({
                loaded: e.loaded + firstByte,
                total: this.fileSize
            }));
            xhr.send(this.createFormData(firstByte, lastByte));
        });
    }
}