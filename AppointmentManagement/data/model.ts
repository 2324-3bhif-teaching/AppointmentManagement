export interface IAdministrator {
    id?: number;
    email: string;
    passwort: string;
    queues: IQueue[];
}

export interface IQueue {
    id?: number;
    name: string;
    waitingPersons: IVisitor[];
    station: IStation;
}

export interface IStation {
    id?: number;
    stationName: string;
    queues: IQueue[];
}

export interface IVisitor {
    id?: number;
    joinTime: Date;
}