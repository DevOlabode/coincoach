const Transaction = require('../models/transactions');
const BillPrediction = require('../models/billsPredictor');

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
        // Use name as primary key, fallback to category
        const key = (transaction.name && transaction.name.trim()) || transaction.category || 'Unknown Bill';
        
        if (!billPatterns[key]) {
            billPatterns[key] = {
                name: key,
                category: transaction.category || 'Uncategorized',
                recurrence: transaction.recurrence || 'monthly',
                amounts: [],
                dates: []
            };
        }
        
        if (transaction.amount && !isNaN(transaction.amount)) {
            billPatterns[key].amounts.push(transaction.amount);
        }
        if (transaction.date) {
            billPatterns[key].dates.push(new Date(transaction.date));
        }
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
        // Sort dates to get the most recent
        const sortedDates = [...pattern.dates].sort((a, b) => b - a);
        const lastDate = sortedDates[0];
        const nextBillDate = predictNextBillDate(lastDate, pattern.recurrence || 'monthly', sortedDates);

        // Predict next bill amount (using weighted average - recent bills matter more)
        const recentAmounts = amounts.slice(0, Math.min(3, amounts.length)); // Last 3 bills or all if less
        const predictedAmount = recentAmounts.reduce((a, b) => a + b, 0) / recentAmounts.length;

        // Determine if bill is unusual (more than 1.5 standard deviations from mean)
        const threshold = averageAmount + (stdDeviation * 1.5);
        const isUnusual = predictedAmount > threshold;
        const deviation = predictedAmount - averageAmount;

        // Calculate days until bill
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextDate = new Date(nextBillDate);
        nextDate.setHours(0, 0, 0, 0);
        const daysUntil = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));

        // Only create predictions for bills within next 30 days
        if (daysUntil > 0 && daysUntil <= 30) {
            predictions.push({
                userId,
                billName,
                category: pattern.category || 'Uncategorized',
                predictedAmount: Math.round(predictedAmount * 100) / 100,
                averageAmount: Math.round(averageAmount * 100) / 100,
                deviation: Math.round(deviation * 100) / 100,
                isUnusual,
                predictedBillDate: nextDate,
                daysUntil,
                recurrence: pattern.recurrence || 'monthly',
                notified: false
            });
        }
    }

    return predictions;
}

/**
 * Predicts the next bill date based on recurrence pattern
 * Also considers historical dates to calculate average interval
 */
function predictNextBillDate(lastDate, recurrence, allDates = []) {
    const date = new Date(lastDate);
    
    // If we have multiple dates, try to calculate average interval
    if (allDates.length >= 2) {
        const sortedDates = [...allDates].sort((a, b) => b - a); // Most recent first
        const intervals = [];
        
        for (let i = 0; i < sortedDates.length - 1; i++) {
            const diff = sortedDates[i] - sortedDates[i + 1];
            intervals.push(diff);
        }
        
        if (intervals.length > 0) {
            const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            const nextDate = new Date(lastDate.getTime() + avgInterval);
            return nextDate;
        }
    }
    
    // Fallback to recurrence-based calculation
    switch (recurrence) {
        case 'daily':
            date.setDate(date.getDate() + 1);
            break;
        case 'weekly':
            date.setDate(date.getDate() + 7);
            break;
        case 'monthly':
            date.setMonth(date.getMonth() + 1);
            // Handle month-end edge cases (e.g., Jan 31 -> Feb 28)
            if (date.getDate() !== new Date(lastDate).getDate()) {
                date.setDate(0); // Go to last day of previous month
            }
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
        await BillPrediction.deleteMany({ userId: predictions[0].userId });
    }

    // Save new predictions
    if (predictions.length > 0) {
        await BillPrediction.insertMany(predictions);
    }

    return predictions;
}

/**
 * Gets predictions that need notifications (3 days before)
 */
async function getPendingNotifications(userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const predictions = await BillPrediction.find({
        userId,
        notified: false,
        predictedBillDate: {
            $gte: today,
            $lte: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000) // Next 3 days
        }
    }).lean();

    // Calculate daysUntil for each prediction
    return predictions.map(pred => {
        const daysUntil = Math.ceil((new Date(pred.predictedBillDate) - today) / (1000 * 60 * 60 * 24));
        return { ...pred, daysUntil };
    }).filter(pred => pred.daysUntil >= 0 && pred.daysUntil <= 3);
}

/**
 * Marks predictions as notified
 */
async function markAsNotified(predictionIds) {
    if (predictionIds && predictionIds.length > 0) {
        await BillPrediction.updateMany(
            { _id: { $in: predictionIds } },
            { $set: { notified: true } }
        );
    }
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