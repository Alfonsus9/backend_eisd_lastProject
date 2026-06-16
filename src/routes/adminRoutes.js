const express = require("express");
const router = express.Router();

const { requireAdmin } = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController");

// Users
router.get("/users", requireAdmin, adminController.listUsers);
router.patch("/users/:id", requireAdmin, adminController.updateUser);
router.delete("/users/:id", requireAdmin, adminController.deleteUser);

// Parking areas
router.post("/parking-area", requireAdmin, adminController.createParkingArea);
router.put("/parking-area/:id", requireAdmin, adminController.updateParkingArea);
router.delete("/parking-area/:id", requireAdmin, adminController.deleteParkingArea);

// Violation reports (reuse existing handlers but require admin)
router.get("/violation-reports", requireAdmin, adminController.listViolationReportsAdmin);
router.get("/violation-reports/export", requireAdmin, adminController.exportViolationReportsAdmin);


module.exports = router;
