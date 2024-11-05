const Menu = require("../../models/Menu");

// Create a new menu
const addMenu = async (req, res) => {
  try {
    const { itemName, quantity, variant, price } = req.body;

    let menu = await Menu.findOne();
    if (!menu) {
      menu = new Menu({ meal: {} });
    }

    // Add the new item to the meal map
    menu.meal.set(itemName, { quantity, variant, price });
    await menu.save();

    res
      .status(201)
      .json({ message: "Menu item added successfully", data: menu });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to create menu",
    });
  }
};

// Get all menu items
const getMenu = async (req, res) => {
  try {
    const menu = await Menu.findOne();
    return res.status(200).json({ success: true, data: menu });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to get menu",
    });
  }
};

// Update menu item
const updateMenu = async (req, res) => {
  try {
    const { itemName, quantity, variant, price } = req.body;
    const menu = await Menu.findOne();

    if (!menu || !menu.meal.has(itemName)) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // Update the item in the meal map
    menu.meal.set(itemName, { quantity, variant, price });
    await menu.save();

    res
      .status(200)
      .json({ message: "Menu item updated successfully", data: menu });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to update menu",
    });
  }
};

// Delete menu item
const deleteMenu = async (req, res) => {
  try {
    const { item } = req.params;
    const menu = await Menu.findOne();

    if (!menu || !menu.meal.has(item)) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // Delete the item from the meal map
    menu.meal.delete(item);
    await menu.save();

    res
      .status(200)
      .json({ message: "Menu item deleted successfully", data: menu });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to delete menu",
    });
  }
};

module.exports = { addMenu, getMenu, updateMenu, deleteMenu };