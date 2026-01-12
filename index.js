const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Medicine = require("./models/Medicine");
const Sale = require("./models/Sale");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

app.post("/add-medicine", async (req,res)=>{
  try{
    const med = new Medicine(req.body);
    await med.save();
    res.json({status:true, msg:"Medicine Added"});
  }catch(e){
    res.json({status:false, msg:"Error"});
  }
});

app.put("/update-medicine/:id", async (req, res) => {
  try {
    await Medicine.findByIdAndUpdate(req.params.id, req.body);
    res.json({ status: true, msg: "Medicine Updated" });
  } catch (e) {
    res.json({ status: false, msg: "Update Failed" });
  }
});


app.get("/get-medicine", async (req,res)=>{
  const list = await Medicine.find();
  res.json(list);
});

app.post("/add-sale", async (req, res) => {
  try {
    const saleData = req.body;

    // 1. Save Sale
    const sale = new Sale(saleData);
    await sale.save();

    // 2. Reduce Stock
    for (let item of saleData.items) {
      const medicine = await Medicine.findById(item.medicineId);

      if (!medicine) {
        return res.json({ status: false, msg: "Medicine not found" });
      }

      if (medicine.quantity < item.quantity) {
        return res.json({
          status: false,
          msg: `Stock not enough for ${medicine.name}`,
        });
      }

      medicine.quantity = medicine.quantity - item.quantity;
      await medicine.save();
    }

    res.json({ status: true, msg: "Bill Saved & Stock Updated" });
  } catch (e) {
    console.log(e);
    res.json({ status: false, msg: "Billing Failed", error: e.message });
  }
});


// Get Sales (for reports later)
app.get("/get-sales", async (req, res) => {
  const sales = await Sale.find().sort({ date: -1 });
  res.json(sales);
});

// Sales report
app.get("/sales-report", async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });

    let totalAmount = 0;
    sales.forEach(s => {
      totalAmount += s.total;
    });

    res.json({
      status: true,
      totalBills: sales.length,
      totalAmount: totalAmount,
      sales: sales
    });
  } catch (e) {
    res.json({ status: false, msg: "Failed to fetch report" });
  }
});

// Today Sales
app.get("/sales-today", async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const sales = await Sale.find({
      createdAt: { $gte: start, $lte: end }
    }).sort({ createdAt: -1 });

    let totalAmount = 0;
    sales.forEach(s => totalAmount += s.total);

    res.json({
      status: true,
      totalBills: sales.length,
      totalAmount: totalAmount,
      sales: sales
    });
  } catch (e) {
    res.json({ status: false, msg: "Failed to fetch today report" });
  }
});


// Sales by Date Range
app.post("/sales-by-date", async (req, res) => {
  try {
    const { from, to } = req.body;

    const start = new Date(from);
    start.setHours(0, 0, 0, 0);

    const end = new Date(to);
    end.setHours(23, 59, 59, 999);

    const sales = await Sale.find({
      createdAt: { $gte: start, $lte: end }
    }).sort({ createdAt: -1 });

    let totalAmount = 0;
    sales.forEach(s => totalAmount += s.total);

    res.json({
      status: true,
      totalBills: sales.length,
      totalAmount: totalAmount,
      sales: sales
    });
  } catch (e) {
    res.json({ status: false, msg: "Failed to fetch date range report" });
  }
});






app.delete("/delete-medicine/:id", async (req,res)=>{
  await Medicine.findByIdAndDelete(req.params.id);
  res.json({status:true, msg:"Deleted"});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("Server Running"));
