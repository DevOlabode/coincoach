const Goals = require('../models/goals');
const Transactions = require('../models/transactions')
const goalsAI = require('../services/goalsAI')

module.exports.index = (req, res)=>{
    res.render('goals/index')
};

module.exports.goals = async(req, res)=>{
    const {explanation} = req.body;
    const transactions = await Transactions.find({userId : req.user._id})
    const output = await goalsAI(explanation, transactions);
    res.send(output)
};