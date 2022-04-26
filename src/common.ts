export const MIN_CHUNK_SIZE = 1024 * 1024 * 5; // 5mb
export const DEFAULT_CHUNK_SIZE = 1024 * 1024 * 50; // 50mb
export const MAX_CHUNK_SIZE = 1024 * 1024 * 128; // 128mb
export const DEFAULT_RETRIES = 5;
export const DEFAULT_API_HOST = "ws.api.video";

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

export type VideoUploadError = {
  status: number;
  type?: string;
  title?: string;
  reason?: string;
  raw: string;
}

export const apiResponseToVideoUploadResponse = (response: any): VideoUploadResponse => {
  const res = {
    ...response,
    _public: response.public,
    publishedAt: response.publishedAt ? new Date(response.publishedAt) : undefined,
    createdAt: response.createdAt ? new Date(response.createdAt) : undefined,
    updatedAt: response.updatedAt ? new Date(response.updatedAt) : undefined,
  };
  delete res.public;
  return res;
}

export const parseErrorResponse = (xhr: XMLHttpRequest): VideoUploadError => {
  try {
    const parsedResponse = JSON.parse(xhr.response);

    return {
      status: xhr.status,
      raw: xhr.response,
      ...parsedResponse
    }
  } catch (e) {
    // empty
  }

  return {
    status: xhr.status,
    raw: xhr.response,
    reason: "UNKWOWN",
  }
}

export const parseUserConfig = (options: { apiHost?: string, uploadToken?: string, accessToken?: string, apiKey?: string, videoId?: string }): {uploadEndpoint: string, authHeader?: string, videoId?: string} => {
  const apiHost = options.apiHost || DEFAULT_API_HOST;

  if (options.uploadToken) {
    return {
      ...(options.videoId ? { videoId: options.videoId } : {}),
      uploadEndpoint: `https://${apiHost}/upload?token=${options.uploadToken}`
    }
  }

  if (options.accessToken) {
    if (!options.videoId) {
      throw new Error("'videoId' is missing");
    }
    return {
      uploadEndpoint: `https://${apiHost}/videos/${options.videoId}/source`,
      authHeader: `Bearer ${options.accessToken}`
    }
  }

  if (options.apiKey) {
    if (!options.videoId) {
      throw new Error("'videoId' is missing");
    }
    return {
      uploadEndpoint: `https://${apiHost}/videos/${options.videoId}/source`,
      authHeader: `Basic ${btoa(options.apiKey + ":")}`
    }
  }

  throw new Error(`You must provide either an accessToken, an uploadToken or an API key`);
}