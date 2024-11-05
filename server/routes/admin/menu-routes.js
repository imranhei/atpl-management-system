const express = require("express");
const {
  addMenu,
  getMenu,
  updateMenu,
  deleteMenu,
} = require("../../controller/admin/menu-controller");

const { authMiddleware, isAdmin } = require("../../controller/auth/auth-controller");

const router = express.Router();

router.post("/add", addMenu);
router.get("/get", getMenu);
router.put("/update", updateMenu);
router.delete("/delete/:item", deleteMenu);
// router.post("/add", authMiddleware, isAdmin, addMenu);
// router.get("/get", authMiddleware, isAdmin, getMenu);
// router.put("/update", authMiddleware, isAdmin, updateMenu);
// router.delete("/delete", authMiddleware, isAdmin, deleteMenu);


module.exports = router;