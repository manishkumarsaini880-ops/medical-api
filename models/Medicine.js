const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  expiry: String,
});

module.exports = mongoose.model("Medicine", MedicineSchema);
