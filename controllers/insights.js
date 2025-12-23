const Transaction = require('../models/transactions');
const Insight = require('../models/insights');
const transactionInsight = require('../services/insightAI');

module.exports.allInsights = async (req, res) => {
    try {
        // Get transactions sorted by date (most recent first)
        const transactions = await Transaction.find({ userId: req.user._id })
            .sort({ date: -1, updatedAt: -1 })
            .lean(); // Convert to plain objects for AI service
        
        const count = await Transaction.countDocuments({ userId: req.user._id });
        
        // Handle empty transactions case
        if (count === 0) {
            return res.render('insights/all', { 
                insights: null,
                message: 'No transactions found. Add some transactions to generate insights.'
            });
        }

        // Generate insights using AI
        const insightData = await transactionInsight(transactions);
        
        // Get the most recent transaction date
        const lastTransactionAt = transactions[0]?.updatedAt || transactions[0]?.date || new Date();

        // Ensure required fields have defaults if missing
        const insightPayload = {
            userId: req.user._id,
            incomeVsExpenses: insightData.incomeVsExpenses || {
                totalIncome: 0,
                totalExpenses: 0,
                net: 0
            },
            expenseBreakdown: insightData.expenseBreakdown || {
                categories: [],
                chart: 'Expense Categories Pie Chart'
            },
            topExpenses: insightData.topExpenses || [],
            monthlyAverages: insightData.monthlyAverages || {},
            incomeSources: insightData.incomeSources || {
                sources: [],
                chart: 'Income Categories'
            },
            recentLargeTransactions: insightData.recentLargeTransactions || [],
            spendingEfficiencyScore: insightData.spendingEfficiencyScore,
            recurringInsights: insightData.recurringInsights || {},
            riskSignals: insightData.riskSignals || [],
            optimizationSuggestions: insightData.optimizationSuggestions || [],
            behaviorPatterns: insightData.behaviorPatterns || {},
            futureProjection: insightData.futureProjection || {},
            summary: insightData.summary || '',
            transactionCount: count,
            lastTransactionAt
        };

        // Create insight document
        const insights = new Insight(insightPayload);
        await insights.save();

        // Render with insights object (view expects insights.insight.*)
        // We'll structure it so the view can access insight data
        res.render('insights/all', { 
            insights: {
                insight: insightData, // Nested for view compatibility
                ...insights.toObject() // Also include full document
            },
            message: undefined // Explicitly set to avoid undefined variable errors
        });
    } catch (error) {
        console.error('Error generating insights:', error);
        req.flash('error', 'Failed to generate insights. Please try again.');
        res.redirect('/transactions');
    }
};