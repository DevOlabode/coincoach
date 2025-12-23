const Transaction = require('../models/transactions');

const Insight = require('../models/insights')

const transactionInsight = require('../services/insightAI')

module.exports.allInsights =  async (req, res)=>{
    const transactions = await Transaction.find({ userId : req.user._id });
    const count = await Transaction.countDocuments({userId : req.user._id});
    const insight = await transactionInsight(transactions);

    res.render('insights/all', {transactions, insight, count})
};