const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  meal: {
    type: Map,
    of: new mongoose.Schema({
      quantity: {
        type: Number,
        required: false,
        default: undefined, // Only add when explicitly provided
      },
      variant: {
        type: [String],
        required: false,
        default: undefined, // Only add when explicitly provided
      },
      price: {
        type: Number,
        required: false,
        default: undefined, // Only add when explicitly provided
      },
    }),
    required: true,
  },
});

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;
