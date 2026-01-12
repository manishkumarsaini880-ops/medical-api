const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema({
  customerName: String,
  items: [
    {
      medicineId: String,
      name: String,
      price: Number,
      quantity: Number,
      total: Number
    }
  ],
  grandTotal: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Sale", SaleSchema);
