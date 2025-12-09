const Transaction = require('../models/transactions');

module.exports.newTransactionForm = (req, res) => {
    res.render('transactions/new');
};

module.exports.createTransaction = async (req, res) => {
    const { amount, type, date, description, category, name } = req.body;
    const transaction = new Transaction({
        userId: req.user._id,
        amount,
        type,
        date,
        description,
        category, 
        name
    });
    await transaction.save();
    req.flash('success', 'Transaction recorded successfully!');
    res.redirect('/'); 
};

module.exports.getTransactions = async (req, res) => {
    const transactions = await Transaction.find({ userId : req.user._id }).sort({ date: -1 });
    res.render('transactions/index', { transactions });
};

module.exports.getTransactionById = async (req, res) =>{
    const { id } = req.params;

    const transaction = await Transaction.findById(id);

    if(!transaction){
        req.flash('error', 'Transaction not found');
        return res.redirect('/transactions');
    }

    if(!transaction.userId.equals(req.user._id)){
        req.flash('error', 'You do not have permission to view this transaction');
        return res.redirect('/transactions');
    }

    res.render('transactions/show', { transaction });
};

module.exports.deleteTransaction = async (req, res) =>{
    const { id } = req.params;
    console.log('deleteTransaction called. Method:', req.method, 'Params:', req.params, 'Body:', req.body);
    await Transaction.findByIdAndDelete(id);
    req.flash('success', 'Transaction deleted successfully');
    res.redirect('/transactions');
}