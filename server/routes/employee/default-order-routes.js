const express = require("express");
const {
  getUserDefaultOrder,
  createOrUpdateDefaultOrder,
} = require("../../controller/employee/default-order-controller");

const router = express.Router();

router.get("/", getUserDefaultOrder);
router.put("/", createOrUpdateDefaultOrder);

module.exports = router;