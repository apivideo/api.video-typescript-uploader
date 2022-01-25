export const MIN_CHUNK_SIZE = 1024 * 1024 * 5; // 5mb
export const DEFAULT_CHUNK_SIZE = 1024 * 1024 * 50; // 50mb
export const MAX_CHUNK_SIZE = 1024 * 1024 * 128; // 128mb
export const DEFAULT_RETRIES = 5;
export const DEFAULT_API_HOST = "ws.api.video";

export type VideoUploadResponse = {
    readonly videoId: string;
    readonly title: string;
    readonly description: string;
    readonly public: boolean;
    readonly panoramic: boolean;
    readonly mp4Support: boolean;
    readonly publishedAt: string;
    readonly createdAt: string;
    readonly uploadedAt: string;
    readonly tags: readonly string[];
    readonly metadata: readonly {
        readonly key: string;
        readonly value: string;
    }[];
    readonly source: {
      readonly type: string;
      readonly uri: string;
    };
    readonly assets: {
      readonly iframe: string;
      readonly player: string;
      readonly hls: string;
      readonly thumbnail: string;
    };
  };