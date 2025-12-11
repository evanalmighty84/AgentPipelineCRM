const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

console.log("SERVER RUNNING IN:", __dirname);

// ---- ROUTES ----
const preferencesRoutes = require('./routes/preferencesRoutes');
const relationshipsRoutes = require('./routes/relationshipsRoutes');

console.log("preferencesRoutes export:", preferencesRoutes);
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

// ---- TEST ROUTE ----
app.get('/', (req, res) => {
    res.send("Agent Pipeline CRM Server running 🚀");
});

// ---- START SERVER ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
