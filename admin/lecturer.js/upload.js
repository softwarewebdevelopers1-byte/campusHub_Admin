let file = null;

let uploadBox = document.getElementById("uploadBox");
let fileInput = document.getElementById("fileInput");
let fileText = document.getElementById("fileText");
let buttonGroup = document.getElementById("buttonGroup");
let message = document.getElementById("message");
let loader = document.getElementById("loader");

let previewFrame = document.getElementById("previewFrame");
let pdfViewer = document.getElementById("pdfViewer");
let closePreview = document.getElementById("closePreview");

let uploadBtn = document.getElementById("uploadBtn");
let previewBtn = document.getElementById("previewBtn");
let clearBtn = document.getElementById("clearBtn");

let courseTitle = document.getElementById("courseTitle");
let unitName = document.getElementById("unitName");
let unitCode = document.getElementById("unitCode");

/* OPEN FILE SELECTOR */

uploadBox.onclick = function () {
    fileInput.click();
};

/* FILE VALIDATION */

fileInput.onchange = function () {
    file = fileInput.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
        message.innerHTML = "✗ Only PDF files allowed";
        message.className = "message error";
        file = null;
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        message.innerHTML = "✗ File too large (max 5MB)";
        message.className = "message error";
        file = null;
        return;
    }

    fileText.innerHTML = file.name;
    buttonGroup.style.display = "flex";
    message.innerHTML = "";
};

/* PREVIEW */

previewBtn.onclick = function () {
    if (!file) return;

    let url = URL.createObjectURL(file);

    pdfViewer.src = url;
    previewFrame.style.display = "block";
    closePreview.style.display = "block";
};

/* CLOSE PREVIEW */

closePreview.onclick = function () {
    previewFrame.style.display = "none";
    closePreview.style.display = "none";
    pdfViewer.src = "";
};

/* CLEAR */

clearBtn.onclick = function () {
    file = null;
    fileInput.value = "";

    fileText.innerHTML = "Click to select a PDF file";
    buttonGroup.style.display = "none";

    message.innerHTML = "";
};

/* UPLOAD */

uploadBtn.onclick = async function () {
    if (!file) {
        message.innerHTML = "✗ No file selected";
        message.className = "message error";
        return;
    }

    if (!courseTitle.value.trim() || !unitName.value.trim()) {
        message.innerHTML = "✗ Course title and unit name required";
        message.className = "message error";
        return;
    }

    loader.style.display = "block";
    message.innerHTML = "";

    let formData = new FormData();

    formData.append("file", file);
    formData.append("courseTitle", courseTitle.value);
    formData.append("unitCode", unitCode)
    formData.append("unitName", unitName.value);

    async function uploadRequest() {
        return fetch(
            "http://localhost:8000/api/resources/upload/users/data/pdf",
            {
                method: "POST",
                credentials: "include",
                body: formData,
            },
        );
    }

    try {
        const res = await uploadRequest();
        console.log(res);
        if (res.status !== 200) {
            loader.style.display = "none";

            message.innerHTML = "✗ Upload failed";
            message.className = "message error";
            return;
        }
        loader.style.display = "none";

        message.innerHTML = "✓ File uploaded successfully";
        message.className = "message success";

        console.log("Server Response:", await res.json());
    } catch (err) {
        loader.style.display = "none";

        message.innerHTML = "✗ Upload failed";
        message.className = "message error";

        console.error(err);
    }
};