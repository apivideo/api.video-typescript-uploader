export declare const MIN_CHUNK_SIZE: number;
export declare const DEFAULT_CHUNK_SIZE: number;
export declare const MAX_CHUNK_SIZE: number;
export declare const DEFAULT_RETRIES = 6;
export declare const DEFAULT_API_HOST = "ws.api.video";
export declare type VideoUploadResponse = {
    readonly videoId: string;
    readonly title?: string;
    readonly description?: string;
    readonly _public?: boolean;
    readonly panoramic?: boolean;
    readonly mp4Support?: boolean;
    readonly publishedAt?: Date;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
    readonly tags?: string[];
    readonly metadata?: {
        readonly key?: string;
        readonly value?: string;
    }[];
    readonly source?: {
        readonly type?: string;
        readonly uri?: string;
    };
    readonly assets?: {
        readonly iframe?: string;
        readonly player?: string;
        readonly hls?: string;
        readonly thumbnail?: string;
    };
};
declare type RetryStrategy = (retryCount: number, error: VideoUploadError) => number | null;
export interface CommonOptions {
    apiHost?: string;
    retries?: number;
    retryStrategy?: RetryStrategy;
}
export interface WithUploadToken {
    uploadToken: string;
    videoId?: string;
}
export interface WithAccessToken {
    accessToken: string;
    refreshToken?: string;
    videoId: string;
}
export interface WithApiKey {
    apiKey: string;
    videoId: string;
}
export declare type VideoUploadError = {
    status?: number;
    type?: string;
    title?: string;
    reason?: string;
    raw: string;
};
declare type HXRRequestParams = {
    parts?: {
        currentPart: number;
        totalParts: number | "*";
    };
    onProgress?: (e: ProgressEvent) => void;
    body: Document | XMLHttpRequestBodyInit | null;
};
export declare const DEFAULT_RETRY_STRATEGY: (maxRetries: number) => (retryCount: number, error: VideoUploadError) => number | null;
export declare abstract class AbstractUploader<T> {
    protected uploadEndpoint: string;
    protected videoId?: string;
    protected retries: number;
    protected headers: {
        [name: string]: string;
    };
    protected onProgressCallbacks: ((e: T) => void)[];
    protected refreshToken?: string;
    protected apiHost: string;
    protected retryStrategy: RetryStrategy;
    constructor(options: CommonOptions & (WithAccessToken | WithUploadToken | WithApiKey));
    onProgress(cb: (e: T) => void): void;
    protected parseErrorResponse(xhr: XMLHttpRequest): VideoUploadError;
    protected apiResponseToVideoUploadResponse(response: any): VideoUploadResponse;
    protected sleep(duration: number): Promise<void>;
    protected xhrWithRetrier(params: HXRRequestParams): Promise<VideoUploadResponse>;
    protected createFormData(file: Blob, fileName: string, startByte?: number, endByte?: number): FormData;
    doRefreshToken(): Promise<void>;
    private createXhrPromise;
    private withRetrier;
}
export {};
