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
  },{ timestamps: true 
});

module.exports = mongoose.model("Sale", SaleSchema);

