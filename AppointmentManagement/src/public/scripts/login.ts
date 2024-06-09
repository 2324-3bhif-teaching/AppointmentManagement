import {StatusCodes} from "http-status-codes";

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

const loginButton = document.getElementById('loginBtn') as HTMLButtonElement;

loginButton.addEventListener('click', async () => {
    let codeField = (<HTMLInputElement>document.getElementById("code")).value;

    try {
        if (await validCode(codeField)) {
            await fetchRestEndpoint(`http://localhost:3000/api/visitor/${codeField}`, 'POST');
            window.location.href = '/visitor.html';

        } else {
            alert('Invalid code');
        }
    } catch (error) {
        console.error(error);
        alert('Login failed');
    }
});

async function validCode(code: string): Promise<boolean> {
    const regex = /^[0-9]{4}$/;
    return regex.test(code);
}

