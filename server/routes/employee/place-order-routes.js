const express = require("express");
const {
  placeOrder,
  getPlaceOrderById,
  updatePlaceOrder,
  deletePlaceOrder,
  updateMealOffDates,
  getMealOffDates,
} = require("../../controller/employee/place-order-controller");

const router = express.Router();

router.post("/:id", placeOrder);
router.get("/:id", getPlaceOrderById);
router.put("/:id", updatePlaceOrder);
router.delete("/:id", deletePlaceOrder);
router.put("/meal-off/:id", updateMealOffDates);
router.get("/meal-off/:id", getMealOffDates);

module.exports = router;