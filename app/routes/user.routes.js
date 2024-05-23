// LIBRARY IMPORT
const router = require("express").Router();

// MIDDLEWARE IMPORT
const { authenticateToken } = require("../middleware/middleware");

// CONTROLLER IMPORT
const user_controller = require("../controllers/user.controller");

// ROUTER CONFIGURATION
router.get("/user-management", authenticateToken, user_controller.findOne);
router.get("/user-management/all", authenticateToken, user_controller.findAll);
router.delete(
  "/user-management/:uuid",
  authenticateToken,
  user_controller.deleteOne
);
router.delete("/user-management", authenticateToken, user_controller.deleteAll);
router.post("/user-management/auth", user_controller.auth);
router.post("/user-management", user_controller.signup);

module.exports = router;
