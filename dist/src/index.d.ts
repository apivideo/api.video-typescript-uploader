interface Options {
    file: File;
    uploadToken: string;
    chunkSize?: number;
    uploadEndpoint?: string;
}
interface UploadProgressEvent {
    loaded: number;
    total: number;
}
export declare class VideoUploader {
    private file;
    private chunkSize;
    private uploadEndpoint;
    private uploadToken;
    private currentChunk;
    private chunksCount;
    private fileSize;
    private fileName;
    private videoId?;
    private onProgressCallbacks;
    constructor(options: Options);
    onProgress(cb: () => UploadProgressEvent): void;
    upload(): Promise<any>;
    private validateOptions;
    private createFormData;
    private uploadCurrentChunk;
}
export {};
