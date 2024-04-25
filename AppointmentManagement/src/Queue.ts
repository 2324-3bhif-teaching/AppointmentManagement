import {Visitor} from "./Visitor";

export class Queue {
    private mWaitingPersons: Visitor[]

    constructor(mWaitingPersons: Visitor[]) {
        this.mWaitingPersons = mWaitingPersons
    }

    public getWaitingPersons(): Visitor[] {
        return this.mWaitingPersons
    }
    public addWaitingPersons(visitor: Visitor) {
        const duplicate = this.mWaitingPersons.find(v => v.id === visitor.id);
        if (!duplicate) {
            this.mWaitingPersons.push(visitor);
        }
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