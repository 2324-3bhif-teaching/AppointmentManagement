import express from "express";

export const adminRouter = express.Router();

adminRouter.get("/", (req, res) => {
    res.sendFile("admin.html", {root: "public"});
})