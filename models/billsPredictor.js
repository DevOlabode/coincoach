// models/BillPrediction.js
const mongoose = require("mongoose");

const BillPredictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  billName: {
    type: String,
    required: true
  },
  category: String,
  predictedAmount: {
    type: Number,
    required: true
  },
  averageAmount: {
    type: Number,
    required: true
  },
  deviation: {
    type: Number,
    default: 0
  },
  isUnusual: {
    type: Boolean,
    default: false
  },
  predictedBillDate: {
    type: Date,
    required: true
  },
  daysUntil: {
    type: Number,
    required: true
  },
  recurrence: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: 'monthly'
  },
  notified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("BillPrediction", BillPredictionSchema);
