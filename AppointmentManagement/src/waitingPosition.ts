class WaitingPosition {
    private mVisitor: Visitor | undefined
    private mQueue: Queue

    constructor(mQueue: Queue) {
        this.mQueue = mQueue
        this.mVisitor = mQueue.getNextVisitor();
    }
}