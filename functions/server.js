const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');   // ✅ IMPORTANT for Railway

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// THEME ROUTES  (using __dirname + path.join)
// This makes it work locally AND on Railway
const preferencesRoutes = require(path.join(__dirname, "routes/preferencesRoutes"));
app.use('/api/preferences', preferencesRoutes);

// RELATIONSHIPS ROUTES
const relationshipsRoutes = require(path.join(__dirname, "routes/relationshipsRoutes"));
app.use('/api/relationships', relationshipsRoutes);

app.get('/', (req, res) => {
    res.send("Agent Pipeline CRM Server running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
