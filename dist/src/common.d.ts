export declare const MIN_CHUNK_SIZE: number;
export declare const DEFAULT_CHUNK_SIZE: number;
export declare const MAX_CHUNK_SIZE: number;
export declare const DEFAULT_RETRIES = 5;
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
export declare type VideoUploadError = {
    status: number;
    type?: string;
    title?: string;
    reason?: string;
    raw: string;
};
export declare const apiResponseToVideoUploadResponse: (response: any) => VideoUploadResponse;
export declare const parseErrorResponse: (xhr: XMLHttpRequest) => VideoUploadError;
