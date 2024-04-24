class Queue {
    private mWaitingPersons: Visitor[]

    constructor(mWaitingPersons: Visitor[]) {
        this.mWaitingPersons = mWaitingPersons
    }

    public getWaitingPersons(): Visitor[] {
        return this.mWaitingPersons
    }
    public addWaitingPersons(visitor: Visitor) {
        this.mWaitingPersons.push(visitor)
    }
    public removeWaitingPersons(visitor: Visitor) {
        this.mWaitingPersons = this.mWaitingPersons.filter((v) => v !== visitor)
    }
    public setWaitingPersons(visitor: Visitor[]) {
        this.mWaitingPersons = visitor;
    }
    public getNextVisitor(): Visitor | undefined{
        return this.mWaitingPersons.pop()
    }
}