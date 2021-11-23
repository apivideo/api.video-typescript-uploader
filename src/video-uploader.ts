import { DEFAULT_API_HOST, DEFAULT_CHUNK_SIZE, DEFAULT_RETRIES, MAX_CHUNK_SIZE, MIN_CHUNK_SIZE, VideoUploadResponse } from "./common";

export interface VideoUploaderOptionsWithUploadToken extends Options {
    uploadToken: string;
    videoId?: string;
}
export interface VideoUploaderOptionsWithAccessToken extends Options {
    accessToken: string;
    videoId: string;
}
interface Options {
    file: File;
    chunkSize?: number;
    apiHost?: string;
    retries?: number;
}

export interface UploadProgressEvent {
    uploadedBytes: number;
    totalBytes: number;
    chunksCount: number;
    chunksBytes: number;
    currentChunk: number;
    currentChunkUploadedBytes: number;
}

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

    constructor(options: VideoUploaderOptionsWithAccessToken | VideoUploaderOptionsWithUploadToken) {
        const apiHost = options.apiHost || DEFAULT_API_HOST;

        if (!options.file) {
            throw new Error("'file' is missing");
        }

        if (options.hasOwnProperty("uploadToken")) {
            const optionsWithUploadToken = options as VideoUploaderOptionsWithUploadToken;
            if (optionsWithUploadToken.videoId) {
                this.videoId = optionsWithUploadToken.videoId;
            }
            this.uploadEndpoint = `https://${apiHost}/upload?token=${optionsWithUploadToken.uploadToken}`;

        } else if (options.hasOwnProperty("accessToken")) {
            const optionsWithAccessToken = options as VideoUploaderOptionsWithAccessToken;
            if (!optionsWithAccessToken.videoId) {
                throw new Error("'videoId' is missing");
            }
            this.uploadEndpoint = `https://${apiHost}/videos/${optionsWithAccessToken.videoId}/source`;
            this.headers.Authorization = `Bearer ${optionsWithAccessToken.accessToken}`;
        } else {
            throw new Error(`You must provide either an accessToken or an uploadToken`);
        }

        if(options.chunkSize && (options.chunkSize < MIN_CHUNK_SIZE || options.chunkSize > MAX_CHUNK_SIZE)) {
            throw new Error(`Invalid chunk size. Minimal allowed value: ${MIN_CHUNK_SIZE / 1024 / 1024}MB, maximum allowed value: ${MAX_CHUNK_SIZE / 1024 / 1024}MB.`);
        }

        this.chunkSize = options.chunkSize || DEFAULT_CHUNK_SIZE;
        this.retries = options.retries || DEFAULT_RETRIES;
        this.file = options.file;
        this.fileSize = this.file.size;
        this.fileName = this.file.name;

        this.chunksCount = Math.ceil(this.fileSize / this.chunkSize);
    }

    public onProgress(cb: (e: UploadProgressEvent) => void) {
        this.onProgressCallbacks.push(cb);
    }

    public upload(): Promise<VideoUploadResponse> {
        return new Promise(async (resolve, reject) => {
            let response;
            let retriesCount = 0;
            while (this.currentChunk < this.chunksCount) {
                try {
                    response = await this.uploadCurrentChunk();
                    this.videoId = response.videoId;
                    this.currentChunk++;

                } catch (e) {
                    if (retriesCount >= this.retries) {
                        reject(e);
                        return;
                    }
                    await this.sleep(200 + retriesCount * 500);
                    retriesCount++;
                }
            }
            resolve(response as VideoUploadResponse);
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

    private uploadCurrentChunk(): Promise<VideoUploadResponse> {
        return new Promise((resolve, reject) => {
            const firstByte = this.currentChunk * this.chunkSize;
            const computedLastByte = (this.currentChunk + 1) * this.chunkSize;
            const lastByte = (computedLastByte > this.fileSize ? this.fileSize : computedLastByte);
            const chunksCount = Math.ceil(this.fileSize / this.chunkSize);

            const contentRange = `part ${this.currentChunk + 1}/${chunksCount}`;

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
                uploadedBytes: e.loaded + firstByte,
                totalBytes: this.fileSize,
                chunksCount: this.chunksCount,
                chunksBytes: this.chunkSize,
                currentChunk: this.currentChunk + 1,
                currentChunkUploadedBytes: e.loaded,
            }));
            xhr.send(this.createFormData(firstByte, lastByte));
        });
    }
}