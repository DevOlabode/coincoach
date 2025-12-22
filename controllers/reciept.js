const Transactions = require('../models/transactions');
const { analyseReceipt } = require('../services/recieptAI');

const fs = require('fs');
const Tesseract = require('tesseract.js');

module.exports.getReciept = (req, res) => {
    res.render('reciept/getReciept')
};