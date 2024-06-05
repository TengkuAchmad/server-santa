// LIBRARY IMPORT
const router = require("express").Router();

// MIDDLEWARE IMPORT
const { authenticateToken } = require("../middleware/middleware");

// CONTROLLER IMPORT
const datamedis_controller = require("../controllers/datamedis.controller");

// ROUTER CONFIGURATION
router.get("/datamedis-management", authenticateToken, datamedis_controller.findOne);
router.get("/datamedis-management/all", authenticateToken, datamedis_controller.findAll);
router.delete("/datamedis-management", authenticateToken, datamedis_controller.deleteAll);
router.post("/datamedis-management", datamedis_controller.create);

module.exports = router;
