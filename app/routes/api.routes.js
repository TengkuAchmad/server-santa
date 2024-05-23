// LIBRARY IMPORT
const router = require("express").Router();

// CONTROLLER IMPORT
const api_controller = require("../controllers/api.controller");

// MIDDLEWARE IMPORT
const { authenticateToken } = require("../middleware/middleware");

// ROUTER CONFIGURATION
router.get("/test", api_controller.test);
router.get("/secure/test", authenticateToken, api_controller.secureTest);

module.exports = router;
