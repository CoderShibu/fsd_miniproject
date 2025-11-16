const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const authMiddleware = require("../middleware/auth");

// Protected routes
router.post("/", authMiddleware, groupController.createGroup);
router.get("/", authMiddleware, groupController.getUserGroups);
router.get("/:groupId", authMiddleware, groupController.getGroupDetails);
router.put("/:groupId", authMiddleware, groupController.updateGroup);
router.post("/:groupId/members", authMiddleware, groupController.addMemberToGroup);

module.exports = router;
