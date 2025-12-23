const Transaction = require('../models/transactions');
const Insight = require('../models/insights');
const transactionInsight = require('../services/insightAI');

/**
 * Generates insights for a user based on their transactions
 * @param {ObjectId} userId - The user's ID
 * @returns {Promise<Object>} The generated insight document
 */
async function generateInsights(userId) {
    const transactions = await Transaction.find({ userId })
        .sort({ date: -1, updatedAt: -1 })
        .lean();
    
    const count = await Transaction.countDocuments({ userId });
    
    if (count === 0) {
        throw new Error('No transactions found. Add some transactions to generate insights.');
    }

    const insightData = await transactionInsight(transactions);
    
    const lastTransactionAt = transactions[0]?.updatedAt || transactions[0]?.date || new Date();

    const insightPayload = {
        userId,
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

    const insight = new Insight(insightPayload);
    await insight.save();
    
    return insight;
}

module.exports = generateInsights;

