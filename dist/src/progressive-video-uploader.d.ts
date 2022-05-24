import { AbstractUploader, CommonOptions, VideoUploadResponse, WithAccessToken, WithApiKey, WithUploadToken } from "./abstract-uploader";
export interface ProgressiveUploadCommonOptions {
    preventEmptyParts?: boolean;
}
export interface ProgressiveUploaderOptionsWithUploadToken extends ProgressiveUploadCommonOptions, CommonOptions, WithUploadToken {
}
export interface ProgressiveUploaderOptionsWithAccessToken extends ProgressiveUploadCommonOptions, CommonOptions, WithAccessToken {
}
export interface ProgressiveUploaderOptionsWithApiKey extends ProgressiveUploadCommonOptions, CommonOptions, WithApiKey {
}
export interface ProgressiveUploadProgressEvent {
    uploadedBytes: number;
    totalBytes: number;
}
export interface ProgressiveProgressEvent {
    uploadedBytes: number;
    totalBytes: number;
}
export declare class ProgressiveUploader extends AbstractUploader<ProgressiveProgressEvent> {
    private currentPartNum;
    private currentPartBlobs;
    private currentPartBlobsSize;
    private queue;
    private preventEmptyParts;
    constructor(options: ProgressiveUploaderOptionsWithAccessToken | ProgressiveUploaderOptionsWithUploadToken | ProgressiveUploaderOptionsWithApiKey);
    uploadPart(file: Blob): Promise<void>;
    uploadLastPart(file: Blob): Promise<VideoUploadResponse>;
    private upload;
}
