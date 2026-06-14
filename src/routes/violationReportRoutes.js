const express = require("express");
const router = express.Router();

const uploadViolationPhoto = require(
    "../middlewares/uploadViolationPhoto"
);

const violationReportController = require(
    "../controllers/violationReportController"
);

router.post(
    "/violation-reports",
    uploadViolationPhoto.single("photo"),
    violationReportController.createViolationReport
);

module.exports = router;