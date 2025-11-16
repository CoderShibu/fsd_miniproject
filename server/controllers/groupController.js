const Group = require("../models/Group");
const User = require("../models/User");
const Expense = require("../models/Expense");

// Create a new group
exports.createGroup = async (req, res) => {
  try {
    const { name, description, members, currency } = req.body;

    const group = new Group({
      name,
      description,
      currency,
      members: [
        {
          user: req.userId,
          role: "admin",
        },
        ...members.map((memberId) => ({
          user: memberId,
          role: "member",
        })),
      ],
    });

    await group.save();

    // Add group to users
    await User.findByIdAndUpdate(req.userId, {
      $push: { groups: group._id },
    });

    for (const memberId of members) {
      await User.findByIdAndUpdate(memberId, {
        $push: { groups: group._id },
      });
    }

    res.status(201).json({
      message: "Group created successfully",
      group,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all groups for a user
exports.getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      "members.user": req.userId,
    }).populate("members.user", "name email phone");

    res.status(200).json({ groups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get group details
exports.getGroupDetails = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate("members.user", "name email phone")
      .populate({
        path: "expenses",
        populate: {
          path: "paidBy",
          select: "name email",
        },
      })
      .populate({
        path: "settlements",
        populate: [
          { path: "from", select: "name email" },
          { path: "to", select: "name email" },
        ],
      });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json({ group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add member to group
exports.addMemberToGroup = async (req, res) => {
  try {
    const { memberId } = req.body;
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is admin
    const admin = group.members.find(
      (m) => m.user.toString() === req.userId && m.role === "admin"
    );
    if (!admin) {
      return res.status(403).json({ message: "Only admin can add members" });
    }

    // Add member
    group.members.push({ user: memberId, role: "member" });
    await group.save();

    // Add group to user
    await User.findByIdAndUpdate(memberId, {
      $push: { groups: groupId },
    });

    res.status(200).json({
      message: "Member added successfully",
      group,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update group
exports.updateGroup = async (req, res) => {
  try {
    const { name, description, currency } = req.body;
    const { groupId } = req.params;

    const group = await Group.findByIdAndUpdate(
      groupId,
      { name, description, currency },
      { new: true }
    );

    res.status(200).json({
      message: "Group updated successfully",
      group,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
