const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    role: {
      type: String,
      enum: ["employee", "admin", "service"],
      default: "employee",
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    pro_pic: String,
    phone: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);