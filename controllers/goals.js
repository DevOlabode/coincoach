const Goals = require('../models/goals');

module.exports.index = (req, res)=>{
    res.render('goals/index')
};

module.exports.goals = async(req, res)=>{
    const {explain} = req.body;
    res.send(explain);
};