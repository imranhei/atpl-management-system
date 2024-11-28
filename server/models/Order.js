const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dailyOrderSchema = new Schema(
  {
    employeeId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    order: {
      itemId: {
        type: Schema.Types.ObjectId,
        ref: "MealItem",
        required: true,
      },
      variant: String, // Optional for items with variants
      quantity: {
        type: Number,
        required: true,
      },
    },
    isCustomOrder: {
      type: Boolean,
      default: false,
    },
    isMealOff: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailyOrder", dailyOrderSchema);
