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
export interface UploadProgressEvent {
    uploadedBytes: number;
    totalBytes: number;
    chunksCount: number;
    chunksBytes: number;
    currentChunk: number;
    currentChunkUploadedBytes: number;
}
export declare class VideoUploader {
    private file;
    private chunkSize;
    private uploadEndpoint;
    private currentChunk;
    private chunksCount;
    private fileSize;
    private fileName;
    private videoId?;
    private retries;
    private onProgressCallbacks;
    private headers;
    constructor(options: OptionsWithAccessToken | OptionsWithUploadToken);
    onProgress(cb: (e: UploadProgressEvent) => void): void;
    upload(): Promise<any>;
    private sleep;
    private createFormData;
    private uploadCurrentChunk;
}
export {};
