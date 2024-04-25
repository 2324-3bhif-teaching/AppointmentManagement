export class Visitor {
    private mId: number;
    private mJoinTime: Date;

    constructor(mId: number, mJoinTime: Date) {
        this.mId = mId;
        this.mJoinTime = mJoinTime;
    }

    get id(): number {
        return this.mId;
    }
    get joinTime(): Date {
        return this.mJoinTime;
    }

}