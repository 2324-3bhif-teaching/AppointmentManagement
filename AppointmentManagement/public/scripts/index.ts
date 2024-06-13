import {initKeycloak, keycloak} from "./keycloak";

initKeycloak().then((authenticated) => {
    if (authenticated){
        location.href = "admin.html";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("login");
    if (loginButton) {
        loginButton.addEventListener("click", () => {
            keycloak.login().then(() => {
                location.href = "admin.html";
            });
        });
    } else {
        console.error("Element with ID 'login' not found");
    }
});