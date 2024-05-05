import express from "express";
import {Unit} from "../src/unit";
import {StatusCodes} from "http-status-codes";
import {QueueService} from "../data/queue-repo";
import {IQueue, IStation} from "../src/model";

export const queueRouter = express.Router();

queueRouter.get("/", async (_, res) => {
    const unit: Unit = await Unit.create(true);
    try {
        const service: QueueService = new QueueService(unit);
        const allIds: IQueue = await service.getAll();
        res.status(StatusCodes.OK).json(allIds);
    } catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});

queueRouter.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    const unit: Unit = await Unit.create(true);
    try {
        const service: QueueService = new QueueService(unit);
        const queue: IQueue | null = await service.getById(id);

        if (queue === null) {
            res.sendStatus(StatusCodes.NOT_FOUND);
        } else {
            res.status(StatusCodes.OK).json(queue);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});

queueRouter.get("/stations/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    const unit: Unit = await Unit.create(true);
    try {
        const service: QueueService = new QueueService(unit);
        const stations: IStation | null = await service.getStationByQueueId(id);

        if (stations === null) {
            res.sendStatus(StatusCodes.NOT_FOUND);
        } else {
            res.status(StatusCodes.OK).json(stations);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});