import {Statement} from "sqlite";
import {ServiceBase} from "../src/service-base";
import {Unit} from "../src/unit";
import {IQueue, IVisitor, IWaitingPosition} from "../src/model";

export class VisitorService extends ServiceBase {
    constructor(unit: Unit) {
        super(unit);
    }

    public async getAll(): Promise<IVisitor> {
        const stmt: Statement = await this.unit.prepare('select * from Visitor');
        return await stmt.all<IVisitor>();
    }

    public async getAllWaitingPositions(): Promise<IWaitingPosition> {
        const stmt: Statement = await this.unit.prepare('select * from WaitingPosition');
        return await stmt.all<IWaitingPosition>();
    }

    public async getById(id: number): Promise<IVisitor | null> {
        const stmt: Statement = await this.unit.prepare('select * from Visitor WHERE id = ?', id);
        return ServiceBase.nullIfUndefined(await stmt.get<IVisitor>());
    }

    public async getQueueByVisitorId(id: number): Promise<IQueue | null> {
        const stmt: Statement = await this.unit.prepare('SELECT q.* FROM Queue q JOIN WaitingPosition wp ON q.id = wp.queueId WHERE wp.visitorId = ?;', id);
        return ServiceBase.nullIfUndefined(await stmt.all<IQueue>());
    }

    public async getVisitorPositionInQueue(visitorId: number, queueId: number): Promise<number | null> {
        const stmt: Statement = await this.unit.prepare(`SELECT COUNT(*) + 1 AS position
                                                         FROM WaitingPosition
                                                         WHERE queueId = ?1
                                                           AND visitorId != ?2
                                                           AND joinTime <= (SELECT joinTime
                                                                            FROM WaitingPosition
                                                                            WHERE visitorId = ?3
                                                                              AND queueId = ?4)`,
            {
                1: queueId,
                2: visitorId,
                3: visitorId,
                4: queueId
            });
        return ServiceBase.nullIfUndefined(await stmt.get<number | null>());

    }

    public async insert(visitor: IVisitor): Promise<boolean> {
        const result = await this.getById(visitor.id!);
        if (result === null) {
            const stmt = await this.unit.prepare('insert into Visitor (id) values (?1)',
                {
                    1: visitor.id,
                }
            );

            return await this.executeStmt(stmt);
        }
        return false;
    }

    public async isVisitorInQueue(visitorId: number, queueId: number): Promise<boolean> {
        const stmt = await this.unit.prepare('SELECT * FROM WaitingPosition WHERE visitorId = ?1 AND queueId = ?2',
            {
                1: visitorId,
                2: queueId
            });

        return (await stmt.get<any>()) !== undefined;
    }

    public async insertWaitingPosition(queueId: number, visitorId: number): Promise<boolean> {
        let currentDateTime = new Date();
        let formattedDateTime = currentDateTime.toISOString().replace('T', ' ').substring(0, 19);

        const stmt = await this.unit.prepare('insert into WaitingPosition (visitorId, queueId, joinTime) values (?1, ?2, ?3)',
            {
                1: visitorId,
                2: queueId,
                3: formattedDateTime,
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