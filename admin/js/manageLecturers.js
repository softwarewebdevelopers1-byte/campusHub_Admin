let refreshBtn = document.querySelector(".refresh");
let refreshIcon = document.querySelector("#refresh-icon");
let userInfo = document.querySelector(".users");
let usersInfor = document.getElementById("validate");
let recoverBtn = document.getElementById("recoverBtn");

let selectedEmail = null; // store selected lecturer email

// Create Message Container
function showMessage(type, message) {
	const container = document.createElement("div");
	container.classList.add("recovery-message");

	if (type === "success") {
		container.classList.add("success-msg");
	} else {
		container.classList.add("error-msg");
	}

	container.textContent = message;

	document.body.appendChild(container);

	// auto remove after 3 seconds
	setTimeout(() => {
		container.remove();
	}, 3000);
}

// Load Lecturers who are logged in
async function LoadLecturers() {
	const usersTable = document.getElementById("usersTable");

	try {
		const response = await fetch("http://localhost:8000/auth/find/users", {
			method: "GET",
			credentials: "include",
		});

		if (!response.ok) throw new Error("Failed to fetch users");

		const usersData = await response.json();

		usersTable.innerHTML = "";

		// Filter to lecturers who are currently logged in.
		// Assumption: `role` === 'Lecturer' and `status` === 'Active' denotes logged-in.
		const lecturers = (usersData.Users || []).filter(
			(u) => u.role === "Lecturer" && u.status === "Active"
		);

		if (lecturers.length === 0) {
			usersTable.innerHTML =
				'<tr><td colspan="5" style="text-align:center;color:#6b7280;">No logged-in lecturers found</td></tr>';
			return;
		}

		lecturers.forEach((user) => {
			const tr = document.createElement("tr");

			// USER NAME
			const tdUser = document.createElement("td");
			const userDiv = document.createElement("div");
			userDiv.classList.add("user-info");

			const nameSpan = document.createElement("span");
			nameSpan.textContent = (user.email || "").split("@")[0] || "-";

			userDiv.innerHTML = `<i class="fas fa-chalkboard-teacher user-icon"></i>`;
			userDiv.appendChild(nameSpan);

			tdUser.appendChild(userDiv);
			tr.appendChild(tdUser);

			// EMAIL
			const tdEmail = document.createElement("td");
			tdEmail.textContent = user.email || "-";
			tr.appendChild(tdEmail);

			// ROLE
			const tdRole = document.createElement("td");
			tdRole.textContent = user.role || "Lecturer";
			tr.appendChild(tdRole);

			// LOGIN STATUS
			const tdStatus = document.createElement("td");
			const statusSpan = document.createElement("span");
			statusSpan.classList.add("status");

			if (user.status === "Active") {
				statusSpan.classList.add("active");
			} else {
				statusSpan.classList.add("inactive");
			}

			statusSpan.textContent = user.status || "none";
			tdStatus.appendChild(statusSpan);
			tr.appendChild(tdStatus);

			// ACCOUNT STATE
			const accountState = document.createElement("td");
			const accountStateSpan = document.createElement("span");
			accountStateSpan.classList.add("status");

			if (user.account_state === "Active") {
				accountStateSpan.classList.add("active");
			} if (user.account_state === "Inactive") {
				accountStateSpan.classList.add("inactive");
				tr.classList.add("cursor");
				tr.classList.add("deleted-user");
			}

			accountStateSpan.textContent = user.account_state || "none";
			accountState.appendChild(accountStateSpan);
			tr.appendChild(accountState);

			usersTable.appendChild(tr);

			// If account is inactive, allow recovery via modal
			tr.addEventListener("click", () => {
				if (user.account_state === "Inactive") {
					selectedEmail = user.email;

					userInfo.classList.add("users-active");
					usersInfor.innerHTML = `
						<p>Are you sure you want to recover ${user.email}?</p>
					`;
				}
			});
		});
	} catch (error) {
		console.error("Error loading lecturers:", error);
		usersTable.innerHTML =
			'<tr><td colspan="5" style="text-align:center;color:red;">Failed to load lecturers</td></tr>';
	} finally {
		RemoveRefreshSpin();
	}
}

// Recover Account
recoverBtn.addEventListener("click", async () => {
	if (!selectedEmail) return;

	recoverBtn.innerHTML = "Recovering...";
	recoverBtn.disabled = true;

	try {
		const res = await fetch("http://localhost:8000/auth/recover/account", {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email: selectedEmail }),
		});

		if (!res.ok) throw new Error("Recovery failed");

		showMessage("success", "Lecturer account recovered successfully 🎉");

		userInfo.classList.remove("users-active");
		usersInfor.innerHTML = "";
		selectedEmail = null;

		LoadLecturers();
	} catch (error) {
		showMessage("error", "Failed to recover lecturer account ❌");
	} finally {
		recoverBtn.innerHTML = "Recover";
		recoverBtn.disabled = false;
	}
});

// Close Modal
document.getElementById("closeBtn").addEventListener("click", () => {
	usersInfor.innerHTML = "";
	userInfo.classList.remove("users-active");
	selectedEmail = null;
});

// Refresh Button
function RemoveRefreshSpin() {
	refreshBtn.innerHTML =
		"<i class='fas fa-sync-alt' id='refresh-icon'></i> Refresh";
}

refreshBtn.addEventListener("click", async () => {
	refreshBtn.innerHTML =
		"<i class='fas fa-sync-alt spin' id='refresh-icon'></i> Refreshing...";
	LoadLecturers();
});

document.addEventListener("DOMContentLoaded", () => {
	LoadLecturers();
});

