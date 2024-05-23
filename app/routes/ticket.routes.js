// LIBRARY IMPORT
const router = require("express").Router();

// MIDDLEWARE IMPORT
const { authenticateToken } = require("../middleware/middleware");

// CONTROLLER IMPORT
const ticket_controller = require("../controllers/ticket.controller");

// ROUTER CONFIGURATION
router.post("/ticket-management", authenticateToken, ticket_controller.create);
router.get("/ticket-management", authenticateToken, ticket_controller.findAll);
router.post(
  "/ticket-management/complete/:uuid",
  authenticateToken,
  ticket_controller.complete
);
router.post(
  "/ticket-management/cancel/:uuid",
  authenticateToken,
  ticket_controller.cancel
);

module.exports = router;