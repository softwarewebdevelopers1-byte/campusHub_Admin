// handling page reload
document.addEventListener("DOMContentLoaded", async () => {

    try {
        const res = await fetch(`http://localhost:8000/auth/lecturer/check/logged`, {
            method: "GET",
            credentials: "include",
        });
console.log(await res.json());

        if (!res.ok) {
            console.log(await res.json());
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