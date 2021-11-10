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
export declare class ProgressiveUploader {
    private uploadEndpoint;
    private videoId?;
    private retries;
    private onProgressCallbacks;
    private headers;
    private currentPartNum;
    private currentPartBlobs;
    private currentPartBlobsSize;
    constructor(options: ProgressiveUploaderOptionsWithAccessToken | ProgressiveUploaderOptionsWithUploadToken);
    onProgress(cb: (e: ProgressiveProgressEvent) => void): void;
    uploadPart(file: Blob): Promise<void>;
    uploadLastPart(file: Blob): Promise<any>;
    private createFormData;
    private sleep;
    private upload;
}
export {};
