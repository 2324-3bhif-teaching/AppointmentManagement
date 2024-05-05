import express from "express";
import cors from "cors";
import {DB} from "../data/data";
import {join} from "path";
import {adminRouter} from "../routers/admin-router";
import {queueRouter} from "../routers/queue-router";
import {stationRouter} from "../routers/station-router";
import {visitorRouter} from "../routers/visitor-router";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, "/public")));

app.use("/api/admin", adminRouter);
app.use("/api/queue", queueRouter);
app.use("/api/station", stationRouter);
app.use("/api/visitor", visitorRouter);

const port = 3000;
app.listen(port, async () => {
    console.log(`[Server] Server is now running at http://localhost:${port}`);
    const db = await DB.createDBConnection();

    try {
        await DB.ensureSampleDataInserted(db);
        console.log(`[Database] Sample data inserted`);
    } finally {
        await db.close();
    }
});