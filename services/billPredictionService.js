const Transaction = require('../models/transactions');
const BillPredictor = require('../models/billsPredictor');

/**
 * Analyzes recurring transactions and predicts upcoming bills
 * @param {ObjectId} userId - The user's ID
 * @returns {Promise<Array>} Array of bill predictions
 */
async function analyzeBills(userId) {
    // Get all recurring expense transactions
    const recurringExpenses = await Transaction.find({
        userId,
        recurring: true,
        type: 'expense'
    }).sort({ date: -1 }).lean();

    // Group transactions by name/category to identify bill patterns
    const billPatterns = {};
    
    recurringExpenses.forEach(transaction => {
        const key = transaction.name || transaction.category;
        
        if (!billPatterns[key]) {
            billPatterns[key] = {
                name: key,
                category: transaction.category,
                recurrence: transaction.recurrence,
                amounts: [],
                dates: []
            };
        }
        
        billPatterns[key].amounts.push(transaction.amount);
        billPatterns[key].dates.push(new Date(transaction.date));
    });

    const predictions = [];

    // Analyze each bill pattern
    for (const [billName, pattern] of Object.entries(billPatterns)) {
        if (pattern.amounts.length < 2) continue; // Need at least 2 data points

        // Calculate statistics
        const amounts = pattern.amounts;
        const averageAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
        
        // Calculate standard deviation
        const variance = amounts.reduce((sum, val) => sum + Math.pow(val - averageAmount, 2), 0) / amounts.length;
        const stdDeviation = Math.sqrt(variance);

        // Predict next bill date based on recurrence
        const lastDate = pattern.dates[0];
        const nextBillDate = predictNextBillDate(lastDate, pattern.recurrence);

        // Predict next bill amount (using weighted average - recent bills matter more)
        const recentAmounts = amounts.slice(0, 3); // Last 3 bills
        const predictedAmount = recentAmounts.reduce((a, b) => a + b, 0) / recentAmounts.length;

        // Determine if bill is unusual (more than 1.5 standard deviations from mean)
        const threshold = averageAmount + (stdDeviation * 1.5);
        const isUnusual = predictedAmount > threshold;
        const deviation = predictedAmount - averageAmount;

        // Calculate days until bill
        const today = new Date();
        const daysUntil = Math.ceil((nextBillDate - today) / (1000 * 60 * 60 * 24));

        // Only create predictions for bills within next 30 days
        if (daysUntil > 0 && daysUntil <= 30) {
            predictions.push({
                userId,
                billName,
                category: pattern.category,
                predictedAmount: Math.round(predictedAmount * 100) / 100,
                averageAmount: Math.round(averageAmount * 100) / 100,
                deviation: Math.round(deviation * 100) / 100,
                isUnusual,
                predictedBillDate: nextBillDate,
                daysUntil,
                recurrence: pattern.recurrence,
                notified: false
            });
        }
    }

    return predictions;
}

/**
 * Predicts the next bill date based on recurrence pattern
 */
function predictNextBillDate(lastDate, recurrence) {
    const date = new Date(lastDate);
    
    switch (recurrence) {
        case 'daily':
            date.setDate(date.getDate() + 1);
            break;
        case 'weekly':
            date.setDate(date.getDate() + 7);
            break;
        case 'monthly':
            date.setMonth(date.getMonth() + 1);
            break;
        case 'yearly':
            date.setFullYear(date.getFullYear() + 1);
            break;
        default:
            date.setMonth(date.getMonth() + 1); // Default to monthly
    }
    
    return date;
}

/**
 * Saves bill predictions to database
 */
async function savePredictions(predictions) {
    // Clear old predictions for this user
    if (predictions.length > 0) {
        await BillPredictor.deleteMany({ userId: predictions[0].userId });
    }

    // Save new predictions
    if (predictions.length > 0) {
        await BillPredictor.insertMany(predictions);
    }

    return predictions;
}

/**
 * Gets predictions that need notifications (3 days before)
 */
async function getPendingNotifications(userId) {
    const predictions = await BillPredictor.find({
        userId,
        notified: false,
        daysUntil: { $lte: 3, $gte: 0 }
    }).lean();

    return predictions;
}

/**
 * Marks predictions as notified
 */
async function markAsNotified(predictionIds) {
    await BillPredictor.updateMany(
        { _id: { $in: predictionIds } },
        { $set: { notified: true } }
    );
}

/**
 * Main function to generate and save bill predictions
 */
async function generateBillPredictions(userId) {
    try {
        const predictions = await analyzeBills(userId);
        await savePredictions(predictions);
        return predictions;
    } catch (error) {
        console.error('Error generating bill predictions:', error);
        throw error;
    }
}

module.exports = {
    analyzeBills,
    savePredictions,
    generateBillPredictions,
    getPendingNotifications,
    markAsNotified
};