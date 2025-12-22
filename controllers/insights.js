const Transactions = require('../models/transactions');

const transactionInsight = require('../services/insightAI')

module.exports.allInsights =  async (req, res)=>{
    const transactions = await Transactions.find({user : req.user._id});
    const insight = await transactionInsight(transactions);
    res.render('insights/all', {insight, transactions})
};