import {initKeycloak, keycloak} from "./keycloak";


const auth = initKeycloak();
document.addEventListener("DOMContentLoaded", async () => {
    const authenticated = await auth;

    if (!authenticated) {
        location.href = "index.html";
    }

    document.addEventListener("DOMContentLoaded", () => {
        const logoutButton = document.getElementById("logout");
        logoutButton?.addEventListener("click",  () => {
                keycloak.logout();
        });
    });
});