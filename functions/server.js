const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// ---------------------------------------
// DEBUG OUTPUT
// ---------------------------------------
console.log("SERVER RUNNING IN:", __dirname);

// When deployed on Railway, __dirname === "/app"
// Your routes actually live inside /app/functions/routes/
// So we must support BOTH local & deployed environments
function routePath(file) {
    return path.join(__dirname, "functions", "routes", file);
}

// ---------------------------------------
// LOAD ROUTES SAFELY
// ---------------------------------------
const preferencesRoutes = require(routePath("preferencesRoutes.js"));
console.log("preferencesRoutes export:", preferencesRoutes);

const relationshipsRoutes = require(routePath("relationshipsRoutes.js"));
console.log("relationshipsRoutes export:", relationshipsRoutes);

// ---------------------------------------
// MIDDLEWARE
// ---------------------------------------
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// ---------------------------------------
// REGISTER ROUTES
// ---------------------------------------
app.use("/api/preferences", preferencesRoutes);
app.use("/api/relationships", relationshipsRoutes);

// ---------------------------------------
// TEST ROOT ROUTE
// ---------------------------------------
app.get("/", (req, res) => {
    res.send("Agent Pipeline CRM Server running 🚀");
});

// ---------------------------------------
// START SERVER
// ---------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
