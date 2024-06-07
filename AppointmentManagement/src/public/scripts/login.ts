import {LoginService} from "../../../data/login-repo";
import {Unit} from "../../unit";

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

const inputField = document.getElementById('four-digit-number') as HTMLInputElement;
const submitButton = document.querySelector('.number-input-container button');
if (submitButton === null) {
    throw new Error('Submit button not found');
}
submitButton.addEventListener('click', async () => {
    const code = inputField.value;

    if (code.length != 4) {
        alert('Please enter a 4-digit code');
        return;
    }
    try {
        await fetchRestEndpoint('http://localhost:3000/api/login/login/${code}', 'GET');
    } catch (error) {
        console.error('Error:', error);
    }
});