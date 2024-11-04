const express = require("express");
const {
  createDefaultOrder,
  getDefaultOrders,
  getDefaultOrder,
  updateDefaultOrder,
  deleteDefaultOrder,
} = require("../../controller/employee/default-order-controller");

const router = express.Router();

router.post("/create", createDefaultOrder);
router.get("/get", getDefaultOrders);
router.get("/get/:id", getDefaultOrder);
router.put("/update/:id", updateDefaultOrder);
router.delete("/delete/:id", deleteDefaultOrder);

module.exports = router;