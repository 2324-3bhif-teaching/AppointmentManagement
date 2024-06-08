import {initKeycloak, keycloak} from "./keycloak";

initKeycloak().then((authenticated) => {
    if (authenticated){
        location.href = "home.html";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("login");
    if (loginButton) {
        loginButton.addEventListener("click", () => {
            console.log("Login button clicked")
            keycloak.login().then(() => {
                location.href = "home.html";
            });
        });
    } else {
        console.error("Element with ID 'login' not found");
    }
});