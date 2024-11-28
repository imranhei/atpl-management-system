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
      type: [
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
      ],
      default: [],
    },
    isMealOff: [Date],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
