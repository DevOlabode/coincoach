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

module.exports.getTransactions = async (req, res, next) => {
    const transactions = await Transaction.find({ userId : req.user._id }).sort({ date: -1 });
    res.render('transactions/index', { transactions });
};