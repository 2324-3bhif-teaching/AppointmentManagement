import {Statement} from "sqlite";
import {ServiceBase} from "../src/service-base";
import {Unit} from "../src/unit";
import {IQueue, IVisitor} from "../src/model";

export class VisitorService extends ServiceBase {
    constructor(unit: Unit) {
        super(unit);
    }

    public async getAll(): Promise<IVisitor> {
        const stmt: Statement = await this.unit.prepare('select * from Visitor');
        return await stmt.all<IVisitor>();
    }

    public async getById(id: number): Promise<IVisitor | null> {
        const stmt: Statement = await this.unit.prepare('select * from Visitor WHERE id = ?', id);
        return ServiceBase.nullIfUndefined(await stmt.get<IVisitor>());
    }

    public async getQueueByVisitorId(id: number): Promise<IQueue | null> {
        const stmt: Statement = await this.unit.prepare('SELECT q.* FROM Queue q JOIN WaitingPosition wm ON q.id = wm.queue WHERE wm.visitor = ?;', id);
        return ServiceBase.nullIfUndefined(await stmt.all<IQueue>());
    }

    public async insert(visitor: IVisitor): Promise<boolean> {
        const stmt = await this.unit.prepare('insert into Visitor (id, joinTime) values (?1, ?2)',
            {
                1: visitor.id,
                2: visitor.joinTime
            }
        );

        return await this.executeStmt(stmt);
    }
}