import { Database as Driver} from "sqlite3";
import { open, Database } from "sqlite";

export const dbFileName = './data/database/appointment.db';

export class DB {
    public static async createDBConnection(): Promise<Database> {
        const db = await open({
            filename: `./${dbFileName}`,
            driver: Driver
        });
        await db.run('PRAGMA foreign_keys = ON');

        await DB.ensureTablesCreated(db);
        return db;
    }

    public static async beginTransaction(connection: Database): Promise<void> {
        await connection.run('begin transaction;');
    }

    public static async commitTransaction(connection: Database): Promise<void> {
        await connection.run('commit;');
    }

    public static async rollbackTransaction(connection: Database): Promise<void> {
        await connection.run('rollback;');
    }

    private static async ensureTablesCreated(connection: Database): Promise<void> {
        await connection.run(`CREATE TABLE IF NOT EXISTS Administrator
                              (
                                  id           INTEGER NOT NULL primary key,
                                  email        TEXT    NOT NULL,
                                  passwort     TEXT    NOT NULL
                              ) strict`
        );

        await connection.run(`CREATE TABLE IF NOT EXISTS Station
                              (
                                  id           INTEGER NOT NULL primary key,
                                  name         TEXT    NOT NULL
                              ) strict`
        );

        await connection.run(`CREATE TABLE IF NOT EXISTS Queue
                              (
                                  id             INTEGER NOT NULL primary key,
                                  name           TEXT    NOT NULL,
                                  station        INTEGER NOT NULL,
                                  CONSTRAINT fk_station FOREIGN KEY (station) REFERENCES Station (id)
                              ) strict`
        );

        await connection.run(`CREATE TABLE IF NOT EXISTS QueueManager
                              (
                                  id              INTEGER NOT NULL primary key,
                                  administrator   INTEGER NOT NULL,
                                  queue           INTEGER NOT NULL,
                                  CONSTRAINT fk_administrator FOREIGN KEY (administrator) REFERENCES Administrator (id),
                                  CONSTRAINT fk_queue FOREIGN KEY (queue) REFERENCES Queue (id)
                              ) strict`
        );

        await connection.run(`CREATE TABLE IF NOT EXISTS Visitor
                              (
                                  id           INTEGER NOT NULL primary key,
                                  joinTime     TEXT    NOT NULL
                              ) strict`
        );

        await connection.run(`CREATE TABLE IF NOT EXISTS WaitingPosition
                              (
                                  id           INTEGER NOT NULL primary key,
                                  visitor      INTEGER NOT NULL,
                                  queue        INTEGER NOT NULL,
                                  CONSTRAINT fk_visitor FOREIGN KEY (visitor) REFERENCES Visitor (id),
                                  CONSTRAINT fk_queue FOREIGN KEY (queue) REFERENCES Queue (id)
                              ) strict`
        );
    }
}
