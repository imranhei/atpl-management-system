const Order = require("../../models/Order");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { name, date, meal } = req.body;
    const newOrder = new Order({ name, date, meal });
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
    const orders = await Order.find();
    return res.status(200).json({ success: true, orders });
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
    const { date } = req.params;
    const orders = await Order.find({
      date: {
        $gte: new Date(date),
        $lt: new Date(date + "T23:59:59.999Z"),
      },
    });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to get orders",
    });
  }
};

// Update order
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date, meal } = req.body;
    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    } else {
      order.name = name;
      order.date = date;
      order.meal = meal;
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
