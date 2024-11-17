const express = require("express");
const {
  createMealItem,
  getAllMealItems,
  updateMealItem,
  deleteMealItem,
  assignMealToDay,
  getMealsForDay,
  updateDayMeal,
  getWeeklyMeals
} = require("../../controller/admin/menu-controller");

const { authMiddleware, isAdmin } = require("../../controller/auth/auth-controller");

const router = express.Router();

// CRUD for meal items
router.post('/add', createMealItem);
router.get('/get', getAllMealItems);
router.put('/update/:id', updateMealItem);
router.delete('/delete/:id', deleteMealItem);

// Day-wise meal assignments
router.post('/day-wise-meals', assignMealToDay);
router.get('/day-wise-meals', getMealsForDay);
router.put('/day-wise-meals', updateDayMeal);
router.get('/day-wise-meals/week', getWeeklyMeals);

module.exports = router;