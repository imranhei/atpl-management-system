const DefaultOrder = require("../../models/DefaultOrder");
const User = require("../../models/User");

const createOrUpdateDefaultOrder = async (req, res) => {
  try {
    const { itemId, variant, quantity } = req.body;

    // Validate input
    if (!itemId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Item ID and quantity are required.",
      });
    }

    // Find the user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Update or create the default order
    user.defaultOrder = { itemId, variant, quantity };
    await user.save();

    // Populate the default order with meal item details
    await user.populate("defaultOrder.itemId");

    res.status(200).json({
      success: true,
      message: "Default order updated successfully.",
      defaultOrder: user.defaultOrder,
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
    const user = await User.findById(req.id).populate("defaultOrder.itemId");
    res.status(200).json({ success: true, data: user.defaultOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getUserDefaultOrder,
  createOrUpdateDefaultOrder,
};