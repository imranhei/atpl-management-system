const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  meal: {
    type: Map,
    of: new mongoose.Schema({
      quantity: {
        type: Number,
        required: false,
      },
      variant: {
        type: [String],
        required: false,
      },
      price: {
        type: Number,
        required: false,
      },
    }),
    required: true,
  },
});

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;
