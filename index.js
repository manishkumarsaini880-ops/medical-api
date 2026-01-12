const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Medicine = require("./models/Medicine");

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

app.get("/get-medicine", async (req,res)=>{
  const list = await Medicine.find();
  res.json(list);
});

app.delete("/delete-medicine/:id", async (req,res)=>{
  await Medicine.findByIdAndDelete(req.params.id);
  res.json({status:true, msg:"Deleted"});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("Server Running"));
