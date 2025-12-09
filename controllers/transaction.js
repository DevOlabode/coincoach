const transactionSchema = require('../models/transactions');

module.exports.newTransactionForm = (req, res) => {
    res.render('transactions/new');
}