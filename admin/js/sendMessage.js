let messageTitle = document.getElementById("subject");
let message = document.getElementById("message");
let sendBtn = document.getElementById("sendBtn");
let container = document.querySelector(".message-container");

let sendTab = document.getElementById("sendTab");
let viewTab = document.getElementById("viewTab");
let sendPage = document.getElementById("sendPage");
let viewPage = document.getElementById("viewPage");
let messagesList = document.getElementById("messagesList");

// Create alert dynamically
function showAlert(type, text) {
  // Remove existing alert if any
  const existing = document.querySelector(".alert-container");
  if (existing) existing.remove();

  const alertDiv = document.createElement("div");
  alertDiv.classList.add("alert-container");

  if (type === "error") {
    alertDiv.classList.add("alert-error");
    alertDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${text}`;
  } else {
    alertDiv.classList.add("alert-success");
    alertDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${text}`;
  }

  container.prepend(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 4000);
}

sendBtn.addEventListener("click", async () => {
  if (messageTitle.value.trim() === "" || message.value.trim() === "") {
    showAlert(
      "error",
      "Please fill in both the title and message fields before sending.",
    );
    return;
  }

  sendBtn.disabled = true;
  sendBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending...`;

  try {
    let res = await fetch(
      "http://localhost:8000/api/admin/send/notifications",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: messageTitle.value,
          content: message.value,
        }),
        credentials: "include",
      },
    );

    const data = await res.json();

    if (!res.ok) {
      showAlert("error", data.message || "Failed to send notification.");
      return;
    }

    showAlert("success", data.message || "Message sent successfully.");

    message.value = "";
    messageTitle.value = "";
  } catch (error) {
    showAlert("error", "An unexpected error occurred. Please try again.");
    console.error("Error sending message:", error);
  } finally {
    sendBtn.disabled = false;
    sendBtn.innerHTML = `<i class="fas fa-paper-plane"></i> Send Message`;
  }
});

// Tab switching
sendTab.addEventListener("click", () => {
  sendPage.style.display = "block";
  viewPage.style.display = "none";
  sendTab.classList.add("active");
  viewTab.classList.remove("active");
});

viewTab.addEventListener("click", async () => {
  sendPage.style.display = "none";
  viewPage.style.display = "block";
  viewTab.classList.add("active");
  sendTab.classList.remove("active");

  loadSentMessages();
});

// Fetch Sent Messages
async function loadSentMessages() {
  try {
    let res = await fetch("http://localhost:8000/api/admin/get/notifications", {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    messagesList.innerHTML = "";

    if (!res.ok || data.data.length === 0) {
      messagesList.innerHTML = '<p class="empty">No messages found.</p>';
      return;
    }

    data.data.forEach((msg) => {
      const div = document.createElement("div");
      div.classList.add("message-item");

      div.innerHTML = `
        <button class="delete-btn" data-id="${msg.content}">
          <i class="fas fa-trash"></i>
        </button>
        <h4>${msg.title}</h4>
        <p>${msg.content}</p>
        <div class="message-time">${msg.time}</div>
      `;

      messagesList.appendChild(div);
    });

    // Attach delete event listeners AFTER rendering
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation(); // prevent parent clicks
        const id = btn.getAttribute("data-id");

        const confirmDelete = confirm(
          "Are you sure you want to delete this message?",
        );
        if (!confirmDelete) return;

        try {
          let res = await fetch(
            `http://localhost:8000/api/admin/delete/notification`,
            {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: id }),
            },
          );

          const result = await res.json();

          if (!res.ok) {
            showAlert("error", result.message || "Failed to delete message.");
            return;
          }

          showAlert("success", "Message deleted successfully.");

          // Remove from UI immediately
          btn.parentElement.remove();
        } catch (error) {
          showAlert("error", "An error occurred while deleting.");
        }
      });
    });
  } catch (error) {
    messagesList.innerHTML = '<p class="empty">Failed to load messages.</p>';
  }
}
