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
        await connection.run(`INSERT INTO Visitor (id, joinTime)
                              VALUES (1, '2024-05-02 15:15:24');`);
        await connection.run(`INSERT INTO Visitor (id, joinTime)
                              VALUES (2, '2024-05-03 08:48:13');`);
        await connection.run(`INSERT INTO Visitor (id, joinTime)
                              VALUES (3, '2024-05-02 08:50:56');`);
        await connection.run(`INSERT INTO Queue (id, name, station)
                              VALUES (1, 'Roboterführerschein-Controller', 1);`);
        await connection.run(`INSERT INTO Queue (id, name, station)
                              VALUES (2, 'Roboterführerschein-Matte', 1);`);
        await connection.run(`INSERT INTO Queue (id, name, station)
                              VALUES (3, 'VR-Brille', 1);`);
        await connection.run(`INSERT INTO WaitingPosition (id, visitor, queue)
                              VALUES (1, 1, 1);`);
        await connection.run(`INSERT INTO WaitingPosition (id, visitor, queue)
                              VALUES (2, 2, 1);`);
        await connection.run(`INSERT INTO WaitingPosition (id, visitor, queue)
                              VALUES (3, 2, 3);`);
        await connection.run(`INSERT INTO QueueManager (id, administrator, queue)
                              VALUES (1, 1, 1);`);
        await connection.run(`INSERT INTO QueueManager (id, administrator, queue)
                              VALUES (2, 1, 3);`);
        await connection.run(`INSERT INTO QueueManager (id, administrator, queue)
                              VALUES (3, 3, 1);`);
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
