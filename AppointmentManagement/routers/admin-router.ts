import express from "express";
import {Unit} from "../src/unit";
import {StatusCodes} from "http-status-codes";
import {AdminService} from "../data/admin-repo";
import {IAdministrator, IStation} from "../src/model";

export const adminRouter = express.Router();

adminRouter.get("/", async (_, res) => {
    const unit: Unit = await Unit.create(true);
    try {
        const service: AdminService = new AdminService(unit);
        const allIds = await service.getAll();
        res.status(StatusCodes.OK).json(allIds);
    } catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});

adminRouter.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    const unit: Unit = await Unit.create(true);
    try {
        const service: AdminService = new AdminService(unit);
        const administrator: IAdministrator | null = await service.getById(id);

        if (administrator === null) {
            res.sendStatus(StatusCodes.NOT_FOUND);
        } else {
            res.status(StatusCodes.OK).json(administrator);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});

adminRouter.get("/queues/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    const unit: Unit = await Unit.create(true);
    try {
        const service: AdminService = new AdminService(unit);
        const queues: IStation | null = await service.getQueueByAdminId(id);

        if (queues === null) {
            res.sendStatus(StatusCodes.NOT_FOUND);
        } else {
            res.status(StatusCodes.OK).json(queues);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});