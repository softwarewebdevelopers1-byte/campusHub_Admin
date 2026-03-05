# CampusHub Admin (Frontend)

This repository contains the frontend assets for the CampusHub admin panel — a small static HTML/CSS/JS project used for admin, lecturer and student workflows.

## Project structure

- `admin/`
  - `index.html` — main admin landing (project root app page)
  - `html/` — page views
    - `login.html` — login form (role selection: Admin / Lecturer)
    - `signUp.html` — sign up form (create account)
    - other pages: `landingPage.html`, `manageUsers.html`, `sendMessage.html`, `error.html`
  - `js/` — client-side JavaScript
    - `login.js` — login logic; sends credentials to backend endpoints (role-aware)
    - `signUp.js` — sign up logic; validates confirm password and POSTs to the create-account endpoint
    - other page scripts: `index.js`, `manageUsers.js`, etc.
  - `css/` — stylesheets
  - `images/` — images and icons

## Key behaviors implemented

- Sign up (`html/signUp.html` + `js/signUp.js`):
  - Validates required fields and that `Password` and `Confirm Password` match.
  - Shows inline error messages in the page when validation fails or server returns an error.
  - On success redirects to the login page.

- Login (`html/login.html` + `js/login.js`):
  - Includes a `Role` select; the script chooses the backend endpoint based on the selected role (admin vs lecturer).
  - Uses a form `submit` handler (Enter works) and disables the login button while the request is pending to prevent double submits.
  - Displays a transient error message UI on failure.

## Backend endpoints (expected)

The frontend sends requests to the developer's backend running locally. The expected endpoints used in the code are examples and can be adjusted to match your server:

- Sign up (lecturer): `POST http://localhost:8000/auth/lecturer/create/account` — body: `{ fullName, email, password }`
- Login (role-aware):
  - Admin: `POST http://localhost:8000/auth/verify/admin` — body: `{ email, password }`
  - Lecturer: `POST http://localhost:8000/auth/verify/lecturer` — body: `{ email, password }`
  - Fallback generic: `POST http://localhost:8000/auth/verify`

Adjust the URLs in `admin/js/login.js` and `admin/js/signUp.js` if your backend runs on a different host/port or expects different paths.

## How to test locally

1. Start your backend API and ensure CORS and cookies (if used) are configured for `localhost`.
2. Open `admin/html/signUp.html` in a browser to test registration.
3. Open `admin/html/login.html` to test login for both roles.
4. Check the browser console for network requests and script errors.

## Notes & troubleshooting

- If you see `Cannot read properties of null (reading 'addEventListener')` for `signUp.js`, ensure the `<form>` element has `id="signupForm"` and that the `#message` container exists; these were added to the page to wire up the script correctly.
- `login.js` uses role-specific endpoints; change them if your server API differs.
- The code stores a `user` object in `localStorage` after successful login under the key `AZX_users_Token` — change this behavior if you prefer cookies or another storage.

## Next steps you might want

- Update endpoints to match your backend routes and ports.
- Harden validation and show field-level errors.
- Add unit or integration tests for the JS (e.g., with Jest or Playwright).
- Commit changes and push to your VCS.

If you want, I can:
- Make the login check role-aware (update the `/auth/check/*` call),
- Commit these changes for you, or
- Add more detailed developer setup instructions.

---
Generated on March 5, 2026 — adapt any URLs to your environment.
