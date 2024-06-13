import express from "express";
import cors from "cors";
import {DB} from "../data/data";
import {join} from "path";
import {adminRouter} from "./routers/admin-router";
import {queueRouter} from "./routers/queue-router";
import {stationRouter} from "./routers/station-router";
import {visitorRouter} from "./routers/visitor-router";
import session from 'express-session';
import Keycloak from 'keycloak-connect';

const app = express();

const memoryStore = new session.MemoryStore();
app.use(session({
    secret: 'u4ZhRf6B@@FUmLsFmpeGSdQKmfZ@YVBYqc@zQh9Re2y3^VzLV5rST$9EbPW2&%X!9dLz5piKHBmjcMPU4hqZzm3ud6Y7h*aMzNA^^@BDn2!BC7a', //TODO: change secret and save in .env
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));
const keycloak = new Keycloak({ store: memoryStore });

app.use(keycloak.middleware({
    logout: '/logout'
}));

app.get('/logout', keycloak.protect(), (req: any, res) => {
    req.kauth.logout();
    res.redirect('http://localhost:3000/index.html');
});

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, "../public")));

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