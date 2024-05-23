// LIBRARY IMPORT
const router = require("express").Router();

// MIDDLEWARE IMPORT
const { authenticateToken } = require("../middleware/middleware");

// CONTROLLER IMPORT
const officer_controller = require("../controllers/officer.controller");

// ROUTER CONFIGURATION
router.get(
  "/officer-management",
  authenticateToken,
  officer_controller.findOne
);
router.get(
  "/officer-management/all",
  authenticateToken,
  officer_controller.findAll
);
router.delete(
  "/officer-management/:uuid",
  authenticateToken,
  officer_controller.deleteOne
);
router.delete(
  "/officer-management",
  authenticateToken,
  officer_controller.deleteAll
);
router.post("/officer-management/auth", officer_controller.auth);
router.post("/officer-management", officer_controller.signup);

module.exports = router;
