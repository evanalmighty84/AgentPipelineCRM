const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');    // Required for correct path resolution

dotenv.config();

const app = express();

console.log("SERVER RUNNING IN:", __dirname);

// ---- DEBUG PATH OUTPUTS ----
const prefPath = path.join(__dirname, "routes/preferencesRoutes.js");
console.log("Loading preferences routes from:", prefPath);

const relPath = path.join(__dirname, "routes/relationshipsRoutes.js");
console.log("Loading relationships routes from:", relPath);

// ---- ACTUAL ROUTE REQUIRES ----
const preferencesRoutes = require(prefPath);
console.log("preferencesRoutes export:", preferencesRoutes);

const relationshipsRoutes = require(relPath);
console.log("relationshipsRoutes export:", relationshipsRoutes);

// ---- MIDDLEWARE ----
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// ---- REGISTER ROUTES ----
app.use('/api/preferences', preferencesRoutes);
app.use('/api/relationships', relationshipsRoutes);

// ---- TEST ROOT ROUTE ----
app.get('/', (req, res) => {
    res.send("Agent Pipeline CRM Server running 🚀");
});

// ---- START SERVER ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
