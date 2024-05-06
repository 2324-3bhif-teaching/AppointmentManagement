import {IQueue, IWaitingPosition} from "../../model";

let currentVisitorID: number;

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

async function loadQueues(){
    try {
        await setCurrentUser();
        const queues = await fetchRestEndpoint("http://localhost:3000/api/visitor/queues/" + currentVisitorID, 'GET');
        const waitingPosition = await fetchRestEndpoint("http://localhost:3000/api/visitor/waitingPositions/queued", 'GET');
        const tableElement = document.getElementById('queueBody');
        if (tableElement) {
            tableElement.innerHTML = await createTableRows(queues, waitingPosition);
        } else {
            console.error('Error: Could not find element with id "queueTable"');
        }
        return queues;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function setCurrentUser() {
    currentVisitorID = 2;
}

async function createTableRows(queues: IQueue[], waitingPositions: IWaitingPosition[]): Promise<string> {
    let rows = '';
    for (const queue of queues) {
        let currentPosition: IWaitingPosition = waitingPositions.find(wp => wp.queueId === queue.id)!;
        if (currentPosition.finished === 0) {
            let position = await getPosition(currentVisitorID, queue.id!);
            rows += `<tr>
                    <td>${position}</td>
                    <td>${queue.name}</td>
                    <td><button onclick="deleteQueue(${queue.id}, ${currentVisitorID})">leave</button></td>
                 </tr>`;
        }
    }
    return rows;
}

async function deleteQueue(queueId: number, visitorId: number){
    try {
        await fetchRestEndpoint(`http://localhost:3000/api/visitor/queues/${queueId}/visitor/${visitorId}`, 'DELETE');
        await loadQueues();
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getPosition(visitorId: number, queueId: number): Promise<number> {
    try {
        const result = await fetchRestEndpoint(`http://localhost:3000/api/visitor/waitingPositions/visitor/` + visitorId + `/queue/` + queueId, 'GET');
        return result.position + 1;
    } catch (error) {
        console.error('Error:', error);
    }
    return 0;
}