const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");

// LOGIN
router.post("/login", adminController.login);

// PENDING QUERIES
router.get(
  "/pending",
  adminAuth,
  adminController.getPendingQueries
);

// RESPONDED QUERIES
router.get(
  "/responded",
  adminAuth,
  adminController.getRespondedQueries
);

// SUBMIT RESPONSE
router.post(
  "/respond",
  adminAuth,
  adminController.submitResponse
);

module.exports = router;