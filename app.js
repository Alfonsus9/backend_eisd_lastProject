const express = require("express");
const app = express();
var cors = require('cors');

app.use(
  cors({
    origin: process.env.client || 5000,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

const authRoutes = require('./src/routes/authRoutes');
const parkingRoutes = require('./src/routes/parkingRoutes');

app.use('/api/auth', authRoutes);

//public api
app.use('/api/public', parkingRoutes);

module.exports = app;