
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');
    const messageEl = document.getElementById('message');

    function showMessage(text, isError = true) {
        messageEl.textContent = text;
        messageEl.style.color = isError ? '#b91c1c' : '#064e3b';
        messageEl.style.display = 'block';
    }

    function clearMessage() {
        messageEl.textContent = '';
        messageEl.style.display = 'none';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearMessage();

        const name = document.getElementById('lecturerName').value.trim();
        const email = document.getElementById('lecturerEmail').value.trim();
        const password = document.getElementById('lecturerPassword').value;
        const confirm = document.getElementById('lecturerConfirmPassword').value;

        if (!name || !email || !password || !confirm) {
            showMessage('Please fill in all fields.');
            return;
        }

        if (password !== confirm) {
            showMessage('Passwords do not match.');
            return;
        }

        try {
            const res = await fetch('http://localhost:8000/auth/lecturer/create/account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ fullName: name, email, password })
            });

            if (!res.ok) {
                let errText = 'Failed to create account.';
                try {
                    const data = await res.json();
                    if (data && data.message) errText = data.message;
                } catch (err) {
                    // ignore JSON parse
                }
                showMessage(errText);
                return;
            }

            showMessage('Account created successfully. Redirecting...', false);
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1200);
        } catch (err) {
            showMessage('Unable to contact server. Please try again later.');
            console.error(err);
        }
    });
});