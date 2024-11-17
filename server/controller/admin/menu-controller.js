const MealItem = require("../../models/Menu");
const DayWiseMeal = require("../../models/DayWiseMeal");

const createMealItem = async (req, res) => {
  try {
    const { itemName, hasVariant, variants, hasQuantity, maxQuantity, price } =
      req.body;

    const mealItem = new MealItem({
      itemName,
      hasVariant,
      variants,
      hasQuantity,
      maxQuantity,
      price,
    });

    await mealItem.save();
    res.status(201).json({
      success: true,
      message: "Meal item created successfully",
      data: mealItem,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllMealItems = async (req, res) => {
  try {
    const mealItems = await MealItem.find();
    res.status(200).json({ success: true, data: mealItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMealItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedMealItem = await MealItem.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedMealItem) {
      return res.status(404).json({ message: "Meal item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Meal item updated successfully",
      data: updatedMealItem,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMealItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMealItem = await MealItem.findByIdAndDelete(id);
    if (!deletedMealItem) {
      return res
        .status(404)
        .json({ success: true, message: "Meal item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Meal item deleted successfully",
      data: deletedMealItem,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const assignMealToDay = async (req, res) => {
  try {
    const { day, mealType, availableItems } = req.body;

    // Transform availableItems if only itemId is passed
    const formattedItems = availableItems.map((item) =>
      typeof item === "string" ? { itemId: item } : item
    );

    // Upsert (insert if not exists) the day-wise meal
    const dayWiseMeal = await DayWiseMeal.findOneAndUpdate(
      { day, mealType },
      { availableItems },
      { new: true, upsert: true } // Ensure the document is created if it doesn't exist
    );

    res.status(200).json({
      success: true,
      message: "Meal items assigned to day successfully",
      data: dayWiseMeal,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMealsForDay = async (req, res) => {
  try {
    const { day } = req.query;

    if (!day) {
      return res.status(400).json({ message: "Day is required" });
    }

    let dayWiseMeal = await DayWiseMeal.find({ day }).populate(
      "availableItems.itemId" // Populate meal item details
    );

    if (!dayWiseMeal || dayWiseMeal.length === 0) {
      return res.status(200).json({
        success: true,
        message: `No meals defined for ${day}.`,
        data: [], // Return an empty array if no meals exist for the day
      });
    }

    res.status(200).json({
      success: true,
      data: dayWiseMeal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const updateDayMeal = async (req, res) => {
  try {
    const { day, mealType, availableItems } = req.body;

    // Transform availableItems if only itemId is passed
    const formattedItems = availableItems.map((item) =>
      typeof item === "string" ? { itemId: item } : item
    );

    // Check if a document with the given day exists
    const existingDayMeal = await DayWiseMeal.findOne({ day });

    if (!existingDayMeal) {
      return res.status(404).json({ message: `Day '${day}' not found` });
    }

    // Update the mealType and availableItems
    existingDayMeal.mealType = mealType || existingDayMeal.mealType;
    existingDayMeal.availableItems =
      formattedItems || existingDayMeal.availableItems;

    // Save the updated document
    const updatedDayMeal = await existingDayMeal.save();

    res.status(200).json({
      success: true,
      message: `Meal for '${day}' updated successfully`,
      data: updatedDayMeal,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWeeklyMeals = async (req, res) => {
  try {
    // Fetch weekly meals and minimal meal item data in parallel
    const [weeklyMeals, allMealItems] = await Promise.all([
      DayWiseMeal.find()
        .populate("availableItems.itemId") // Populate meal item details
        .sort({ day: 1 }), // Sort by day
      MealItem.find({}, "itemName _id"), // Fetch only itemName and _id fields
    ]);

    if (!weeklyMeals || weeklyMeals.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No meals defined for the week.",
        data: {
          weeklyMeals: [],
          allMealItems, // Send the filtered list of meal items
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        weeklyMeals,
        allMealItems,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createMealItem,
  getAllMealItems,
  updateMealItem,
  deleteMealItem,
  assignMealToDay,
  getMealsForDay,
  updateDayMeal,
  getWeeklyMeals,
};
