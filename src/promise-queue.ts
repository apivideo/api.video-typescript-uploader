
type QueueEntry = {
    provider: ()=>Promise<any>,
    callback: (result: any, error?: any) => void
};

export class PromiseQueue {
    private queue: QueueEntry[];
    private working = false;

    constructor() {
        this.queue = [];
    }

    public add<T>(provider: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            const entry = {
                provider,
                callback: (res: any, error?: any) => error ? reject(error) : resolve(res)
            };
            this.queue = this.queue.concat(entry);
            if(!this.working) {
                this.working = true;
                this.dequeue();
            }
        });
    }

    private dequeue() {
        if(this.queue.length === 0) {
            this.working = false;
            return;
        };

        const current = this.queue.shift() as QueueEntry;

        current.provider.call(this).then((res) => {
            current.callback(res);
            this.dequeue();
        }).catch(err => {
            current.callback(undefined, err);
            this.dequeue();
        });
    }
}