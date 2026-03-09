let userName = document.getElementById("userName");
let logoutBtn = document.getElementById("logOut");
let logoutAllBtn = document.getElementById("logOutAll");
function logOutCredentials() {
    localStorage.removeItem("AZX_users_Token");
    window.location.href = "./html/login.html";
}
logoutBtn.addEventListener("click", async () => {
    let res = await fetch("http://localhost:8000/auth/lecturer/logout", {
        method: "POST",
        credentials: "include",
    });
    if (res.ok) {
        logOutCredentials();
    }
})
logoutAllBtn.addEventListener("click", async () => {
    let res = await fetch("http://localhost:8000/auth/lecturer/logout/logoutAll", {
        method: "POST",
        credentials: "include",
    });
    if (res.ok) {
        logOutCredentials();
    }
})

userName.innerText = JSON.parse(localStorage.getItem("AZX_users_Token")) || "user";
// handling page reload
document.addEventListener("DOMContentLoaded", async () => {

    try {
        const res = await fetch(`http://localhost:8000/auth/lecturer/check/logged`, {
            method: "GET",
            credentials: "include",
        });
        if (!res.ok) {
            window.location.href = "./html/login.html";
        }
    } catch (err) {
        console.error("Auth check failed:", err);
    }
});
// Sidebar link -> iframe navigation
const links = document.querySelectorAll(".sidebar a");
const frame = document.getElementById("contentFrame");
links.forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const src = link.dataset.src || link.getAttribute("href");
        if (!src) return;
        frame.src = src;
        links.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
    });
});