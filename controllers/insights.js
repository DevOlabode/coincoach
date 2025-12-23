const Transaction = require('../models/transactions');

const Insight = require('../models/insights')

const transactionInsight = require('../services/insightAI')

module.exports.allInsights =  async (req, res)=>{
    const transactions = await Transaction.find({ userId : req.user._id });
    const count = await Transaction.countDocuments({userId : req.user._id});
    const insight = await transactionInsight(transactions);
    const lastTransactionAt = transactions[0]?.updatedAt || null;

    console.log(insight)

    const insights = new Insight({
        userId : req.user._id,
        insight,
        transactionCount : count,
        lastTransactionAt
    });

    await insights.save();

    res.render('insights/all', {insights});
};