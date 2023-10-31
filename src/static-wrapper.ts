import { VideoUploadResponse } from "./abstract-uploader";
import {
    ProgressiveUploader,
    ProgressiveUploaderOptionsWithAccessToken,
    ProgressiveUploaderOptionsWithApiKey,
    ProgressiveUploaderOptionsWithUploadToken,
} from "./progressive-video-uploader";
import {
    VideoUploader,
    VideoUploaderOptionsWithAccessToken,
    VideoUploaderOptionsWithApiKey,
    VideoUploaderOptionsWithUploadToken,
} from "./video-uploader";

type ProgressiveSession = {
    uploader: ProgressiveUploader;
    partsOnProgress: Record<number, (progress: number) => void>;
    currentPart: number;
};

export class UploaderStaticWrapper {
    static application: { name: string; version: string };
    static sdk: { name: string; version: string };
    static chunkSize: number = 50;
    static progressiveUploadSessions: Record<string, ProgressiveSession> = {};
    static standardUploaders: VideoUploader[] = [];

    /**
     * Sets the application name and version for the SDK.
     * @param name - The name of the application using the SDK.
     * @param version - The version of the application.
     */
    static setApplicationName(name: string, version: string): void {
        this.application = { name, version };
    }

    /**
     * Sets the sdk name and version for the SDK.
     * @param name - The name of the sdk using the SDK.
     * @param version - The version of the sdk.
     */
    static setSdkName(name: string, version: string): void {
        this.sdk = { name, version };
    }

    /**
     * Sets the chunk size for the video upload.
     * @param chunkSize - The size of each chunk in MB.
     */
    static setChunkSize(chunkSize: number): void {
        this.chunkSize = chunkSize;
    }

    /**
     * Creates a new progressive upload session with an upload token.
     * @param sessionId - The unique session identifier.
     * @param uploadToken - The upload token provided by the backend.
     * @param videoId - The ID of the video to be uploaded.
     */
    static createProgressiveUploadWithUploadTokenSession(
        sessionId: string,
        uploadToken: string,
        videoId: string
    ): void {
        return this.progressiveUploadCreationHelper({
            sessionId,
            uploadToken,
            videoId: videoId || undefined,
        });
    }

    /**
     * Creates a new progressive upload session with an API key.
     * @param sessionId - The unique session identifier.
     * @param apiKey - The API key provided by the backend.
     * @param videoId - The ID of the video to be uploaded.
     */
    static createProgressiveUploadWithApiKeySession(sessionId: string, apiKey: string, videoId: string): void {
        return this.progressiveUploadCreationHelper({
            sessionId,
            apiKey,
            videoId: videoId || undefined,
        });
    }

    /**
     * Uploads a part of a video in a progressive upload session.
     * @param sessionId - The unique session identifier.
     * @param file - The blob of the video part.
     * @param onProgress - The callback to call on progress updates.
     * @returns A string containing the JSON representation of the VideoUploadResponse object.
     */
    static async uploadPart(sessionId: string, file: Blob, onProgress: (progress: number) => void): Promise<string> {
        return await this.uploadPartHelper(sessionId, file, onProgress, async (session, blob) => {
            return await session.uploader.uploadPart(blob);
        });
    }

    /**
     * Uploads the last part of a video in a progressive upload session and finalizes the upload.
     * @param sessionId - The unique session identifier.
     * @param file - The blob of the video part.
     * @param onProgress - The callback to call on progress updates.
     * @returns A string containing the JSON representation of the VideoUploadResponse object.
     */
    static async uploadLastPart(
        sessionId: string,
        file: Blob,
        onProgress: (progress: number) => void
    ): Promise<string> {
        return await this.uploadPartHelper(sessionId, file, onProgress, async (session, blob) => {
            return await session.uploader.uploadLastPart(blob);
        });
    }

    /**
     * Cancels all ongoing uploads, both progressive and standard.
     */
    static cancelAll(): void {
        const sessions = this.progressiveUploadSessions;
        for (const session of Object.values(sessions)) {
            session.uploader.cancel();
        }

        for (const uploader of this.standardUploaders) {
            uploader.cancel();
        }
        this.progressiveUploadSessions = {};
        this.standardUploaders = [];
    }

    /**
     * Disposes a progressive upload session by its ID.
     * @param sessionId - The unique session identifier to dispose.
     */
    static disposeProgressiveUploadSession(sessionId: string): void {
        delete this.progressiveUploadSessions[sessionId];
    }

