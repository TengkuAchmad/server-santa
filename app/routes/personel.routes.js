// LIBRARY IMPORT
const router = require("express").Router();

// CONTROLLER IMPORT
const personel_controller = require("../controllers/personel.controller");

// MIDDLEWARE IMPORT
const { authenticateToken } = require("../middleware/middleware");

// ROUTER CONFIGURATION
router.post("/personel-management", authenticateToken,personel_controller.create);
router.get("/personel-management", authenticateToken,personel_controller.findAll);
router.delete("/personel-management/:uuid", authenticateToken, personel_controller.deleteOne);
router.delete("/personel-management", authenticateToken, personel_controller.deleteAll);

module.exports = router;