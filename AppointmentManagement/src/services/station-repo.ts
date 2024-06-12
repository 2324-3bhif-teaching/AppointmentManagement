import {Statement} from "sqlite";
import {ServiceBase} from "../service-base";
import {Unit} from "../unit";
import {IStation} from "../model";

export class StationService extends ServiceBase {
    constructor(unit: Unit) {
        super(unit);
    }

    public async getAll(): Promise<IStation> {
        const stmt: Statement = await this.unit.prepare('select * from Station');
        return await stmt.all<IStation>();
    }

    public async getById(id: number): Promise<IStation | null> {
        const stmt: Statement = await this.unit.prepare('select * from Station WHERE id = ?', id);
        return ServiceBase.nullIfUndefined(await stmt.get<IStation>());
    }
}