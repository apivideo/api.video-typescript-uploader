import { AbstractUploader, CommonOptions, VideoUploadResponse, WithAccessToken, WithApiKey, WithUploadToken } from "./abstract-uploader";
export interface ProgressiveUploaderOptionsWithUploadToken extends CommonOptions, WithUploadToken {
}
export interface ProgressiveUploaderOptionsWithAccessToken extends CommonOptions, WithAccessToken {
}
export interface ProgressiveUploaderOptionsWithApiKey extends CommonOptions, WithApiKey {
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
    constructor(options: ProgressiveUploaderOptionsWithAccessToken | ProgressiveUploaderOptionsWithUploadToken | ProgressiveUploaderOptionsWithApiKey);
    uploadPart(file: Blob): Promise<void>;
    uploadLastPart(file: Blob): Promise<VideoUploadResponse>;
    private upload;
}
