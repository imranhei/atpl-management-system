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
    const { meal } = req.body;

    if (!meal || typeof meal !== "object") {
      return res.status(400).json({
        success: false,
        message: "Invalid meal data",
      });
    }

    const defaultOrder = await DefaultOrder.findByIdAndUpdate(
      id,
      { meal },
      { new: true, runValidators: true } // Return updated document and run validators
    );

    if (!defaultOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Default order not found" });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Default order updated successfully",
        data: defaultOrder,
      });
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
