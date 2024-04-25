import {Visitor} from "../src/Visitor";
import {Queue} from "../src/Queue";
import {WaitingPosition} from "../src/waitingPosition";

describe('Visitor', () => {
    it('should return correct id', () => {
        const visitor = new Visitor(1, new Date());
        expect(visitor.id).toBe(1);
    });

    it('should return correct joinTime', () => {
        const joinTime = new Date();
        const visitor = new Visitor(1, joinTime);
        expect(visitor.joinTime).toEqual(joinTime);
    });
});