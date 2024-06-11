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

if(!document.cookie.includes('visitor')) {
    window.location.href = '/login.html';
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

async function joinQueue(){
    const currentURL: string = window.location.href;
    const queueId: number = parseInt(currentURL.split('?id=')[1]);
    const visitorId: number = await getCookie("visitor");

    try {
        await fetchRestEndpoint(`http://localhost:3000/api/visitor/queues/${queueId}/visitor/${visitorId}`, 'POST');
    } catch (error) {
        console.error('Error:', error);
    }
}

(window as any).joinQueue = joinQueue;
