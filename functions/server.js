const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// Show where we are running
console.log("SERVER RUNNING IN:", __dirname);

/**
 * Local filesystem structure:
 *   /project/functions/server.js      → __dirname = /project/functions
 *   /project/functions/routes/...
 *
 * Railway (root = functions):
 *   /app/server.js                    → __dirname = /app
 *   /app/routes/...                   → routes moved UP a level
 *
 * So we must detect environment.
 */
function resolveRoute(file) {
    // LOCAL: __dirname ends with "/functions"
    if (__dirname.endsWith("/functions")) {
        return path.join(__dirname, "routes", file);
    }

    // RAILWAY: root=functions → routes live directly under /app/routes
    return path.join(__dirname, "routes", file);
}

// Load routes
const preferencesRoutes = require(resolveRoute("preferencesRoutes.js"));
const relationshipsRoutes = require(resolveRoute("relationshipsRoutes.js"));

console.log("preferencesRoutes export:", preferencesRoutes);
console.log("relationshipsRoutes export:", relationshipsRoutes);

app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Register endpoints
app.use("/api/preferences", preferencesRoutes);
app.use("/api/relationships", relationshipsRoutes);

// Test endpoint
app.get("/", (req, res) => {
    res.send("Agent Pipeline CRM Server running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
