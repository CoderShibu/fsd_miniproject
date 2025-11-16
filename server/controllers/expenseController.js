const Expense = require("../models/Expense");
const Group = require("../models/Group");

// Add expense
exports.addExpense = async (req, res) => {
  try {
    const { groupId, description, amount, category, splits } = req.body;

    const expense = new Expense({
      groupId,
      description,
      amount,
      paidBy: req.userId,
      category,
      splits: splits.map((split) => ({
        userId: split.userId,
        amount: split.amount,
      })),
    });

    await expense.save();

    // Add expense to group
    await Group.findByIdAndUpdate(groupId, {
      $push: { expenses: expense._id },
      $inc: { totalAmount: amount },
    });

    res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get group expenses
exports.getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;

    const expenses = await Expense.find({ groupId }).populate("paidBy", "name email").populate("splits.userId", "name email");

    res.status(200).json({ expenses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update expense
exports.updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { description, amount, category } = req.body;

    const expense = await Expense.findByIdAndUpdate(
      expenseId,
      { description, amount, category },
      { new: true }
    );

    res.status(200).json({
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    const expense = await Expense.findByIdAndDelete(expenseId);

    if (expense) {
      await Group.findByIdAndUpdate(expense.groupId, {
        $pull: { expenses: expenseId },
        $inc: { totalAmount: -expense.amount },
      });
    }

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate group debts
exports.calculateDebts = async (req, res) => {
  try {
    const { groupId } = req.params;

    const expenses = await Expense.find({ groupId }).populate("paidBy", "name email _id").populate("splits.userId", "name email _id");

    const debts = {};

    expenses.forEach((expense) => {
      expense.splits.forEach((split) => {
        const key = `${split.userId._id}-${expense.paidBy._id}`;
        if (!debts[key]) {
          debts[key] = {
            from: split.userId,
            to: expense.paidBy,
            amount: 0,
          };
        }
        debts[key].amount += split.amount;
      });
    });

    const debtList = Object.values(debts).filter((debt) => debt.amount > 0);

    res.status(200).json({ debts: debtList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
