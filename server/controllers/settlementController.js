const Settlement = require("../models/Settlement");
const Group = require("../models/Group");

// Create settlement
exports.createSettlement = async (req, res) => {
  try {
    const { groupId, from, to, amount, method, notes } = req.body;

    const settlement = new Settlement({
      groupId,
      from,
      to,
      amount,
      method,
      notes,
    });

    await settlement.save();

    // Add settlement to group
    await Group.findByIdAndUpdate(groupId, {
      $push: { settlements: settlement._id },
    });

    res.status(201).json({
      message: "Settlement recorded successfully",
      settlement,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get group settlements
exports.getGroupSettlements = async (req, res) => {
  try {
    const { groupId } = req.params;

    const settlements = await Settlement.find({ groupId })
      .populate("from", "name email")
      .populate("to", "name email");

    res.status(200).json({ settlements });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark settlement as completed
exports.completeSettlement = async (req, res) => {
  try {
    const { settlementId } = req.params;

    const settlement = await Settlement.findByIdAndUpdate(
      settlementId,
      { status: "completed" },
      { new: true }
    );

    res.status(200).json({
      message: "Settlement marked as completed",
      settlement,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
