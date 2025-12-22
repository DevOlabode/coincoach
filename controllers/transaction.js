const Transaction = require('../models/transactions');

const csv = require('csv-parser');
const fs = require('fs');
const XLSX = require('xlsx');

module.exports.newTransactionForm = (req, res) => {
    res.render('transactions/new');
};

module.exports.createTransaction = async (req, res) => {
    const { amount, type, date, description, category, name,recurrence, recurring, currency } = req.body;
    const transaction = new Transaction({
        userId: req.user._id,
        amount,
        type,
        date,
        description,
        category, 
        name,
        recurring,
        recurrence,
        currency,
        inputMethod : 'manual'
    });
    await transaction.save();
    req.flash('success', 'Transaction recorded successfully!');
    res.redirect(`/transactions/${transaction._id}`); 
};

module.exports.getTransactions = async (req, res) => {
    const transactions = await Transaction.find({ userId : req.user._id });
    const count = await Transaction.countDocuments({userId : req.user._id});
    res.render('transactions/index', { transactions, count });
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
        const excelEpoch = new Date(1899, 11, 30);
        const date = new Date(excelEpoch.getTime() + value * 86400000);
        return date;
    }
    

    if (typeof value === 'string') {

        const parts = value.trim().split('/');
        if (parts.length === 3) {
            const month = parseInt(parts[0]) - 1;
            const day = parseInt(parts[1]);
            const year = parseInt(parts[2]);
            const date = new Date(year, month, day);
            if (!isNaN(date.getTime())) {
                return date;
            }
        }
        
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            return date;
        }
    }
    
    return null;
};

module.exports.bulkUploadForm = (req, res) => {
    res.render('transactions/bulkUpload');
};

module.exports.bulkUpload = async(req, res) => {
    const results = [];
    const errors = [];
    const filePath = req.file.path;
    const fileExt = req.file.originalname.split('.').pop().toLowerCase();
    
    try {
        let data = [];
        
        if (fileExt === 'csv') {
            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (row) => data.push(row))
                    .on('end', resolve)
                    .on('error', reject);
            });
        } else if (fileExt === 'xlsx' || fileExt === 'xls') {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
            
            data = rawData.slice(1).map(row => ({
                date: row[0],
                type: row[1],
                category: row[2],
                amount: row[3],
                description: row[4],
                name: row[5],
                recurring: row[6],
                recurrence: row[7],
                currency: row[8]
            }));
        } else {
            throw new Error('Unsupported file format. Please upload CSV or Excel files.');
        }
        
        for (let i = 0; i < data.length; i++) {
            try {
                const row = data[i];
                
                const parsedDate = parseExcelDate(row.date);
                
                const transaction = {
                    userId: req.user._id,
                    date: parsedDate,
                    type: (row.type || '').toLowerCase().trim(),
                    category: (row.category || '').trim(),
                    amount: parseFloat(row.amount),
                    description: (row.description || '').trim(),
                    name: row.name || `${row.category || 'Transaction'} - ${row.amount || 0}`,
                    recurring: row.recurring ? String(row.recurring).toLowerCase().trim() === 'true' : false,
                    recurrence: row.recurrence ? row.recurrence.toLowerCase().trim() : undefined,
                    currency: row.currency ? row.currency.trim() : 'CAD',
                    inputMethod : 'CSV'
                };
                
                if (!transaction.date || isNaN(transaction.date.getTime())) {
                    errors.push(`Row ${i + 2}: Invalid date (got: "${row.date}")`);
                    continue;
                }
                
                if (!transaction.type || !transaction.amount || isNaN(transaction.amount)) {
                    errors.push(`Row ${i + 2}: Missing type or amount`);
                    continue;
                }
                
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
        
        fs.unlinkSync(filePath);
        
        req.flash('success', `Imported ${results.length} transactions successfully`);
        if (errors.length > 0) {
            req.flash('error', `${errors.length} errors: ${errors.slice(0, 3).join(', ')}`);
        }
        res.redirect('/transactions');
        
    } catch (err) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        req.flash('error', `Upload failed: ${err.message}`);
        res.redirect('/transactions/bulk-upload');
    }
};

module.exports.bulkUploadJSONFrontend = (req, res) => {
    res.render('transactions/bulkUploadJSON');
}

module.exports.bulkUploadJSON = async (req, res) => {
    const { transactions } = req.body;
    const errors = [];
    const results = [];

    // Validate JSON structure
    if (!transactions || !Array.isArray(transactions)) {
        req.flash('error', 'Invalid JSON format. Expected { "transactions": [...] }');
        return res.redirect('/transactions/bulk-upload-json');
    }

    for (let i = 0; i < transactions.length; i++) {
        try {
            const t = transactions[i];

            const parsedDate = parseExcelDate(t.date);

            const transaction = {
                userId: req.user._id,
                date: parsedDate,
                type: (t.type || '').toLowerCase().trim(),
                category: (t.category || '').trim(),
                amount: parseFloat(t.amount),
                description: (t.description || '').trim(),
                name: t.name || `${t.category || 'Transaction'} - ${t.amount || 0}`,
                recurring: t.recurring ? String(t.recurring).toLowerCase().trim() === 'true' : false,
                recurrence: t.recurrence ? t.recurrence.toLowerCase().trim() : undefined,
                currency: t.currency ? t.currency.trim() : 'CAD',
                inputMethod: 'JSON'
            };

            // Validate date
            if (!transaction.date || isNaN(transaction.date.getTime())) {
                errors.push(`Transaction ${i + 1}: Invalid date`);
                continue;
            }

            // Validate type + amount
            if (!transaction.type || !transaction.amount || isNaN(transaction.amount)) {
                errors.push(`Transaction ${i + 1}: Missing type or amount`);
                continue;
            }

            if (transaction.type !== 'income' && transaction.type !== 'expense') {
                errors.push(`Transaction ${i + 1}: Type must be 'income' or 'expense'`);
                continue;
            }

            await Transaction.create(transaction);
            results.push(transaction);

        } catch (err) {
            errors.push(`Transaction ${i + 1}: ${err.message}`);
        }
    }

    // Handle errors
    if (errors.length > 0) {
        req.flash('error', `${errors.length} errors: ${errors.slice(0, 3).join(', ')}`);
        return res.redirect('/transactions/bulk-upload-json');
    }

    // Success
    req.flash('success', `Imported ${results.length} transactions successfully`);
    return res.redirect('/transactions');
};