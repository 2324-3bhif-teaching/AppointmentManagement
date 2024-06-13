    export interface IAdministrator {
    id?: number;
    email: string;
    passwort: string;
}

export interface IQueue {
    id?: number;
    name: string;
    stationId: number;
}

export interface IQueueManager {
    id?: number;
    administratorId: number;
    queueId: number;
}

export interface IStation {
    id?: number;
    name: string;
}

export interface IVisitor {
    id?: number;
}

export interface IWaitingPosition {
    id?: number;
    visitorId: number;
    queueId: number;
    joinTime: Date;
    finished: number;
}