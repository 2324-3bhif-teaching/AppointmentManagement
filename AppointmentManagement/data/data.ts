import { Database as Driver} from "sqlite3";
import { open, Database } from "sqlite";

export const dbFileName = './data/appointment.db';

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

    public static async ensureSampleDataInserted(connection: Database): Promise<void> {
        await connection.run(`DELETE FROM WaitingPosition;`);
        await connection.run(`DELETE FROM QueueManager;`);
        await connection.run(`DELETE FROM Queue;`);
        await connection.run(`DELETE FROM Station;`);
        await connection.run(`DELETE FROM Administrator;`);
        await connection.run(`DELETE FROM Visitor;`);

        await connection.run(`INSERT INTO Station (id, name)
                              VALUES (1, 'Roboterführerschein');`);
        await connection.run(`INSERT INTO Station (id, name)
                              VALUES (2, 'Softwareentwicklung');`);
        await connection.run(`INSERT INTO Station (id, name)
                              VALUES (3, 'Führung');`);
        await connection.run(`INSERT INTO Administrator (id, email, passwort)
                              VALUES (1, 'admin@htl-leonding.ac.at', 'admin');`);
        await connection.run(`INSERT INTO Administrator (id, email, passwort)
                              VALUES (2, 'fabian@htl-leonding.ac.at', '123');`);
        await connection.run(`INSERT INTO Administrator (id, email, passwort)
                              VALUES (3, 'test@htl-leonding.ac.at', 'abc');`);
        await connection.run(`INSERT INTO Visitor (id)
                              VALUES (1);`);
        await connection.run(`INSERT INTO Visitor (id)
                              VALUES (2);`);
        await connection.run(`INSERT INTO Visitor (id)
                              VALUES (3);`);
        await connection.run(`INSERT INTO Queue (id, name, stationId)
                              VALUES (1, 'Roboterführerschein-Controller', 1);`);
        await connection.run(`INSERT INTO Queue (id, name, stationId)
                              VALUES (2, 'Roboterführerschein-Matte', 3);`);
        await connection.run(`INSERT INTO Queue (id, name, stationId)
                              VALUES (3, 'VR-Brille', 1);`);

        await connection.run(`INSERT INTO WaitingPosition (id, visitorId, queueId, joinTime, finished)
                              VALUES (2, 2, 1, '2024-5-5 19:28:19', 0);`);
        await connection.run(`INSERT INTO WaitingPosition (id, visitorId, queueId, joinTime, finished)
                              VALUES (3, 2, 3, '2024-5-5 19:16:55', 0);`);
        await connection.run(`INSERT INTO WaitingPosition (id, visitorId, queueId, joinTime, finished)
                              VALUES (6, 2, 2, '2024-5-5 17:16:05', 0);`);

        await connection.run(`INSERT INTO WaitingPosition (id, visitorId, queueId, joinTime, finished)
                              VALUES (4, 1, 3, '2024-5-5 18:27:04', 0);`);
        await connection.run(`INSERT INTO WaitingPosition (id, visitorId, queueId, joinTime, finished)
                              VALUES (5, 1, 2, '2024-5-5 19:23:19', 0);`);
        await connection.run(`INSERT INTO WaitingPosition (id, visitorId, queueId, joinTime, finished)
                              VALUES (1, 1, 1, '2024-5-5 19:27:04', 0);`);

        await connection.run(`INSERT INTO QueueManager (id, administratorId, queueId)
                              VALUES (1, 1, 1);`);
        await connection.run(`INSERT INTO QueueManager (id, administratorId, queueId)
                              VALUES (2, 1, 3);`);
        await connection.run(`INSERT INTO QueueManager (id, administratorId, queueId)
                              VALUES (3, 3, 1);`);
    }

    private static async ensureTablesCreated(connection: Database): Promise<void> {

        await connection.run(`CREATE TABLE IF NOT EXISTS Administrator
                              (
                                  id           INTEGER NOT NULL primary key ,
                                  email        TEXT    NOT NULL,
                                  passwort     TEXT    NOT NULL
                              ) strict`
        );

        await connection.run(`CREATE TABLE IF NOT EXISTS Station
                              (
                                  id           INTEGER NOT NULL primary key autoincrement,
                                  name         TEXT    NOT NULL
                              ) strict`
        );

        await connection.run(`CREATE TABLE IF NOT EXISTS Queue
                              (
                                  id             INTEGER NOT NULL primary key autoincrement,
                                  name           TEXT    NOT NULL,
                                  stationId        INTEGER NOT NULL,
                                  CONSTRAINT fk_station FOREIGN KEY (stationId) REFERENCES Station (id)
                              ) strict`
        );

        await connection.run(`CREATE TABLE IF NOT EXISTS QueueManager
                              (
                                  id              INTEGER NOT NULL primary key autoincrement ,
                                  administratorId   INTEGER NOT NULL,
                                  queueId           INTEGER NOT NULL,
                                  CONSTRAINT fk_administrator FOREIGN KEY (administratorId) REFERENCES Administrator (id),
                                  CONSTRAINT fk_queue FOREIGN KEY (queueId) REFERENCES Queue (id)
                              ) strict`
        );

        await connection.run(`CREATE TABLE IF NOT EXISTS Visitor
                              (
                                  id           INTEGER NOT NULL primary key
                              ) strict`
        );

        await connection.run(`CREATE TABLE IF NOT EXISTS WaitingPosition
                              (
                                  id           INTEGER NOT NULL primary key autoincrement ,
                                  visitorId      INTEGER NOT NULL,
                                  queueId        INTEGER NOT NULL,
                                  joinTime      TEXT NOT NULL,
                                  finished      INTEGER DEFAULT 0,
                                  CONSTRAINT fk_visitor FOREIGN KEY (visitorId) REFERENCES Visitor (id),
                                  CONSTRAINT fk_queue FOREIGN KEY (queueId) REFERENCES Queue (id)
                              ) strict`
        );
    }
}
