const express = require("express");
const router = express.Router();
const {
    fetchAllParkingAreas,
    fetchParkingAreaById,
} = require("../controllers/parkingController");

router.get("/parking-area", fetchAllParkingAreas);
router.get("/parking-area/:id", fetchParkingAreaById);

module.exports = router;
