const PlaceOrder = require("../../models/PlaceOrder");

const placeOrder = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { date, mealType, mealItems } = req.body;

    if (!employeeId || !date || !mealType || !Array.isArray(mealItems)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid input. Ensure employeeId, date, mealType, and mealItems are provided.",
      });
    }

    const newOrder = new PlaceOrder({
      employeeId,
      date,
      mealType,
      mealItems,
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      data: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPlaceOrderById = async (req, res) => {
  try {
    const order = await PlaceOrder.find({ employeeId: req.params.id });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePlaceOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { employeeId, date, mealType, mealItems } = req.body;

    if (!employeeId || !date || !mealType || !Array.isArray(mealItems)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid input. Ensure employeeId, date, mealType, and mealItems are provided.",
      });
    }

    const order = await PlaceOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.employeeId = employeeId;
    order.date = date;
    order.mealType = mealType;
    order.mealItems = mealItems;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully.",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePlaceOrder = async (req, res) => {
  try {
    const order = await PlaceOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    await order.remove();

    res.status(200).json({
      success: true,
      message: "Order deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  placeOrder,
  getPlaceOrderById,
  updatePlaceOrder,
  deletePlaceOrder,
};
