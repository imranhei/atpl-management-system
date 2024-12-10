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

const updateMealOffDates = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, dates } = req.body;

    // Validate the input
    if (!type || !["add", "remove"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid type. Use 'add' or 'remove'.",
      });
    }

    if (!dates || !Array.isArray(dates) || dates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "An array of dates is required.",
      });
    }

    // Get the current date and year
    const today = new Date();
    const currentYear = today.getFullYear();

    // Validate that all dates are:
    // - Not in the past
    // - Within the current year
    const invalidDates = dates.filter((date) => {
      const parsedDate = new Date(date);
      return (
        parsedDate < today || // Disallow past dates
        parsedDate.getFullYear() !== currentYear // Restrict to current year
      );
    });

    if (invalidDates.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid dates detected. Ensure dates are not in the past and are within the current year.",
        data: invalidDates,
      });
    }

    // Find the user (employee) by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Perform the action based on the type
    if (type === "add") {
      // Add unique dates to `isMealOff`
      const existingDates = user.isMealOff.map((date) => date.toISOString());
      const newDates = dates.filter((date) => !existingDates.includes(new Date(date).toISOString()));
      user.isMealOff.push(...newDates);
    } else if (type === "remove") {
      // Remove specified dates from `isMealOff`
      user.isMealOff = user.isMealOff.filter(
        (date) => !dates.includes(new Date(date).toISOString())
      );
    }

    // Save the updated user document
    await user.save();

    res.status(200).json({
      success: true,
      message: type === "add" ? "Meal off dates added successfully." : "Meal off dates removed successfully.",
      data: user,
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
  updateMealOffDates,
};
