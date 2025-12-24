const User = require('../models/user');
const { generateBillPredictions } = require('../services/billPredictionService');

/**
 * Runs bill predictions for all users
 * Should be called daily via a cron job or scheduler
 */
async function runDailyBillPredictions() {
    try {
        console.log('Starting daily bill predictions...');
        
        // Get all users
        const users = await User.find().select('_id').lean();
        
        let successCount = 0;
        let errorCount = 0;

        // Generate predictions for each user
        for (const user of users) {
            try {
                await generateBillPredictions(user._id);
                successCount++;
            } catch (error) {
                console.error(`Failed to generate predictions for user ${user._id}:`, error);
                errorCount++;
            }
        }

        console.log(`Daily bill predictions complete: ${successCount} successful, ${errorCount} errors`);
        return { successCount, errorCount };
    } catch (error) {
        console.error('Error running daily bill predictions:', error);
        throw error;
    }
}

/**
 * Initialize scheduler to run daily at 6 AM
 * Call this from your main app file (index.js)
 */
function initializeBillScheduler() {
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    
    // Calculate milliseconds until next 6 AM
    const now = new Date();
    const next6AM = new Date();
    next6AM.setHours(6, 0, 0, 0);
    
    if (next6AM <= now) {
        next6AM.setDate(next6AM.getDate() + 1);
    }
    
    const msUntilNext6AM = next6AM - now;

    console.log(`Bill prediction scheduler initialized. Next run: ${next6AM.toLocaleString()}`);

    // Run first time at next 6 AM
    setTimeout(() => {
        runDailyBillPredictions();
        
        // Then run every 24 hours
        setInterval(() => {
            runDailyBillPredictions();
        }, TWENTY_FOUR_HOURS);
    }, msUntilNext6AM);
}

module.exports = {
    runDailyBillPredictions,
    initializeBillScheduler
};