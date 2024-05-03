import {Statement} from "sqlite";
import {ServiceBase} from "../src/service-base";
import {Unit} from "../src/unit";
import {IAdministrator, IStation} from "../src/model";

export class AdminService extends ServiceBase {
    constructor(unit: Unit) {
        super(unit);
    }

    public async getAll(): Promise<IAdministrator> {
        const stmt: Statement = await this.unit.prepare('select * from Administrator');
        return await stmt.all<IAdministrator>();
    }

    public async getById(id: number): Promise<IAdministrator | null> {
        const stmt: Statement = await this.unit.prepare('select * from Administrator WHERE id = ?', id);
        return ServiceBase.nullIfUndefined(await stmt.get<IAdministrator>());
    }

    public async getQueueByAdminId(id: number): Promise<IStation | null> {
        const stmt: Statement = await this.unit.prepare('SELECT q.* FROM Queue q JOIN QueueManager qm ON q.id = qm.queue WHERE qm.administrator = ?;', id);
        return ServiceBase.nullIfUndefined(await stmt.all<IStation>());
    }
}