    /**
     * Uploads a video with an upload token.
     * @param file - The video file to be uploaded.
     * @param uploadToken - The upload token provided by the backend.
     * @param videoName - The name of the video.
     * @param onProgress - The callback to call on progress updates.
     * @param videoId - The ID of the video to be uploaded (optional).
     * @returns A string containing the JSON representation of the VideoUploadResponse object.
     */
    static async uploadWithUploadToken(
        file: Blob,
        uploadToken: string,
        videoName: string,
        onProgress: (event: number) => void,
        videoId?: string
    ): Promise<string> {
        return this.uploadHelper(file, onProgress, {
            uploadToken,
            videoName,
            videoId,
        });
    }

    /**
     * Uploads a video with an API key.
     * @param file - The video file to be uploaded.
     * @param apiKey - The API key provided by the backend.
     * @param onProgress - The callback to call on progress updates.
     * @param videoId - The ID of the video to be uploaded.
     * @returns A string containing the JSON representation of the VideoUploadResponse object.
     */
    static async uploadWithApiKey(
        file: Blob,
        apiKey: string,
        onProgress: (event: number) => void,
        videoId: string
    ): Promise<string> {
        return this.uploadHelper(file, onProgress, {
            apiKey,
            videoId,
        });
    }

    // Private methods below

    private static getProgressiveSession(sessionId: string): ProgressiveSession {
        return this.progressiveUploadSessions[sessionId];
    }

    private static storeProgressiveSession(sessionId: string, progressiveSession: ProgressiveSession): void {
        this.progressiveUploadSessions[sessionId] = progressiveSession;
    }

    private static storeStandardUploader(uploader: VideoUploader): void {
        this.standardUploaders.push(uploader);
    }

    private static progressiveUploadCreationHelper(options: {
        sessionId: string;
        uploadToken?: string;
        apiKey?: string;
        videoId?: string;
    }): void {
        const uploader = new ProgressiveUploader({
            ...(options as
                | ProgressiveUploaderOptionsWithAccessToken
                | ProgressiveUploaderOptionsWithUploadToken
                | ProgressiveUploaderOptionsWithApiKey),
            origin: this.getOriginHeader(),
        });

        uploader.onProgress((e) => {
            const onProgress = this.getProgressiveSession(options.sessionId).partsOnProgress[e.part];
            if (onProgress) {
                onProgress(e.uploadedBytes / e.totalBytes);
            }
        });

        this.storeProgressiveSession(options.sessionId, {
            uploader,
            partsOnProgress: {},
            currentPart: 1,
        });
    }

    private static async uploadPartHelper(
        sessionId: string,
        file: Blob,
        onProgress: (event: number) => void,
        uploadCallback: (session: ProgressiveSession, blob: Blob) => Promise<VideoUploadResponse | void>
    ): Promise<string> {
        const session = this.getProgressiveSession(sessionId);

        if (onProgress != null) {
            session.partsOnProgress[session.currentPart] = onProgress;
        }

        session.currentPart++;

        try {
            return JSON.stringify(await uploadCallback(session, file));
        } catch (e: any) {
            if (e.reason === "ABORTED") {
                throw new Error(e.reason);
            }
            throw new Error(e.title);
        }
    }

    private static async uploadHelper(
        blob: Blob,
        onProgress: (event: number) => void,
        options: {
            uploadToken?: string;
            apiKey?: string;
            videoName?: string;
            videoId?: string;
        }
    ): Promise<string> {
        const uploader = new VideoUploader({
            file: blob,
            chunkSize: 1024 * 1024 * this.chunkSize,
            origin: this.getOriginHeader(),
            ...options,
        } as VideoUploaderOptionsWithAccessToken | VideoUploaderOptionsWithUploadToken | VideoUploaderOptionsWithApiKey);

        this.storeStandardUploader(uploader);

        if (onProgress != null) {
            uploader.onProgress((e) => onProgress(e.uploadedBytes / e.totalBytes));
        }
        try {
            return JSON.stringify(await uploader.upload());
        } catch (e: any) {
            if (e.reason === "ABORTED") {
                throw new Error(e.reason);
            }
            throw new Error(e.title);
        }
    }

    private static getOriginHeader() {
        return {
            ...(this.sdk?.name && this.sdk?.version ? {sdk: this.sdk} : {}),
            ...(this.application?.name && this.application?.version ? {application: this.application} : {}),
        };
    }
}
