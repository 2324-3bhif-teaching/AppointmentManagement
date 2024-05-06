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

export interface QueueManager {
    id?: number;
    administratorId: number;
    queueId: number;
}

export interface IStation {
    id?: number;
    stationName: string;
}

export interface IVisitor {
    id?: number;
}

export interface WaitingPosition {
    id?: number;
    visitorId: number;
    queueId: number;
    joinTime: Date;
    finished: boolean;
}