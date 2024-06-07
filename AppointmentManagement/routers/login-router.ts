import express from "express";
import {LoginService} from "../data/login-repo";
import {Unit} from "../src/unit";

export const loginRouter = express.Router();

loginRouter.get("/", async (_, res) => {
    res.status(200).send("Login page");
});

loginRouter.get('/login/:code', async (req, res) => {
    const code = parseInt(req.params.code);
    const unit = await Unit.create(true);
    try{
        const login = new LoginService(unit);
        const success = await login.newCode(code);
        if(success === 1){
            res.redirect('./index.html');
        } else {
            res.status(401).send('Invalid Code');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});