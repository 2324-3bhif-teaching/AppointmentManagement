class Admin {
    private mEmail: string;
    private mPasswort: string;

    constructor(mEmail: string, mPasswort: string) {
        this.mEmail = mEmail;
        this.mPasswort = mPasswort;
    }

    get email(): string {
        return this.mEmail;
    }
    get passwort(): string {
        return this.mPasswort;
    }
}