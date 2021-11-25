export declare class PromiseQueue {
    private queue;
    private working;
    constructor();
    add<T>(provider: () => Promise<T>): Promise<T>;
    private dequeue;
}
