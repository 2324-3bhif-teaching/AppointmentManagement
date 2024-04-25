export class Admin {
    private mEmail: string | undefined;
    private mPasswort: string | undefined;

    constructor(mEmail: string, mPasswort: string) {
        if(mEmail === undefined || mEmail === '' || mPasswort === undefined || mPasswort === '') {
            throw new Error("Email and Password must be set");
        }
        this.mEmail = mEmail;
        this.mPasswort = mPasswort;
    }

    get email(): string {
        if(this.mEmail === undefined)
            throw new Error("Email is not set");
        return this.mEmail;
    }
    get passwort(): string {
        if (this.mPasswort === undefined)
            throw new Error("Password is not set");
        return this.mPasswort;
    }
}