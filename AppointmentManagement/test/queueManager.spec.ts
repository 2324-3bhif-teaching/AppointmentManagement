import { QueueManager } from '../src/queueManager';
import { Queue } from '../src/Queue';
import { Admin } from '../src/administrator';
import { Visitor } from '../src/Visitor';

describe('QueueManager', () => {
    let queueManager: QueueManager;
    let queue: Queue;
    let admin: Admin;
    let visitor: Visitor;

    beforeEach(() => {
        visitor = new Visitor(1, new Date());
        queue = new Queue([visitor]);
        admin = new Admin('test@example.com', 'password');
        queueManager = new QueueManager(queue, admin);
    });

    it('should return correct queue', () => {
        expect(queueManager.getQueue()).toEqual(queue);
    });

    it('should return correct admin', () => {
        expect(queueManager.getAdmin()).toEqual(admin);
    });

    it('should set admin correctly', () => {
        const newAdmin = new Admin('new@example.com', 'newpassword');
        queueManager.setAdmin(newAdmin);
        expect(queueManager.getAdmin()).toEqual(newAdmin);
    });
});