import { Queue } from '../src/Queue';
import { Visitor } from '../src/Visitor';

describe('Queue', () => {
    let queue: Queue;
    let visitor1: Visitor;
    let visitor2: Visitor;
    let visitor3: Visitor;

    beforeEach(() => {
        visitor1 = new Visitor(1, new Date());
        visitor2 = new Visitor(2, new Date());
        visitor3 = new Visitor(1, new Date()); // Visitor with duplicate ID
        queue = new Queue([visitor1]);
    });

    it('should return correct waiting persons', () => {
        expect(queue.getWaitingPersons()).toEqual([visitor1]);
    });

    it('should add waiting person correctly', () => {
        queue.addWaitingPersons(visitor2);
        expect(queue.getWaitingPersons()).toEqual([visitor1, visitor2]);
    });

    it('should not add visitor with duplicate ID', () => {
        queue.addWaitingPersons(visitor3);
        expect(queue.getWaitingPersons()).toEqual([visitor1]); // The queue should not change
    });

    it('should remove waiting person correctly', () => {
        queue.addWaitingPersons(visitor2);
        queue.removeWaitingPersons(visitor1);
        expect(queue.getWaitingPersons()).toEqual([visitor2]);
    });

    it('should set waiting persons correctly', () => {
        queue.setWaitingPersons([visitor2]);
        expect(queue.getWaitingPersons()).toEqual([visitor2]);
    });

    it('should get next visitor correctly', () => {
        queue.addWaitingPersons(visitor2);
        const nextVisitor = queue.getNextVisitor();
        expect(nextVisitor).toEqual(visitor2);
        expect(queue.getWaitingPersons()).toEqual([visitor1]);
    });
});