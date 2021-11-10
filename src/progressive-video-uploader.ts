import { DEFAULT_API_HOST, DEFAULT_RETRIES, MIN_CHUNK_SIZE } from "./common";

export interface ProgressiveUploaderOptionsWithUploadToken extends Options {
    uploadToken: string;
    videoId?: string;
}
export interface ProgressiveUploaderOptionsWithAccessToken extends Options {
    accessToken: string;
    videoId: string;
}
interface Options {
    apiHost?: string;
    retries?: number;
}

export interface ProgressiveUploadProgressEvent {
    uploadedBytes: number;
    totalBytes: number;
}


export interface ProgressiveProgressEvent {
    uploadedBytes: number;
    totalBytes: number;
}


export class ProgressiveUploader {
    private uploadEndpoint: string;
    private videoId?: string;
    private retries: number;
    private onProgressCallbacks: ((e: ProgressiveProgressEvent) => void)[] = [];
    private headers: { [name: string]: string } = {};
    private currentPartNum = 1;
    private currentPartBlobs: Blob[] = [];
    private currentPartBlobsSize = 0;

    constructor(options: ProgressiveUploaderOptionsWithAccessToken | ProgressiveUploaderOptionsWithUploadToken) {
        const apiHost = options.apiHost || DEFAULT_API_HOST;

        if (options.hasOwnProperty("uploadToken")) {
            const optionsWithUploadToken = options as ProgressiveUploaderOptionsWithUploadToken;
            if (optionsWithUploadToken.videoId) {
                this.videoId = optionsWithUploadToken.videoId;
            }
            this.uploadEndpoint = `https://${apiHost}/upload?token=${optionsWithUploadToken.uploadToken}`;

        } else if (options.hasOwnProperty("accessToken")) {
            const optionsWithAccessToken = options as ProgressiveUploaderOptionsWithAccessToken;
            if (!optionsWithAccessToken.videoId) {
                throw new Error("'videoId' is missing");
            }
            this.uploadEndpoint = `https://${apiHost}/videos/${optionsWithAccessToken.videoId}/source`;
            this.headers.Authorization = `Bearer ${optionsWithAccessToken.accessToken}`;
        } else {
            throw new Error(`You must provide either an accessToken or an uploadToken`);
        }

        this.retries = options.retries || DEFAULT_RETRIES;
    }

    public onProgress(cb: (e: ProgressiveProgressEvent) => void) {
        this.onProgressCallbacks.push(cb);
    }

    public uploadPart(file: Blob) {
        this.currentPartBlobsSize += file.size;
        this.currentPartBlobs.push(file);

        if(this.currentPartBlobsSize >= MIN_CHUNK_SIZE) {
            const promise = this.upload(new Blob(this.currentPartBlobs)).then(res => {
                this.videoId = res.videoId;
            });
            this.currentPartBlobs = [];
            this.currentPartBlobsSize = 0;
            return promise;
        }
        return Promise.resolve();
    }

    public uploadLastPart(file: Blob) {
        this.currentPartBlobs.push(file);
        return this.upload(new Blob(this.currentPartBlobs), true);
    }

    private createFormData(blob: Blob): FormData {
        const chunk = blob;
        const chunkForm = new FormData();
        if (this.videoId) {
            chunkForm.append("videoId", this.videoId);
        }
        chunkForm.append("file", chunk, "file");
        return chunkForm;
    }

    private sleep(duration: number): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), duration);
        })
    }

    private upload(file: Blob, isLast: boolean = false): Promise<any> {
        const doUpload = (partNum: number) => new Promise((resolve, reject) => {
            const fileSize = file.size;

            const contentRange = `part ${partNum}/${isLast ? partNum : '*'}`;

            const xhr = new window.XMLHttpRequest();
            xhr.open("POST", `${this.uploadEndpoint}`, true);
            xhr.setRequestHeader("Content-Range", contentRange);
            for (const headerName of Object.keys(this.headers)) {
                xhr.setRequestHeader(headerName, this.headers[headerName]);
            }
            xhr.onreadystatechange = (_) => {
                if (xhr.readyState === 4) { // DONE
                    if (xhr.status >= 400) {
                        reject({
                            status: xhr.status,
                            message: xhr.response
                        });
                    }
                }
            };
            xhr.onload = (_) => resolve(JSON.parse(xhr.response));
            xhr.upload.onprogress = (e) => this.onProgressCallbacks.forEach(cb => cb({
                uploadedBytes: e.loaded,
                totalBytes: fileSize,
            }));
            xhr.send(this.createFormData(file));
        });

        return new Promise(async (resolve, reject) => {
            let response;
            let retriesCount = 0;
            const thisPart = this.currentPartNum;
            this.currentPartNum++;
            while(true) {
                try {
                    response = await doUpload(thisPart);
                    resolve(response);
                    return;
                } catch (e) {
                    if(retriesCount >= this.retries) {
                        reject(e);
                        return;
                    }
                    await this.sleep(200 + retriesCount * 500);
                    retriesCount++;
                }
            }
        });
    }
}