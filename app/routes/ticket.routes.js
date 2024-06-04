// LIBRARY IMPORT
const router = require("express").Router();

// MIDDLEWARE IMPORT
const { authenticateToken } = require("../middleware/middleware");

// CONTROLLER IMPORT
const ticket_controller = require("../controllers/ticket.controller");

// ROUTER CONFIGURATION
router.post("/ticket-management", authenticateToken, ticket_controller.create);
router.get("/ticket-management/all", authenticateToken, ticket_controller.findAll);
router.get("/ticket-management/:uuid", authenticateToken, ticket_controller.findInfo);
router.get("/ticket-management", authenticateToken, ticket_controller.findOne);
router.get("/ticket-management/cancel",authenticateToken,ticket_controller.findCancelled);
router.get("/ticket-management/waiting",authenticateToken,ticket_controller.findWaiting);
router.post("/ticket-management/complete/:uuid",authenticateToken,ticket_controller.complete);
router.post("/ticket-management/cancel/:uuid",authenticateToken,ticket_controller.cancel);
router.delete("/ticket-management",authenticateToken,ticket_controller.deleteAll);
router.delete("/ticket-management", authenticateToken, ticket_controller.deleteOne);
module.exports = router;
