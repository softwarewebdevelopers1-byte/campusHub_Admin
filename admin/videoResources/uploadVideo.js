// Client-side upload handler for html/uploadVideo.html
(function(){
  const MAX_BYTES = 50 * 1024 * 1024; // 50 MB
  const form = document.getElementById('uploadForm');
  const fileInput = document.getElementById('fileInput');
  const info = document.getElementById('info');
  const success = document.getElementById('success');
  const progressBar = document.getElementById('progressBar');

  function formatBytes(bytes){
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B','KB','MB','GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    info.textContent = '';
    success.textContent = '';

    const file = fileInput.files && fileInput.files[0];
    if (!file) {
      info.textContent = 'Please select a video file.';
      return;
    }

    if (!file.type.startsWith('video/')){
      info.textContent = 'Selected file is not a video.';
      return;
    }

    if (file.size > MAX_BYTES){
      info.textContent = `File too large: ${formatBytes(file.size)} (max 50 MB).`;
      return;
    }

    // Prepare upload
    const xhr = new XMLHttpRequest();
    // Change this URL to match your backend endpoint
    const uploadUrl = '/upload-video';
    xhr.open('POST', uploadUrl, true);

    xhr.upload.onprogress = function(ev){
      if (ev.lengthComputable){
        progressBar.style.display = 'block';
        progressBar.value = (ev.loaded / ev.total) * 100;
      }
    };

    xhr.onload = function(){
      progressBar.style.display = 'none';
      if (xhr.status >= 200 && xhr.status < 300){
        success.textContent = 'Upload succeeded.';
        fileInput.value = '';
      } else {
        info.textContent = 'Upload failed: ' + (xhr.responseText || xhr.statusText || xhr.status);
      }
    };

    xhr.onerror = function(){
      progressBar.style.display = 'none';
      info.textContent = 'Network error during upload.';
    };

    const fd = new FormData();
    fd.append('video', file, file.name);
    xhr.send(fd);
  });
})();
