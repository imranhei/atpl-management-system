const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    // Create a new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to register user",
    });
  }
};

// Login a user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // user.lastLogin = new Date();
    // await user.save();
    res.status(200).json({
      success: true,
      message: "Login successfull",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        defaultOrder: user.defaultOrder,
        leaveDates: user.leaveDates,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to login user",
    });
  }
};

// const logout = async (req, res) => {
//   try {
//     res.clearCookie("token").json({
//       success: true,
//       message: "Logout successfull",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       error: error.message,
//       message: "Failed to logout user",
//     });
//   }
// };

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized user",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // Get user ID from the request parameters

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to delete user",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: "User not found" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    // Update the password
    user.password = hashedPassword;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to reset password",
    });
  }
};

const isEmployee = (req, res, next) => {
  if (req.user.role !== "employee") {
    return res.status(403).json({ error: "Access denied." });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied." });
  }
  next();
};

// const isSuperAdmin = (req, res, next) => {
//   if (req.user.role !== "super-admin") {
//     return res.status(403).json({ error: "Permission denied." });
//   }
//   next();
// };

const isService = (req, res, next) => {
  if (req.user.role !== "service") {
    return res.status(403).json({ error: "Access denied." });
  }
  next();
};

module.exports = {
  registerUser,
  login,
  // logout,
  authMiddleware,
  deleteUser,
  resetPassword,
  isEmployee,
  isAdmin,
  // isSuperAdmin,
  isService,
};
