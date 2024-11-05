const express = require("express");
const {
  createDefaultOrder,
  getDefaultOrders,
  getDefaultOrder,
  updateDefaultOrder,
} = require("../../controller/employee/default-order-controller");

const router = express.Router();

router.post("/create", createDefaultOrder);
router.get("/get/:id", getDefaultOrders);
router.get("/get/:id", getDefaultOrder);
router.put("/update/:id", updateDefaultOrder);

module.exports = router;