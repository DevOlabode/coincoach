const Transaction = require('../models/transactions');

module.exports.newTransactionForm = (req, res) => {
    res.render('transactions/new');
};

module.exports.createTransaction = async (req, res, next) => {
    const { amount, type, date, description, category } = req.body;
    const transaction = new Transaction({
        userId: req.user._id,
        amount,
        type,
        date,
        description,
        category
    });
    await transaction.save();
    req.flash('success', 'Transaction recorded successfully!');
    res.redirect('/'); 
};