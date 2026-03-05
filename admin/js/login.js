let sendBtn = document.getElementById("sendBtn");
let MainErrorCont = document.getElementById("error");
let EmailInput = document.getElementById("userEmail");
let PasswordInput = document.getElementById("userPassword");
let RoleInput = document.getElementById("userRole");
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
sendBtn.addEventListener("click", (e) => {
  e.preventDefault();

  let userEmail = EmailInput.value.trim();
  let password = PasswordInput.value.trim();
  let role = RoleInput ? RoleInput.value : 'admin';

  class User {
    constructor() {
      this._data = null;
    }

    set credentials(data) {
      this._data = data;
    }

    get sendData() {
      const { email, password } = this._data;
      if (!email || !password) {
        return;
      }
      sendBtn.disabled = true; // Disable the button to prevent multiple clicks
      sendBtn.textContent = "Logging in..."; // Optional: Change button text to indicate loading
      (async () => {
        try {
          let res = await fetch("http://localhost:8000/auth/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email: email, password: password, role: role }),
          });

          let result = await res.json();

          if (res.status === 200) {
            // Option 1: Small delay to ensure cookie is stored
            localStorage.setItem(
              "AZX_users_Token",
              JSON.stringify(result.user),
            ); // Store token in localStorage if needed
            setTimeout(() => {
              window.location.href = "../index.html";
            }, 1000);

            // Option 2: If you need to store token manually from response
            // if (result.token) {
            //   document.cookie = `token=${result.token}; path=/; max-age=86400; SameSite=Lax`;
            //   window.location.href = "../index.html";
            // }
          } else {
            CreateError();
          }
        } catch (error) {
          CreateError();
        }
      })();
    }
  }

  const newUser = new User();
  newUser.credentials = { email: userEmail, password: password };
  newUser.sendData;
});
window.addEventListener("DOMContentLoaded", async () => {
  // Check if an admin is already logged in (keeps existing behavior).
  // If you want role-aware check, change this endpoint to accept a role param.
  let response = await fetch("http://localhost:8000/auth/check/admin/logged", {
    method: "GET",
    credentials: "include",
  });
  if (response.ok) {
    window.location.href = "../index.html";
  }
});
