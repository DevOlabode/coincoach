// models/Bill.js
const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
},
  name: String,
  category: String,
  amount: Number,
  billingCycle: String, 
  billDate: Date,
  source: { 
    type: String, 
    default: "manual" 
}, 
}, { timestamps: true });

module.exports = mongoose.model("Bill", BillSchema);
