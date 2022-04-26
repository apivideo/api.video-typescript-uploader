import { AbstractUploader, CommonOptions, VideoUploadResponse, WithAccessToken, WithApiKey, WithUploadToken } from "./abstract-uploader";
interface UploadOptions {
    file: File;
    chunkSize?: number;
}
export interface VideoUploaderOptionsWithUploadToken extends CommonOptions, UploadOptions, WithUploadToken {
}
export interface VideoUploaderOptionsWithAccessToken extends CommonOptions, UploadOptions, WithAccessToken {
}
export interface VideoUploaderOptionsWithApiKey extends CommonOptions, UploadOptions, WithApiKey {
}
export interface UploadProgressEvent {
    uploadedBytes: number;
    totalBytes: number;
    chunksCount: number;
    chunksBytes: number;
    currentChunk: number;
    currentChunkUploadedBytes: number;
}
export declare class VideoUploader extends AbstractUploader<UploadProgressEvent> {
    private file;
    private chunkSize;
    private chunksCount;
    private fileSize;
    private fileName;
    constructor(options: VideoUploaderOptionsWithAccessToken | VideoUploaderOptionsWithUploadToken | VideoUploaderOptionsWithApiKey);
    upload(): Promise<VideoUploadResponse>;
    private uploadCurrentChunk;
}
export {};
