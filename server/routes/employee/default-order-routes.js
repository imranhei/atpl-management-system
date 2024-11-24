const express = require("express");
const {
  getUserDefaultOrder,
  createOrUpdateDefaultOrder,
} = require("../../controller/employee/default-order-controller");

const router = express.Router();

router.get("/:id", getUserDefaultOrder);
router.put("/:id", createOrUpdateDefaultOrder);

module.exports = router;