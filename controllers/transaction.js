const transactionSchema = require('../models/transactions');

module.exports.newTransactionForm = (req, res) => {
    res.render('transactions/new');
};

module.exports.createTransaction = async (req, res, next) => {
    res.send(req.body);
};