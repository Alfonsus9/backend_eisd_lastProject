const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const authRoutes = require("./src/routes/authRoutes");
const parkingRoutes = require("./src/routes/parkingRoutes");
const violationReportRoutes = require("./src/routes/violationReportRoutes");
const satpamRoutes = require("./src/routes/satpamRoutes");

app.use(express.json());

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

app.use("/api/auth", authRoutes);

// Public routes
app.use("/api/public", parkingRoutes);

app.use("/api", violationReportRoutes);

app.use("/petugas", satpamRoutes);

app.use((err, req, res, next) => {
    if (err.message === "INVALID_FILE_TYPE") {
        return res.status(422).json({
            status: false,
            message: "Format foto hanya jpg atau png",
            data: null,
        });
    }

    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(422).json({
            status: false,
            message: "Ukuran foto maksimal 5MB",
            data: null,
        });
    }

    return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: null,
    });
});

module.exports = app;