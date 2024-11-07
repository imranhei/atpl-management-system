const Order = require("../../models/Order");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { name, emp_id, date, meal } = req.body;
    const newOrder = new Order({ name, emp_id, date, meal });
    await newOrder.save();
    return res
      .status(201)
      .json({ success: true, message: "Order created successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to create order",
    });
  }
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await Order.find({ emp_id: id });
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to get orders",
    });
  }
};

// Get order by id
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to get order",
    });
  }
};

// get orders by date
const getOrdersByDate = async (req, res) => {
  try {
    const { emp_id } = req.params;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const order = await Order.findOne({
      emp_id: emp_id,
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No order found for today",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to get today's order",
    });
  }
};

// Update order
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { meal, date } = req.body;
    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    } else {
      order.date = date || order.date;
      order.meal = meal || order.meal;
      await order.save();
      return res
        .status(200)
        .json({ success: true, message: "Order updated successfully" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to update order",
    });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    } else {
      await order.remove();
      return res
        .status(200)
        .json({ success: true, message: "Order deleted successfully" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to delete order",
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  getOrdersByDate,
  updateOrder,
  deleteOrder,
};
