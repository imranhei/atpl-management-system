const DefaultOrder = require("../../models/DefaultOrder");
const User = require("../../models/User");

const createOrUpdateDefaultOrder = async (req, res) => {
  try {
    const { id } = req.params; // User ID
    const { day, mealType, mealItems } = req.body; // Data from the client

    // Validate input
    if (!day || !mealType || !Array.isArray(mealItems)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid input. Ensure day, mealType, and mealItems are provided.",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if the day and mealType already exist in the user's defaultOrder
    const existingOrderIndex = user.defaultOrder.findIndex(
      (order) => order.day === day && order.mealType === mealType
    );

    if (existingOrderIndex !== -1) {
      // Update existing order
      user.defaultOrder[existingOrderIndex].mealItems = mealItems;
    } else {
      // Create new default order entry
      user.defaultOrder.push({ day, mealType, mealItems });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Default order updated successfully.",
      data: user.defaultOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserDefaultOrder = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // No populate
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: user.defaultOrder, // Directly return defaultOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getUserDefaultOrder,
  createOrUpdateDefaultOrder,
};
