const DefaultOrder = require("../../models/DefaultOrder");

// Create a new default order
const createDefaultOrder = async (req, res) => {
  try {
    const { name, emp_id, meal } = req.body;
    const newDefaultOrder = new DefaultOrder({ name, emp_id, meal });
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
    const { id } = req.params;
    const defaultOrders = await DefaultOrder.findOne({ emp_id: id });
    return res.status(200).json({ success: true, data: defaultOrders });
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
    return res.status(200).json({ success: true, data: defaultOrder });
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

module.exports = {
  createDefaultOrder,
  getDefaultOrders,
  getDefaultOrder,
  updateDefaultOrder,
};
