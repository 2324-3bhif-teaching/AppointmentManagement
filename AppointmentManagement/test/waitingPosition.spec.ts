import { WaitingPosition } from '../src/waitingPosition';
import { Queue } from '../src/Queue';
import { Visitor } from '../src/Visitor';

describe('WaitingPosition', () => {
    let waitingPosition: WaitingPosition;
    let queue: Queue;
    let visitor: Visitor;

    beforeEach(() => {
        visitor = new Visitor(1, new Date());
        queue = new Queue([visitor]);
        waitingPosition = new WaitingPosition(queue);
    });

    it('should return correct visitor', () => {
        expect(waitingPosition.visitor).toEqual(visitor);
    });

    it('should return undefined if no visitor in queue', () => {
        const emptyQueue = new Queue([]);
        const emptyWaitingPosition = new WaitingPosition(emptyQueue);
        expect(emptyWaitingPosition.visitor).toBeUndefined();
    });
});