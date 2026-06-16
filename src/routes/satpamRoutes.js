const express = require("express");
const router = express.Router();

const { requirePetugas } = require("../middlewares/authMiddleware");
const violationReportController = require("../controllers/violationReportController");

router.get("/violation-reports", requirePetugas, violationReportController.listForSatpam);
router.patch("/violation-reports/:id", requirePetugas, violationReportController.updateStatus);
router.get("/violation-reports/export", requirePetugas, violationReportController.exportReports);

module.exports = router;
