const Transaction = require('../models/transactions');

const csv = require('csv-parser');
const fs = require('fs');
const XLSX = require('xlsx');

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
    res.redirect(`/transactions/${transaction._id}`); 
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
    await Transaction.findByIdAndDelete(id);
    req.flash('success', 'Transaction deleted successfully');
    res.redirect('/transactions');
};

module.exports.editTransactionsForm = async(req, res) =>{
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if(!transaction){
        req.flash('error', 'Transaction not found');
        return res.redirect('/transactions');
    }

    if(!transaction.userId.equals(req.user._id)){
        req.flash('error', 'You do not have permission to edit this transaction');
        return res.redirect('/transactions');
    }
    res.render('transactions/edit', { transaction });
};


module.exports.updateTransaction = async(req, res) =>{
    const { id } = req.params;
    const { amount, type, date, description, category, name } = req.body;
    const transaction = await Transaction.findByIdAndUpdate(id, {
        amount,
        type,
        date,
        description,
        category,
        name
    }, { new: true });

    req.flash('success', 'Transaction updated successfully');
    res.redirect(`/transactions/${transaction._id}`);
};

// Helper function to parse dates from Excel
function parseExcelDate(value) {
    if (!value) return null;
    
    // If it's already a Date object
    if (value instanceof Date) {
        return value;
    }
    
    // If it's an Excel serial number (numeric)
    if (typeof value === 'number') {
        // Excel dates are days since 1900-01-01 (with a leap year bug)
        const excelEpoch = new Date(1899, 11, 30);
        const date = new Date(excelEpoch.getTime() + value * 86400000);
        return date;
    }
    
    // If it's a string, try to parse it
    if (typeof value === 'string') {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            return date;
        }
    }
    
    return null;
}

module.exports.bulkUpload = async(req, res) => {
    const results = [];
    const errors = [];
    const filePath = req.file.path;
    const fileExt = req.file.originalname.split('.').pop().toLowerCase();
    
    try {
        let data = [];
        
        if (fileExt === 'csv') {
            // Parse CSV
            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (row) => data.push(row))
                    .on('end', resolve)
                    .on('error', reject);
            });
        } else if (fileExt === 'xlsx' || fileExt === 'xls') {
            // Parse Excel with date handling
            const workbook = XLSX.readFile(filePath, { cellDates: true });
            const sheetName = workbook.SheetNames[0];
            data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: false });
        } else {
            throw new Error('Unsupported file format. Please upload CSV or Excel files.');
        }
        
        // Process each row
        for (let i = 0; i < data.length; i++) {
            try {
                const row = data[i];
                
                // Parse date with helper function
                const parsedDate = parseExcelDate(row.date || row.Date);
                
                const transaction = {
                    userId: req.user._id,
                    date: parsedDate,
                    type: (row.type || row.Type || '').toLowerCase().trim(),
                    category: (row.category || row.Category || '').trim(),
                    amount: parseFloat(row.amount || row.Amount),
                    description: (row.description || row.Description || '').trim()
                };
                
                // Validate date
                if (!transaction.date || isNaN(transaction.date.getTime())) {
                    errors.push(`Row ${i + 2}: Invalid or missing date (got: ${row.date || row.Date})`);
                    continue;
                }
                
                // Validate required fields
                if (!transaction.type || !transaction.amount || isNaN(transaction.amount)) {
                    errors.push(`Row ${i + 2}: Missing required fields (type: ${transaction.type}, amount: ${row.amount})`);
                    continue;
                }
                
                // Validate type
                if (transaction.type !== 'income' && transaction.type !== 'expense') {
                    errors.push(`Row ${i + 2}: Type must be 'income' or 'expense', got '${transaction.type}'`);
                    continue;
                }
                
                await Transaction.create(transaction);
                results.push(transaction);
                
            } catch (err) {
                errors.push(`Row ${i + 2}: ${err.message}`);
            }
        }
        
        // Clean up uploaded file
        fs.unlinkSync(filePath);
        
        req.flash('success', `Imported ${results.length} transactions successfully`);
        if (errors.length > 0) {
            req.flash('error', `${errors.length} errors: ${errors.slice(0, 3).join(', ')}`);
        }
        res.redirect('/transactions');
        
    } catch (err) {
        // Clean up file on error
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        req.flash('error', `Upload failed: ${err.message}`);
        res.redirect('/transactions/bulk-upload');
    }
};

module.exports.bulkUploadForm = (req, res) => {
    res.render('transactions/bulkUpload');
};