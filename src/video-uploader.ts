import { apiResponseToVideoUploadResponse, DEFAULT_API_HOST, DEFAULT_CHUNK_SIZE, DEFAULT_RETRIES, MAX_CHUNK_SIZE, MIN_CHUNK_SIZE, parseErrorResponse, parseUserConfig, VideoUploadError, VideoUploadResponse } from "./common";
import { PromiseQueue } from "./promise-queue";

export interface VideoUploaderOptionsWithUploadToken extends Options {
    uploadToken: string;
    videoId?: string;
}
export interface VideoUploaderOptionsWithAccessToken extends Options {
    accessToken: string;
    videoId: string;
}
export interface VideoUploaderOptionsWithApiKey extends Options {
    apiKey: string;
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
    private queue = new PromiseQueue();

    constructor(options: VideoUploaderOptionsWithAccessToken | VideoUploaderOptionsWithUploadToken | VideoUploaderOptionsWithApiKey) {
        if (!options.file) {
            throw new Error("'file' is missing");
        }

        const parsedCondig = parseUserConfig(options);

        this.uploadEndpoint = parsedCondig.uploadEndpoint;
        this.videoId = parsedCondig.videoId;
        if(parsedCondig.authHeader) {
            this.headers.Authorization = parsedCondig.authHeader;
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
        return this.queue.add(() => new Promise(async (resolve, reject) => {
            let response;
            let retriesCount = 0;
            while (this.currentChunk < this.chunksCount) {
                try {
                    response = await this.uploadCurrentChunk();
                    this.videoId = response.videoId;
                    this.currentChunk++;

                } catch (e: any) {
                    if (e.status === 401 || retriesCount >= this.retries) {
                        reject(e);
                        return;
                    }
                    await this.sleep(200 + retriesCount * 500);
                    retriesCount++;
                }
            }

            resolve(apiResponseToVideoUploadResponse(response));
        }));
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
                        reject(parseErrorResponse(xhr));
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