const Transaction = require('../models/transactions');
const ExcelJS = require('exceljs');

// Export to Excel
module.exports.exportToExcel = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id })
            .sort({ date: -1 });

        // Create workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Transactions');

        // Add headers
        worksheet.columns = [
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Type', key: 'type', width: 12 },
            { header: 'Category', key: 'category', width: 20 },
            { header: 'Amount', key: 'amount', width: 15 },
            { header: 'Currency', key: 'currency', width: 12 },
            { header: 'Description', key: 'description', width: 40 },
            { header: 'Recurring', key: 'recurring', width: 12 },
            { header: 'Recurrence', key: 'recurrence', width: 15 },
            { header: 'Input Method', key: 'inputMethod', width: 15 }
        ];

        // Style header row
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4472C4' }
        };
        worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

        // Add data
        transactions.forEach(transaction => {
            worksheet.addRow({
                date: transaction.date ? new Date(transaction.date).toLocaleDateString() : '',
                name: transaction.name || '',
                type: transaction.type || '',
                category: transaction.category || '',
                amount: transaction.amount || 0,
                currency: transaction.currency || 'CAD',
                description: transaction.description || '',
                recurring: transaction.recurring ? 'Yes' : 'No',
                recurrence: transaction.recurrence || '',
                inputMethod: transaction.inputMethod || 'manual'
            });
        });

        // Format amount column as currency
        worksheet.getColumn('amount').numFmt = '$#,##0.00';

        // Add conditional formatting for type column
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Skip header
                const typeCell = row.getCell('type');
                if (typeCell.value === 'income') {
                    typeCell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFD4EDDA' }
                    };
                    typeCell.font = { color: { argb: 'FF155724' } };
                } else if (typeCell.value === 'expense') {
                    typeCell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFF8D7DA' }
                    };
                    typeCell.font = { color: { argb: 'FF721C24' } };
                }
            }
        });

        // Set response headers
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=CoinCoach_Transactions_${new Date().toISOString().split('T')[0]}.xlsx`
        );

        // Write to response
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Export error:', error);
        req.flash('error', 'Failed to export transactions');
        res.redirect('/transactions');
    }
};

// Export to CSV (for Google Sheets)
module.exports.exportToCSV = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id })
            .sort({ date: -1 });

        // Create CSV content
        const headers = ['Date', 'Name', 'Type', 'Category', 'Amount', 'Currency', 'Description', 'Recurring', 'Recurrence', 'Input Method'];
        
        const rows = transactions.map(t => [
            t.date ? new Date(t.date).toLocaleDateString() : '',
            t.name || '',
            t.type || '',
            t.category || '',
            t.amount || 0,
            t.currency || 'CAD',
            t.description ? `"${t.description.replace(/"/g, '""')}"` : '', // Escape quotes
            t.recurring ? 'Yes' : 'No',
            t.recurrence || '',
            t.inputMethod || 'manual'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Set response headers
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=CoinCoach_Transactions_${new Date().toISOString().split('T')[0]}.csv`
        );

        res.send(csvContent);

    } catch (error) {
        console.error('CSV export error:', error);
        req.flash('error', 'Failed to export transactions');
        res.redirect('/transactions');
    }
};

// Generate Google Sheets compatible format
module.exports.exportForGoogleSheets = async (req, res) => {
    // Google Sheets works best with CSV, so reuse CSV export
    return module.exports.exportToCSV(req, res);
};