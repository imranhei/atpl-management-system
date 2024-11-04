const mongoose = require("mongoose");

const defaultOrderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  meal: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

module.exports = mongoose.model("DefaultOrder", defaultOrderSchema);