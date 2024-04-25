import { Admin } from '../src/administrator';
import { AdminManager } from '../src/adminManager';

describe('AdminManager', () => {
    let adminManager: AdminManager;
    let admin: Admin;

    beforeEach(() => {
        admin = new Admin('admin@example.com', 'password');
        adminManager = new AdminManager([admin]);
    });

    it('should authorize valid admin', () => {
        expect(adminManager.isAdminAuthorized(admin)).toBe(true);
    });

    it('should not authorize invalid admin', () => {
        const invalidAdmin = new Admin('invalid@example.com', 'password');
        expect(adminManager.isAdminAuthorized(invalidAdmin)).toBe(false);
    });

    it('should add new admin', () => {
        const newAdmin = new Admin('newadmin@example.com', 'newpassword');
        adminManager.addAdmin(newAdmin);
        expect(adminManager.isAdminAuthorized(newAdmin)).toBe(true);
    });
});