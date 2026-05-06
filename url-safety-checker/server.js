/**
 * URL Safety Checker - Main Server
 * Initializes Express, connects to MongoDB, and mounts routes.
 */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const urlRoutes = require('./routes/urlRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas - URL Safety DB'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  process.exit(1);
});

// Routes
app.use('/', urlRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ status: "URL Safety Checker API is running" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 URL Safety Checker Server running on port ${PORT}`);
});

module.exports = app;
