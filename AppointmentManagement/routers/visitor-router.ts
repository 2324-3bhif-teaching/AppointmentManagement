import express from "express";
import {Unit} from "../src/unit";
import {StatusCodes} from "http-status-codes";
import {VisitorService} from "../data/visitor-repo";
import {IQueue, IVisitor} from "../src/model";

export const visitorRouter = express.Router();

visitorRouter.get("/", async (_, res) => {
    const unit: Unit = await Unit.create(true);
    try {
        const service: VisitorService = new VisitorService(unit);
        const allIds = await service.getAll();
        res.status(StatusCodes.OK).json(allIds);
    } catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});

visitorRouter.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    const unit: Unit = await Unit.create(true);
    try {
        const service: VisitorService = new VisitorService(unit);
        const visitor: IVisitor | null = await service.getById(id);

        if (visitor === null) {
            res.sendStatus(StatusCodes.NOT_FOUND);
        } else {
            res.status(StatusCodes.OK).json(visitor);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});

visitorRouter.get("/queues/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    const unit: Unit = await Unit.create(true);
    try {
        const service: VisitorService = new VisitorService(unit);
        const queues: IQueue | null = await service.getQueueByVisitorId(id);

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

visitorRouter.get("/waitingPositions/visitor/:visitorId/queue/:queueId", async (req, res) => {
    const visitorId = parseInt(req.params.visitorId);
    const queueId = parseInt(req.params.queueId);

    const unit: Unit = await Unit.create(true);
    try {
        const service: VisitorService = new VisitorService(unit);
        const position: number | null = await service.getVisitorPositionInQueue(visitorId, queueId);

        if (position === null) {
            res.sendStatus(StatusCodes.NOT_FOUND);
        } else {
            res.status(StatusCodes.OK).json(position);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});

visitorRouter.get("/waitingPositions/queued", async (_, res) => {
    const unit: Unit = await Unit.create(true);
    try {
        const service: VisitorService = new VisitorService(unit);
        const allIds = await service.getAllWaitingPositions();
        res.status(StatusCodes.OK).json(allIds);
    } catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});

visitorRouter.post("/", async (req, res) => {
    const unit: Unit = await Unit.create(false);

    try {
        const service: VisitorService = new VisitorService(unit);

        const visitor: IVisitor = {
            id: req.body.id,
        };

        const success = await service.insert(visitor);

        if (success) {
            await unit.complete(true);
            res.status(StatusCodes.CREATED).send(true);
        } else {
            await unit.complete(false);
            res.status(StatusCodes.NOT_FOUND).send(false);
        }
    } catch (error) {
        console.error('Error in POST /visitor:', error);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});

visitorRouter.delete("/queues/:queueId/visitor/:visitorId", async (req, res) => {
    const queueId = parseInt(req.params.queueId);
    const visitorId = parseInt(req.params.visitorId);

    const unit: Unit = await Unit.create(true);
    try {
        const service: VisitorService = new VisitorService(unit);
        const success = await service.deleteQueueByVisitorId(queueId, visitorId);

        if (success) {
            await unit.complete();
            res.status(StatusCodes.OK).send(true);
        } else {
            await unit.complete();
            res.status(StatusCodes.NOT_FOUND).send(false);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});