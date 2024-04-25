import {Admin} from "./administrator";

export class AdminManager {
    private mAdmins: Admin[]

    constructor(mAdmins: Admin[]) {
        this.mAdmins = mAdmins
    }

    public isAdminAuthorized(admin: Admin): boolean {
        return this.mAdmins.some(a => a.email === admin.email && a.passwort === admin.passwort);
    }

    public addAdmin(admin: Admin): void {
        this.mAdmins.push(admin);
    }
}