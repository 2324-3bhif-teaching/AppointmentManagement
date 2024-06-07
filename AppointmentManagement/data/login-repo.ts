import {Statement} from "sqlite";
import {Unit} from "../src/unit";
import {ServiceBase} from "../src/service-base";

export class LoginService extends ServiceBase {

    constructor(unit: Unit) {
        super(unit);
    }

    public async newCode(code:number ): Promise<number> {
        const stmt: Statement = await this.unit.prepare('INSERT INTO Visitor (id) VALUES (?)', code);
        const res = await stmt.run();
        if(res.changes === 1){
            return 1;
        } else {
            return 0;
        }
    }
}