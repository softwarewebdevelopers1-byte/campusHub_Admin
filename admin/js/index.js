let all_links = [
  {
    link: "Home",
    class: "links_active",
    loadTo: "./html/landingPage.html",
  },
  {
    link: "Manage Users",
    class: "links",
    loadTo: "./html/manageUsers.html",
  },
  {
    link: "Send Messages",
    class: "links",
    loadTo: "./html/sendMessage.html",
  },
  {
    link: "Notifications",
    class: "links",
  },
];
function DeleteUser() {
  localStorage.removeItem("AZX_users_Token");
}
let pages = [
  "index.html",
  "landingPage.html",
  "manageUsers.html",
  "sendMessage.html",
  "notifications.html",
];
let links_container = document.getElementById("links");
// logout buttons
let LogOutBtn = document.querySelector(".logout-btn");
let LogOutAllBtn = document.querySelector(".logout-all-btn");

all_links.forEach((l) => {
  let li = document.createElement("li");
  li.classList.add("links", l.class);

  li.innerText = l.link;

  li.addEventListener("click", (event) => {
    // remove active classes from all links
    document.querySelectorAll(".links").forEach((li) => {
      li.classList.remove("active", "activeLink");
    });

    // add active classes to clicked link
    li.classList.add("active", "activeLink");

    // load the link
    if (l.loadTo) {
      PageLoader(l.loadTo, event);
    }
  });

  links_container.append(li);
});
document.getElementById("users").innerHTML =
  JSON.parse(localStorage.getItem("AZX_users_Token")) || "Admin";
async function PageLoader(link, event) {
  event.preventDefault();
  let IframeSrc = document.getElementById("IframeLoader");

  try {
    // Try to fetch the page first
    const response = await fetch(link, { method: "HEAD" });
    const IframeError = IframeSrc;

    if (response.ok) {
      IframeSrc.src = link; // Page exists
    } else {
      IframeSrc.src = "../html/error.html"; // Page doesn't exist
    }
  } catch (err) {
    IframeSrc.src = "../html/error.html"; // Network error or page missing
  }
}

// initialize active link
document.querySelectorAll(".links").forEach((list) => {
  if (list.classList.contains("links_active")) {
    list.classList.add("active", "activeLink");
  }
});
document.addEventListener("DOMContentLoaded", async () => {
  // Load the default page (Home) on initial load
  let response = await fetch("http://localhost:8000/auth/check/admin/logged", {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    window.location.href = "./html/login.html";
  }
});
LogOutBtn.addEventListener("click", async () => {
  let response = await fetch("http://localhost:8000/auth/logout/admin/logout", {
    method: "POST",
    credentials: "include",
  });
  if (response.ok) {
    DeleteUser();
    window.location.href = "./html/login.html";
  }
});
LogOutAllBtn.addEventListener("click", async () => {
  let response = await fetch(
    "http://localhost:8000/auth/all/admin/logout/all",
    {
      method: "POST",
      credentials: "include",
    },
  );
  if (response.ok) {
    DeleteUser();
    window.location.href = "./html/login.html";
  }
});
