import {initKeycloak} from "./keycloak";
import {IQueue, IStation, IWaitingPosition} from "../../src/model";

async function fetchRestEndpoint(
    route: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    data?: object
): Promise<any> {
    let options: any = {method};
    if (data) {
        options.headers = {"Content-Type": "application/json"};
        options.body = JSON.stringify(data);
    }
    const res = await fetch(route, options);
    if (!res.ok) {
        throw new Error(
            `${method} ${res.url} ${res.status} (${res.statusText})`
        );
    }
    if (res.status !== 204) {
        return await res.json();
    }
}

const auth = initKeycloak();
document.addEventListener("DOMContentLoaded", async () => {
    const authenticated = await auth;

    if (!authenticated) {
        location.href = "index.html";
    }
});

let selectedStationId: number = 0;

const selectElement = document.getElementById('stations')!;

async function loadStations() {
    const stations: IStation[] = await fetchRestEndpoint("http://localhost:3000/api/station", "GET");
    for(let station of stations) {
        const option = document.createElement('option');
        option.value = String(station.id!);
        option.text = station.name.toString();
        selectElement.appendChild(option);
    }
}

selectElement.addEventListener('change', (event) => {
    const target = event.target as HTMLSelectElement;
    selectedStationId = Number(target.value);
    if(selectedStationId !== 0) {
        showQueues();
    }
});

async function showQueues() {
    const queues: IQueue[] = await fetchRestEndpoint(`http://localhost:3000/api/station/${selectedStationId}/queues` , "GET");

    for(let queue of queues) {
        const visitors: IWaitingPosition[] = await fetchRestEndpoint(`http://localhost:3000/api/queue/${queue.id}/visitors`, "GET");
        console.log("newQueue" + queue.name);
        console.log("newVisitor");
        for(let visitor of visitors) {
            console.log(visitor);
        }
    }
}

(window as any).loadStations = loadStations;