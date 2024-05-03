import {IQueue} from "../../model";

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
        const tableElement = document.getElementById('queueTable');
        if (tableElement) {
            tableElement.innerHTML = createTableRows(queues);
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

function createTableRows(queues: IQueue[]): string {
    let rows = '';
    queues.forEach((queue: IQueue) => {
        rows += `<tr>
                    <td>${queue.id}</td>
                    <td>${queue.name}</td>
                    <td><button onclick="deleteQueue(${queue.id}, ${currentVisitorID})">leave</button></td>
                 </tr>`;
    });
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