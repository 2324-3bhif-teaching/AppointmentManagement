import {Queue} from "./Queue";
import {Admin} from "./administrator";
import {AdminManager} from "./adminManager";

export class Station {
    private mName: string
    private mQues: Queue[]
    private mAdminManager: AdminManager

    constructor(mName: string, mQues: Queue[], mAdminManager: AdminManager) {
        this.mName = mName
        this.mQues = mQues
        this.mAdminManager = mAdminManager
    }

    get name(): string {
        return this.mName;
    }

    get ques(): Queue[] {
        return this.mQues;
    }

    addQueue(admin: Admin, queue: Queue) {
        if (this.mAdminManager.isAdminAuthorized(admin)) {
            this.mQues.push(queue);
        } else {
            throw new Error('Unauthorized admin');
        }
    }

    removeQueue(admin: Admin, queue: Queue) {
        if (this.mAdminManager.isAdminAuthorized(admin)) {
            this.mQues = this.mQues.filter(q => q !== queue);
        } else {
            throw new Error('Unauthorized admin');
        }
    }
}