const Transactions = require('../models/transactions');
const { analyseReceipt } = require('../services/recieptAI');

const fs = require('fs');
const Tesseract = require('tesseract.js');

module.exports.getReciept = (req, res) => {
    res.render('reciept/getReciept')
};

module.exports.analyseReciept = async (req, res) => {
    const { imageBase64 } = req.body;
    
    // Validate input
    if (!imageBase64) {
        return res.status(400).json({ 
            success: false, 
            error: 'Image is required' 
        });
    }

    try {
        // Clean base64 string (remove data URL prefix if present)
        let cleanedBase64 = imageBase64;
        if (imageBase64.includes(',')) {
            cleanedBase64 = imageBase64.split(',')[1];
        }

        // Analyze receipt using AI service
        const products = await analyseReceipt(cleanedBase64);

        if (!products || products.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No products found in receipt',
                transactions: []
            });
        }

        // Convert products to transactions
        const transactions = [];
        const errors = [];

        for (const product of products) {
            try {
                // Build description from product details
                const descriptionParts = [];
                if (product.brand && product.brand !== 'Unknown') {
                    descriptionParts.push(`Brand: ${product.brand}`);
                }
                if (product.material && product.material !== 'Unknown') {
                    descriptionParts.push(`Material: ${product.material}`);
                }
                if (product.weight && product.weight > 0) {
                    descriptionParts.push(`Weight: ${product.weight}g`);
                }
                if (product.originCountry && product.originCountry !== 'Unknown') {
                    descriptionParts.push(`Origin: ${product.originCountry}`);
                }
                if (product.notes && product.notes !== 'Unknown') {
                    descriptionParts.push(`Notes: ${product.notes}`);
                }
                const description = descriptionParts.length > 0 
                    ? descriptionParts.join(' | ') 
                    : 'Extracted from receipt';

                // Create transaction
                const transaction = new Transactions({
                    userId: req.user._id,
                    name: product.name || 'Unnamed Product',
                    type: 'expense',
                    amount: product.price || 0,
                    currency: 'CAD', // Default to CAD, could be enhanced to detect currency
                    date: new Date(),
                    category: product.category || 'Uncategorized',
                    description: description,
                    inputMethod: 'imported'
                });

                await transaction.save();
                transactions.push(transaction);
            } catch (err) {
                console.error(`Error creating transaction for product ${product.name}:`, err);
                errors.push(`Failed to create transaction for ${product.name || 'product'}: ${err.message}`);
            }
        }

        // Return response
        if (transactions.length > 0) {
            return res.status(200).json({
                success: true,
                message: `Successfully created ${transactions.length} transaction(s) from receipt`,
                transactions: transactions.map(t => ({
                    id: t._id,
                    name: t.name,
                    amount: t.amount,
                    category: t.category,
                    date: t.date
                })),
                errors: errors.length > 0 ? errors : undefined
            });
        } else {
            return res.status(500).json({
                success: false,
                error: 'Failed to create transactions',
                errors: errors
            });
        }

    } catch (error) {
        console.error('Error analyzing receipt:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to analyze receipt'
        });
    }
};