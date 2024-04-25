import {Admin} from "../src/administrator";


describe('Admin', () => {
    it('should return correct email', () => {
        const admin = new Admin('test@example.com', 'password');
        expect(admin.email).toBe('test@example.com');
    });

    it('should return correct password', () => {
        const admin = new Admin('test@example.com', 'password');
        expect(admin.passwort).toBe('password');
    });

    it('should throw error if email is not set', () => {
        try {
            const admin = new Admin('', 'password');
            admin.email;
        } catch (err) {
            if (err instanceof Error) {
                expect(err.message).toBe("Email and Password must be set");
            }
        }
    });

    it('should throw error if password is not set', () => {
        try {
            const admin = new Admin('test@example.com', '');
            admin.passwort;
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).toBe("Email and Password must be set");
            }
        }
    });
});