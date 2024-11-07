const express = require("express");
const {
  createOrder,
  getOrders,
  getOrder,
  getOrdersByDate,
  updateOrder,
  deleteOrder,
} = require("../../controller/employee/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.get("/get-all-order/:id", getOrders);
router.get("/get/:id", getOrder);
router.get("/get-by-date/:emp_id", getOrdersByDate);
router.put("/update/:id", updateOrder);
router.delete("/delete/:id", deleteOrder);

module.exports = router;