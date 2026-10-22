// ==========================================
// API CONFIG
// Local development uses localhost.
// After deploying the backend, put its URL below (no trailing slash).
// ==========================================
window.API_BASE =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:5000"
        : "https://YOUR-BACKEND-NAME.onrender.com";
