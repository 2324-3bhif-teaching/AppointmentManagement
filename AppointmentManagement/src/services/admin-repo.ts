import {Statement} from "sqlite";
import {ServiceBase} from "../service-base";
import {Unit} from "../unit";
import {IAdministrator, IStation} from "../model";

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
        const stmt: Statement = await this.unit.prepare('SELECT q.* FROM Queue q JOIN QueueManager qm ON q.id = qm.queueId WHERE qm.administratorId = ?;', id);
        return ServiceBase.nullIfUndefined(await stmt.all<IStation>());
    }
}