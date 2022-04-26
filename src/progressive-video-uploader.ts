import { AbstractUploader, CommonOptions, MIN_CHUNK_SIZE, VideoUploadResponse, WithAccessToken, WithApiKey, WithUploadToken } from "./abstract-uploader";
import { PromiseQueue } from "./promise-queue";


export interface ProgressiveUploaderOptionsWithUploadToken extends CommonOptions, WithUploadToken { }
export interface ProgressiveUploaderOptionsWithAccessToken extends CommonOptions, WithAccessToken { }
export interface ProgressiveUploaderOptionsWithApiKey extends CommonOptions, WithApiKey { }

export interface ProgressiveUploadProgressEvent {
    uploadedBytes: number;
    totalBytes: number;
}

export interface ProgressiveProgressEvent {
    uploadedBytes: number;
    totalBytes: number;
}

export class ProgressiveUploader extends AbstractUploader<ProgressiveProgressEvent> {
    private currentPartNum = 1;
    private currentPartBlobs: Blob[] = [];
    private currentPartBlobsSize = 0;
    private queue = new PromiseQueue();

    constructor(options: ProgressiveUploaderOptionsWithAccessToken | ProgressiveUploaderOptionsWithUploadToken | ProgressiveUploaderOptionsWithApiKey) {
        super(options);
    }

    public uploadPart(file: Blob): Promise<void> {
        this.currentPartBlobsSize += file.size;
        this.currentPartBlobs.push(file);

        if (this.currentPartBlobsSize >= MIN_CHUNK_SIZE) {
            return this.queue.add(() => {
                const promise = this.upload(new Blob(this.currentPartBlobs)).then(res => {
                    this.videoId = res.videoId;
                });
                this.currentPartNum++;
                this.currentPartBlobs = [];
                this.currentPartBlobsSize = 0;
                return promise;
            });
        }
        return Promise.resolve();
    }

    public uploadLastPart(file: Blob): Promise<VideoUploadResponse> {
        this.currentPartBlobs.push(file);
        return this.queue.add(() => this.upload(new Blob(this.currentPartBlobs), true));
    }

    private async upload(file: Blob, isLast: boolean = false): Promise<VideoUploadResponse> {
        const fileSize = file.size;
        return this.xhrWithRetrier({
            body: this.createFormData(file, "file"),
            parts: {
                currentPart: this.currentPartNum,
                totalParts: isLast ? this.currentPartNum : '*'
            },
            onProgress: (event: ProgressEvent) => this.onProgressCallbacks.forEach(cb => cb({
                uploadedBytes: event.loaded,
                totalBytes: fileSize,
            })),
        })
    }

}