// models/BillPrediction.js
const mongoose = require("mongoose");

const BillPredictionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  billName: String,
  predictedAmount: Number,
  averageAmount: Number,
  deviation: Number,
  isUnusual: Boolean,
  predictedBillDate: Date,
  notified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("BillPrediction", BillPredictionSchema);
