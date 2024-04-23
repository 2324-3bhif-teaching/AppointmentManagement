import express from "express";
import cors from "cors";
import {DB} from "../data/data";

const app = express();

app.use(cors());
app.use(express.json());

const port = 3000;
app.listen(port, () => {
    console.log(`[Server] Server is now running at http://localhost:${port}`);
    const db = DB.createDBConnection();
});