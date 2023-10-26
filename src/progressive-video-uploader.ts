import {
    AbstractUploader,
    CancelableOperation,
    CommonOptions,
    MIN_CHUNK_SIZE,
    VideoUploadResponse,
    WithAccessToken,
    WithApiKey,
    WithUploadToken,
} from "./abstract-uploader";
import { PromiseQueue } from "./promise-queue";

export interface ProgressiveUploadCommonOptions {
    preventEmptyParts?: boolean;
    mergeSmallPartsBeforeUpload?: boolean;
}

export interface ProgressiveUploaderOptionsWithUploadToken
    extends ProgressiveUploadCommonOptions,
    CommonOptions,
    WithUploadToken { }
export interface ProgressiveUploaderOptionsWithAccessToken
    extends ProgressiveUploadCommonOptions,
    CommonOptions,
    WithAccessToken { }
export interface ProgressiveUploaderOptionsWithApiKey
    extends ProgressiveUploadCommonOptions,
    CommonOptions,
    WithApiKey { }

export interface ProgressiveUploadProgressEvent {
    part: number;
    uploadedBytes: number;
    totalBytes: number;
}

export class ProgressiveUploader extends AbstractUploader<ProgressiveUploadProgressEvent> {
    private currentPartNum = 1;
    private currentPartBlobs: Blob[] = [];
    private currentPartBlobsSize = 0;
    private queue = new PromiseQueue();
    private preventEmptyParts: boolean;
    private fileName: string;
    private mergeSmallPartsBeforeUpload: boolean;
    private currentChunkCancel?: () => void;
    private canceled = false;

    constructor(
        options:
            | ProgressiveUploaderOptionsWithAccessToken
            | ProgressiveUploaderOptionsWithUploadToken
            | ProgressiveUploaderOptionsWithApiKey,
    ) {
        super(options);
        this.preventEmptyParts = options.preventEmptyParts || false;
        this.fileName = options.videoName || "file";
        this.mergeSmallPartsBeforeUpload =
            options.mergeSmallPartsBeforeUpload ?? true;
    }

    public uploadPart(file: Blob): Promise<VideoUploadResponse | void> {
        if (!this.mergeSmallPartsBeforeUpload && file.size < MIN_CHUNK_SIZE) {
            throw new Error(
                `Each part must have a minimal size of 5MB. The current part has a size of ${this.currentPartBlobsSize / 1024 / 1024
                }MB.`,
            );
        }
        this.currentPartBlobsSize += file.size;
        this.currentPartBlobs.push(file);

        if (
            (this.preventEmptyParts &&
                this.currentPartBlobsSize - file.size >= MIN_CHUNK_SIZE) ||
            (!this.preventEmptyParts &&
                this.currentPartBlobsSize >= MIN_CHUNK_SIZE) ||
            !this.mergeSmallPartsBeforeUpload
        ) {
            let toSend: any[];
            if (this.preventEmptyParts) {
                toSend = this.currentPartBlobs.slice(0, -1);
                this.currentPartBlobs = this.currentPartBlobs.slice(-1);
                this.currentPartBlobsSize =
                    this.currentPartBlobs.length === 0
                        ? 0
                        : this.currentPartBlobs[0].size;
            } else {
                toSend = this.currentPartBlobs;
                this.currentPartBlobs = [];
                this.currentPartBlobsSize = 0;
            }

            return this.queue.add(() => {
                if (toSend.length > 0) {
                    const cancelableOperation = this.upload(new Blob(toSend));
                    this.currentChunkCancel = cancelableOperation.cancel;
                    const promise = cancelableOperation.result.then((res) => {
                        this.videoId = res.videoId;
                        return res;
                    });
                    this.currentPartNum++;
                    return promise;
                }
                return new Promise((resolve) => resolve());
            });
        }
        return Promise.resolve();
    }

    public cancel(): void {
        this.canceled = true;
        if (this.currentChunkCancel) {
            this.currentChunkCancel();
        }
    }

    public async uploadLastPart(file: Blob): Promise<VideoUploadResponse> {
        this.currentPartBlobs.push(file);
        const res = await this.queue.add(() => {
            const cancelableOperation = this.upload(
                new Blob(this.currentPartBlobs),
                true,
            );
            this.currentChunkCancel = cancelableOperation.cancel;
            return cancelableOperation.result;
        });

        if (this.onPlayableCallbacks.length > 0) {
            this.waitForPlayable(res!);
        }

        return res;
    }

    private upload(
        file: Blob,
        isLast: boolean = false,
    ): CancelableOperation<VideoUploadResponse> {
        const fileSize = file.size;
        const currentPartNum = this.currentPartNum;

        if (this.canceled) {
            throw new Error("Upload canceled");
        }

        return this.xhrWithRetrier({
            body: this.createFormData(file, this.fileName),
            parts: {
                currentPart: currentPartNum,
                totalParts: isLast ? currentPartNum : "*",
            },
            onProgress: (event: ProgressEvent) =>
                this.onProgressCallbacks.forEach((cb) =>
                    cb({
                        part: currentPartNum,
                        uploadedBytes: event.loaded,
                        totalBytes: fileSize,
                    }),
                ),
        });
    }
}
