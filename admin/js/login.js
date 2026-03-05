let sendBtn = document.getElementById("sendBtn");
let MainErrorCont = document.getElementById("error");
let EmailInput = document.getElementById("userEmail");
let PasswordInput = document.getElementById("userPassword");
let RoleInput = document.getElementById("userRole");
let formElement = document.getElementById("formElement");
function CreateError() {
  let ErrorCont = document.createElement("div");
  ErrorCont.classList.add("error-message");
  ErrorCont.textContent = "Login failed. Please try again.";
  MainErrorCont.appendChild(ErrorCont);
  setTimeout(() => {
    ErrorCont.remove();
    EmailInput.value = "";
    PasswordInput.value = "";
  }, 3000);
}
function EnableBtn() {
  sendBtn.disabled = false; // Re-enable the button
  sendBtn.textContent = "Login";
}

// Use form submit so Enter key works and handle role-specific endpoints
if (formElement) {
  formElement.addEventListener("submit", (e) => {
    e.preventDefault();

    let userEmail = EmailInput.value.trim();
    let password = PasswordInput.value.trim();
    let role = RoleInput ? RoleInput.value : "admin";

    if (!userEmail || !password) {
      CreateError();
      return;
    }

    (async () => {
      sendBtn.disabled = true;
      sendBtn.textContent = "Logging in...";
      try {
        // choose endpoint based on role
        let endpoint = "http://localhost:8000/auth/verify";
        if (role === "admin") endpoint = "http://localhost:8000/auth/verify/admin";
        else if (role === "lecturer") endpoint = "http://localhost:8000/auth/lecturer/login/account";

        let res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: userEmail, password: password }),
        });

        let result = {};
        try {
          result = await res.json();
          console.log(result);
          
        } catch (err) {
          // ignore parse errors
        }

        if (res.ok) {
          localStorage.setItem("AZX_users_Token", JSON.stringify(result.user || {}));
          setTimeout(() => {
            window.location.href = "../index.html";
          }, 800);
        } else {
          CreateError();
          EnableBtn();
        }
      } catch (error) {
        CreateError();
        EnableBtn();
        console.error(error);
      }
    })();
  });
} else {
  // fallback: attach click handler to button if form not found
  sendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (formElement) formElement.dispatchEvent(new Event('submit', {cancelable: true, bubbles: true}));
  });
}
// window.addEventListener("DOMContentLoaded", async () => {
//   // Check if an admin is already logged in (keeps existing behavior).
//   // If you want role-aware check, change this endpoint to accept a role param.
//   let response = await fetch("http://localhost:8000/auth/check/admin/logged", {
//     method: "GET",
//     credentials: "include",
//   });
//   if (response.ok) {
//     window.location.href = "../index.html";
//   }
// });
