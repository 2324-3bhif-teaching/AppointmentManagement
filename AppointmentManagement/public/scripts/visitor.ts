import {IQueue, IStation, IWaitingPosition} from "../../src/model";

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
    if(!document.cookie.includes('visitor')) {
        window.location.href = '/login.html';
    }
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

async function getCookie(cname: string): Promise<number> {
    let cookieName = cname + "=";
    let decodedCookieString = decodeURIComponent(document.cookie);
    let cookieArray = decodedCookieString.split(';');
    for(let i = 0; i < cookieArray.length; i++) {
        let currentCookie = cookieArray[i];
        while (currentCookie.charAt(0) == ' ') {
            currentCookie = currentCookie.substring(1);
        }
        if (currentCookie.indexOf(cookieName) == 0) {
            return Number(currentCookie.substring(cookieName.length, currentCookie.length));
        }
    }
    return 0;
}

function clearCookies() {
    const allCookies = document.cookie.split(';');

    for (let i = 0; i < allCookies.length; i++) {
        document.cookie = allCookies[i] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
}

async function setCurrentUser() {
    currentVisitorID = await getCookie("visitor");
    const visitorId = document.getElementById('visitorId')!;
    visitorId.innerHTML = currentVisitorID.toString().padStart(3, '0');
}

async function createTableRows(queues: IQueue[], waitingPositions: IWaitingPosition[]): Promise<string> {
    let rows = '';
    for (const queue of queues) {
        let currentPosition: IWaitingPosition = waitingPositions.find(wp => wp.queueId === queue.id)!;
        if (currentPosition.finished === 0) {
            const station: IStation = await fetchRestEndpoint(`http://localhost:3000/api/station/station/`+ queue.stationId, 'GET');

            let position = await getPosition(currentVisitorID, queue.id!);
            rows += `<tr>
                    <td>${position}</td>
                    <td>${queue.name}</td>
                    <td><button onclick="deleteQueue(${queue.id}, ${currentVisitorID})">leave</button></td>
                    <td>${station.room}</td>
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
        return result.position;
    } catch (error) {
        console.error('Error:', error);
    }
    return 0;
}
(window as any).loadQueues = loadQueues;
(window as any).deleteQueue = deleteQueue;
(window as any).clearCookies = clearCookies;