import {Unit} from "./unit";
import {Statement} from "sqlite";

export abstract class ServiceBase {
    constructor(protected readonly unit: Unit) {}

    protected async executeStmt(stmt: Statement): Promise<[success: boolean, id: number | null]> {
        const result = await stmt.run();
        const id: number | null = ServiceBase.nullIfUndefined(result.lastID);
        return [result.changes === 1, id];
    }

    protected static nullIfUndefined<T>(entity: T | undefined): T | null {
        if (entity === undefined) {
            return null;
        }
        return entity;
    }

    protected static unwrapSingle<T>(obj: any | null | undefined, fieldName: string): T | null {
        obj = ServiceBase.nullIfUndefined(obj);
        return obj === null ? null : <T>obj[fieldName];
    }

    protected static unwrapAll<T>(obj: any[], fieldName: string): T[] {
        return obj.map(o => <T>o[fieldName]);
    }
}