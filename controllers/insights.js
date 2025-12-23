const Transaction = require('../models/transactions');
const Insight = require('../models/insights');
const transactionInsight = require('../services/insightAI');

module.exports.allInsights = async (req, res) => {
    const insights = await Insight.find({ user: req.user._id });
    res.render('insights/all', { insights });
};