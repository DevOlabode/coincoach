const Transaction = require('../models/transactions');
const Insight = require('../models/insights');
const generateInsights = require('../utils/generateInsights');

module.exports.allInsights = async (req, res) => {
    try {
        // Get the most recent insight for the user
        const latestInsight = await Insight.findOne({ userId: req.user._id })
            .sort({ generatedAt: -1 })
            .lean();
        
        if (!latestInsight) {
            // Check if user has transactions
            const transactionCount = await Transaction.countDocuments({ userId: req.user._id });
            
            if (transactionCount === 0) {
                return res.render('insights/all', { 
                    insight: null,
                    message: 'No transactions found. Add some transactions to generate insights.'
                });
            }
            
            // Generate insights if transactions exist but no insights
            try {
                const newInsight = await generateInsights(req.user._id);
                return res.render('insights/all', { 
                    insight: newInsight.toObject(),
                    message: undefined
                });
            } catch (error) {
                return res.render('insights/all', { 
                    insight: null,
                    message: error.message || 'Failed to generate insights. Please try again.'
                });
            }
        }
        
        res.render('insights/all', { 
            insight: latestInsight,
            message: undefined
        });
    } catch (error) {
        req.flash('error', 'Failed to load insights');
        res.redirect('/transactions');
    }
};

module.exports.generateInsights = async (req, res) => {
    try {
        const insight = await generateInsights(req.user._id);
        req.flash('success', 'Insights generated successfully!');
        res.redirect('/insights');
    } catch (error) {
        req.flash('error', error.message || 'Failed to generate insights');
        res.redirect('/transactions');
    }
};
