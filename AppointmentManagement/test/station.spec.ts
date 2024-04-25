import { Admin } from '../src/administrator';
import { AdminManager } from '../src/adminManager';
import { Station } from '../src/station';
import { Queue } from '../src/Queue';

describe('Station', () => {
    let station: Station;
    let adminManager: AdminManager;
    let admin: Admin;
    let queue: Queue;

    beforeEach(() => {
        admin = new Admin('admin@example.com', 'password');
        adminManager = new AdminManager([admin]);
        queue = new Queue([]);
        station = new Station('Station1', [queue], adminManager);
    });

    it('should add queue if admin is authorized', () => {
        const newQueue = new Queue([]);
        station.addQueue(admin, newQueue);
        expect(station.ques.includes(newQueue)).toBe(true);
    });

    it('should throw error if admin is not authorized', () => {
        const invalidAdmin = new Admin('invalid@example.com', 'password');
        const newQueue = new Queue([]);
        expect(() => station.addQueue(invalidAdmin, newQueue)).toThrow('Unauthorized admin');
    });

    it('should remove queue if admin is authorized', () => {
        station.removeQueue(admin, queue);
        expect(station.ques.includes(queue)).toBe(false);
    });

    it('should throw error if admin is not authorized to remove queue', () => {
        const invalidAdmin = new Admin('invalid@example.com', 'password');
        expect(() => station.removeQueue(invalidAdmin, queue)).toThrow('Unauthorized admin');
    });
});