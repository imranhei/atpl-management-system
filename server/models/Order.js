const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  meal: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

module.exports = mongoose.model("Order", orderSchema);