const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const placeOrderSchema = new Schema(
  {
    employeeId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    mealType: {
      type: String,
      required: true,
    },
    mealItems: [
      {
        itemName: {
          type: String,
          required: true,
        },
        variant: {
          type: String,
          default: "",
        },
        quantity: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlaceOrder", placeOrderSchema);
