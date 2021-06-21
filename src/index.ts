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

const DEFAULT_CHUNK_SIZE = 1024 * 1024; // 1mb
const DEFAULT_UPLOAD_ENDPOINT = "https://ws.api.video/upload";

export class VideoUploader {
    private file: File;
    private chunkSize: number;
    private uploadEndpoint: string;
    private uploadToken: string;
    private currentChunk: number = 0;
    private chunksCount: number;
    private fileSize: number;
    private fileName: string;
    private videoId?: string;
    private onProgressCallbacks: ((e: UploadProgressEvent) => void)[] = [];

    constructor(options: Options) {
        this.validateOptions(options);
        this.chunkSize = options.chunkSize || DEFAULT_CHUNK_SIZE;
        this.uploadEndpoint = options.uploadEndpoint || DEFAULT_UPLOAD_ENDPOINT;
        this.uploadToken = options.uploadToken;
        this.file = options.file;
        this.fileSize = this.file.size;
        this.fileName = this.file.name;

        this.chunksCount = Math.ceil(this.fileSize / this.chunkSize);
    }

    public onProgress(cb: () => UploadProgressEvent) {
        this.onProgressCallbacks.push(cb);
    }

    public upload(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            let response;
            while (this.currentChunk < this.chunksCount) {
                response = await this.uploadCurrentChunk();
                this.videoId = response.videoId;
                this.currentChunk++;
            }
            resolve(response);
        });
    }

    private validateOptions(options: Options) {
        const required = ['file', 'uploadToken']
        required.forEach(r => {
            if (!(options as any)[r]) throw new Error(`"${r}" is missing`);
        });
    }

    private createFormData(startByte: number, endByte: number): FormData {
        const chunk = this.file.slice(startByte, endByte);
        const chunkForm = new FormData();
        if (this.videoId) {
            chunkForm.append("videoId", this.videoId);
        }
        chunkForm.append("file", chunk, this.fileName);
        return chunkForm;
    }

    private uploadCurrentChunk(): Promise<any> {
        return new Promise((resolve, reject) => {
            const firstByte = this.currentChunk * this.chunkSize;
            const computedLastByte = (this.currentChunk + 1) * this.chunkSize;
            const lastByte = (computedLastByte > this.fileSize ? this.fileSize : computedLastByte);

            const contentRange = `bytes ${firstByte}-${lastByte - 1}/${this.fileSize}`;

            const xhr = new XMLHttpRequest();
            xhr.open("POST", `${this.uploadEndpoint}?token=${this.uploadToken}`, true);
            xhr.setRequestHeader("Content-Range", contentRange);

            xhr.onload = (e) => resolve(JSON.parse(xhr.response));
            xhr.onprogress = (e) => this.onProgressCallbacks.forEach(cb => cb({
                loaded: e.loaded + firstByte,
                total: this.fileSize
            }));
            xhr.send(this.createFormData(firstByte, lastByte));
        });
    }
}