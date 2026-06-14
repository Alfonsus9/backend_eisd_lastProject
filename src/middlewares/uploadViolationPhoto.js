const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/violations");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9);

        cb(
            null,
            uniqueName +
            path.extname(file.originalname)
        );
    },
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(
            new Error("INVALID_FILE_TYPE"),
            false
        );
    }

    cb(null, true);
};

const uploadViolationPhoto = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

module.exports = uploadViolationPhoto;