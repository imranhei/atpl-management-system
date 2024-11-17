const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dayWiseMealSchema = new Schema(
  {
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },
    mealType: {
      type: String,
      enum: {
        values: ["Breakfast", "Lunch", "Dinner"],
        message: "{VALUE} is not a valid meal type",
      },
      required: true,
    },
    availableItems: [
      {
        itemId: {
          type: Schema.Types.ObjectId,
          ref: "MealItem",
          required: true,
        },
        variant: { type: String, default: null },
        maxQuantity: { type: Number, default: null },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("DayWiseMeal", dayWiseMealSchema);
