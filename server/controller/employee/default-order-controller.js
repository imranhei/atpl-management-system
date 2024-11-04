const DefaultOrder = require("../../models/DefaultOrder");

// Create a new default order
const createDefaultOrder = async (req, res) => {
  try {
    const { name, meal } = req.body;
    const newDefaultOrder = new DefaultOrder({ name, meal });
    await newDefaultOrder.save();
    return res
      .status(201)
      .json({ success: true, message: "Default order created successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to create default order",
    });
  }
};

// Get all default orders
const getDefaultOrders = async (req, res) => {
  try {
    const defaultOrders = await DefaultOrder.find();
    return res.status(200).json({ success: true, defaultOrders });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to get default orders",
    });
  }
};

// Get default order by id
const getDefaultOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const defaultOrder = await DefaultOrder.findById(id);
    if (!defaultOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Default order not found" });
    }
    return res.status(200).json({ success: true, defaultOrder });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to get default order",
    });
  }
};

// Update default order
const updateDefaultOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, meal } = req.body;
    const defaultOrder = await DefaultOrder.findByIdAndUpdate(
      id,
      { name, meal },
      { new: true }
    );
    if (!defaultOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Default order not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Default order updated successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to update default order",
    });
  }
};

// Delete default order
const deleteDefaultOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const defaultOrder = await DefaultOrder.findById(id);
    if (!defaultOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Default order not found" });
    }
    await defaultOrder.remove();
    return res
      .status(200)
      .json({ success: true, message: "Default order deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to delete default order",
    });
  }
};

module.exports = {
  createDefaultOrder,
  getDefaultOrders,
  getDefaultOrder,
  updateDefaultOrder,
  deleteDefaultOrder,
};
