const Goals = require('../models/goals');

module.exports = async function updateGoalProgressFromTransaction(transaction) {
  // Only track savings-type transactions
  if (
    transaction.type !== 'expense' ||
    transaction.category !== 'goal-savings'
  ) {
    return;
  }

  const goals = await Goals.find({
    user: transaction.userId,
    status: 'active'
  });

  for (let goal of goals) {
    goal.progress.totalSavedSoFar += transaction.amount;

    goal.progress.completionPercentage =
      (goal.progress.totalSavedSoFar / goal.goalSummary.targetAmount) * 100;

    // Advance period automatically if target met for this period
    if (goal.progress.totalSavedSoFar >=
        goal.progress.currentPeriod * goal.progressTracking.targetPerPeriod) {
      goal.progress.currentPeriod += 1;
    }

    // Mark goal complete
    if (goal.progress.completionPercentage >= 100) {
      goal.status = 'completed';
      goal.progress.completionPercentage = 100;
    }

    goal.progress.lastReviewedAt = new Date();
    await goal.save();
  }
};
