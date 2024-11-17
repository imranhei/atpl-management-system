const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mealItemSchema = new Schema(
  {
    itemName: {
      type: String,
      required: true,
    },
    hasVariant: {
      type: Boolean,
      default: false,
    },
    variants: [
      {
        type: String,
      },
    ],
    hasQuantity: {
      type: Boolean,
      default: false,
    },
    maxQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MealItem", mealItemSchema);
