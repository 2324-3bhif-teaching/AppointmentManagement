import express from "express";
import {DB} from "../data/data";

export const adminRouter = express.Router();

adminRouter.get("/", async (req, res) => {
    const data = await DB.createDBConnection();
    const stmnt = await data.prepare("SELECT * FROM Administrator");
    const result = await stmnt.all();
    res.json(result);
})