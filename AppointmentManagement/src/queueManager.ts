import {Admin} from "./administrator";
import {Queue} from "./Queue";

export class QueueManager {
    private mQueue: Queue
    private mAdmin: Admin

    constructor(mQueue: Queue, mAdmin: Admin) {
        this.mQueue = mQueue
        this.mAdmin = mAdmin
    }
    public getQueue(): Queue {
        return this.mQueue
    }
    public getAdmin(): Admin {
        return this.mAdmin
    }
    public setAdmin(admin: Admin) {
        this.mAdmin = admin
    }
}