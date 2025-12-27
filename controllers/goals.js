const Goals = require('../models/goals');
const goalsAI = require('../services/goalsAI')

module.exports.index = (req, res)=>{
    res.render('goals/index')
};

module.exports.goals = async(req, res)=>{
    const {explain} = req.body;
    const output = await goalsAI(explain);
    res.send(output)
};