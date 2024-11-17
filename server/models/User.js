const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "employee", "service"],
      required: true,
      default: "employee",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    defaultOrder: {
      itemId: {
        type: Schema.Types.ObjectId,
        ref: "MealItem",
      },
      variant: String,
      quantity: Number,
    },
    leaveDates: [Date],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
