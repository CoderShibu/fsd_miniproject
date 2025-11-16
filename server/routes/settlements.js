const express = require("express");
const router = express.Router();
const settlementController = require("../controllers/settlementController");
const authMiddleware = require("../middleware/auth");

// Protected routes
router.post("/", authMiddleware, settlementController.createSettlement);
router.get("/:groupId", authMiddleware, settlementController.getGroupSettlements);
router.put("/:settlementId/complete", authMiddleware, settlementController.completeSettlement);

module.exports = router;
