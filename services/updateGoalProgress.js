const Goals = require('../models/goals');

module.exports = async function updateGoalProgressFromTransaction(transaction) {
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

    if (goal.progress.totalSavedSoFar >=
        goal.progress.currentPeriod * goal.progressTracking.targetPerPeriod) {
      goal.progress.currentPeriod += 1;
    }

    if (goal.progress.completionPercentage >= 100) {
      goal.status = 'completed';
      goal.progress.completionPercentage = 100;
    }

    goal.progress.lastReviewedAt = new Date();
    await goal.save();
  }
};
