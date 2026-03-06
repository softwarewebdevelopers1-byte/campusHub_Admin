let refreshBtn = document.querySelector(".refresh");
let refreshIcon = document.querySelector("#refresh-icon");
async function load() {
  buttonTransition();
  // getting lecturer count
  let response = await fetch("http://localhost:8000/auth/lecturer/get/number", {
    method: "GET",
    credentials: "include",
  });
  try {
    if (response.ok) {
      let data = await response.json();

      document.getElementById("lecturerCount").innerHTML = data.count;
    }
  } catch (error) {
    console.log("Unable to refresh data");
  }
  // getting user count
  let response2 = await fetch("http://localhost:8000/api/count/log/users", {
    method: "GET",
    credentials: "include",
  });
  try {
    if (response2.ok) {
      let data = await response2.json();

      document.getElementById("userCount").innerHTML = data.count;
    }
  } catch (error) {
    console.log("Unable to refresh data");
  } finally {
    refreshIcon.classList.remove("spin");
    refreshBtn.innerHTML =
      "<i class='fas fa-sync-alt' id='refresh-icon'></i> Refresh";
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  load();
});
refreshBtn.addEventListener("click", () => {
  load();
});
function buttonTransition() {
  refreshIcon.classList.add("spin");
  refreshBtn.innerHTML =
    "<i class='fas fa-sync-alt' id='refresh-icon'></i> Refreshing...";
}
