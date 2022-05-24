import { AbstractUploader, CommonOptions, MIN_CHUNK_SIZE, VideoUploadResponse, WithAccessToken, WithApiKey, WithUploadToken } from "./abstract-uploader";
import { PromiseQueue } from "./promise-queue";

export interface ProgressiveUploadCommonOptions {
    preventEmptyParts?: boolean;
}

export interface ProgressiveUploaderOptionsWithUploadToken extends ProgressiveUploadCommonOptions, CommonOptions, WithUploadToken { }
export interface ProgressiveUploaderOptionsWithAccessToken extends ProgressiveUploadCommonOptions, CommonOptions, WithAccessToken { }
export interface ProgressiveUploaderOptionsWithApiKey extends ProgressiveUploadCommonOptions, CommonOptions, WithApiKey { }

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
    private preventEmptyParts: boolean;

    constructor(options: ProgressiveUploaderOptionsWithAccessToken | ProgressiveUploaderOptionsWithUploadToken | ProgressiveUploaderOptionsWithApiKey) {
        super(options);
        this.preventEmptyParts = options.preventEmptyParts || false;
    }

    public uploadPart(file: Blob): Promise<void> {
        this.currentPartBlobsSize += file.size;
        this.currentPartBlobs.push(file);

        if ((this.preventEmptyParts && (this.currentPartBlobsSize - file.size >= MIN_CHUNK_SIZE))
            || (!this.preventEmptyParts && (this.currentPartBlobsSize >= MIN_CHUNK_SIZE))) {

            let toSend: any[];
            if(this.preventEmptyParts) {
                toSend = this.currentPartBlobs.slice(0, -1);
                this.currentPartBlobs = this.currentPartBlobs.slice(-1);
                this.currentPartBlobsSize = this.currentPartBlobs.length === 0 ? 0 : this.currentPartBlobs[0].size;
            } else {
                toSend = this.currentPartBlobs;
                this.currentPartBlobs = [];
                this.currentPartBlobsSize = 0;
            }

            return this.queue.add(() => {
                if (toSend.length > 0) {
                    const promise = this.upload(new Blob(toSend)).then(res => {
                        this.videoId = res.videoId;
                    });
                    this.currentPartNum++;
                    return promise;
                }
                return new Promise(resolve => resolve());
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