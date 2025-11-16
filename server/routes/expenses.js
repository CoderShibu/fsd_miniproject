const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const authMiddleware = require("../middleware/auth");

// Protected routes
router.post("/", authMiddleware, expenseController.addExpense);
router.get("/:groupId", authMiddleware, expenseController.getGroupExpenses);
router.put("/:expenseId", authMiddleware, expenseController.updateExpense);
router.delete("/:expenseId", authMiddleware, expenseController.deleteExpense);
router.get("/:groupId/debts", authMiddleware, expenseController.calculateDebts);

module.exports = router;
