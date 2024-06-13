import {initKeycloak} from "./keycloak";
import {IQueue, IStation, IWaitingPosition} from "../../src/model";

const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('open', (event) => {
    console.log('WebSocket connection opened:', event);
});

socket.addEventListener('message', (event) => {
    console.log('Message from server:', event.data);
});

socket.addEventListener('close', (event) => {
    console.log('WebSocket connection closed:', event);
});

socket.addEventListener('error', (event) => {
    console.error('WebSocket error:', event);
});

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
    for (let station of stations) {
        const option = document.createElement('option');
        option.value = String(station.id!);
        option.text = station.name.toString();
        selectElement.appendChild(option);
    }
}

selectElement.addEventListener('change', (event) => {
    const target = event.target as HTMLSelectElement;
    selectedStationId = Number(target.value);
    showQueues();
});

async function showQueues() {
    const existingTables = document.querySelectorAll('.queueTable');

    existingTables.forEach(table => table.remove());
    const existingHeadings = document.querySelectorAll('.queueHeading');
    existingHeadings.forEach(heading => heading.remove());

    const queues: IQueue[] = await fetchRestEndpoint(`http://localhost:3000/api/station/${selectedStationId}/queues`, "GET");

    for (let queue of queues) {
        const visitors: IWaitingPosition[] = await fetchRestEndpoint(`http://localhost:3000/api/queue/${queue.id}/visitors`, "GET");
        const queueContainer = document.getElementById('queueContainer')!;

        const heading = document.createElement('h2');
        heading.innerText = queue.name;
        heading.classList.add('queueHeading');
        queueContainer.appendChild(heading);

        const table = document.createElement('table');
        table.id = 'visitorList' + queue.id;
        table.classList.add('queueTable');
        queueContainer.appendChild(table);

        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        const th1 = document.createElement('th');
        th1.innerText = 'Visitor ID';
        const th2 = document.createElement('th');
        th2.innerText = '';
        tr.appendChild(th1);
        tr.appendChild(th2);
        thead.appendChild(tr);
        table.appendChild(thead);

        table.innerHTML += await createTableRows(visitors);
    }
}

async function createTableRows(visitors: IWaitingPosition[],): Promise<string> {
    let rows = '';
    for (const visitor of visitors) {
        rows += `<tr>
                    <td>${visitor.visitorId}</td>
                    <td><button onclick="deleteQueue(${visitor.id})">kick</button></td>
                 </tr>`;
    }
    return rows;
}

async function deleteQueue(queueId: number){
    try {
        await fetchRestEndpoint(`http://localhost:3000/api/visitor/waitingPosition/${queueId}`, 'DELETE');
        await showQueues();
        socket.send(JSON.stringify({
            action: 'deleteQueue',
            waitingPositionId: queueId
        }));
    } catch (error) {
        console.error('Error:', error);
    }
}

(window as any).deleteQueue = deleteQueue;
(window as any).loadStations = loadStations;