const express = require("express");
const {
  registerUser,
  login,
  logout,
  authMiddleware,
  deleteUser,
  resetPassword,
  isEmployee,
  isAdmin,
  isSuperAdmin,
  isService,
} = require("../../controller/auth/auth-controller");

const router = express.Router();

router.post("/register", isAdmin, registerUser);
router.post("/login", login);
router.get("/logout", logout);
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({ success: true, message: "User authenticated", user });
});
router.delete("/delete/:id", authMiddleware, isAdmin, deleteUser);
router.put("/reset-password", authMiddleware, resetPassword);

module.exports = router;
