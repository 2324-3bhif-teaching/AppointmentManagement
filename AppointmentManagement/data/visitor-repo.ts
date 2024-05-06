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
        const stmt: Statement = await this.unit.prepare('SELECT q.* FROM Queue q JOIN WaitingPosition wp ON q.id = wp.queueId WHERE wp.visitorId = ?;', id);
        return ServiceBase.nullIfUndefined(await stmt.all<IQueue>());
    }

    public async insert(visitor: IVisitor): Promise<boolean> {
        const stmt = await this.unit.prepare('insert into Visitor (id) values (?1)',
            {
                1: visitor.id,
            }
        );

        return await this.executeStmt(stmt);
    }

    public async deleteQueueByVisitorId(queueId: number, visitorId: number): Promise<boolean> {
        const stmt = await this.unit.prepare('DELETE FROM WaitingPosition WHERE visitorId = ?1 AND queueId = ?2',
            {
            1: visitorId,
            2: queueId
        });

        return await this.executeStmt(stmt);
    }
}