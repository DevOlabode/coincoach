const Goals = require('../models/goals');
const Transactions = require('../models/transactions')
const goalsAI = require('../services/goalsAI')

module.exports.index = async (req, res)=>{
    const goals = await Goals.find({userId : req.user._id})
    res.render('goals/index', {goals});
};

module.exports.goals = async(req, res)=>{
    const {explanation} = req.body;
    const transactions = await Transactions.find({userId : req.user._id})
    const output = await goalsAI(explanation, transactions);
};