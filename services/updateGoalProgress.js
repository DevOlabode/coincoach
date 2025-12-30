const Goals = require('../models/goals');
const { sendGoalCompletionEmail } = require('./emailService');
const User = require('../models/user');

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

    // Auto-complete goal
    if (goal.progress.completionPercentage >= 100 && goal.status !== 'completed') {
      goal.status = 'completed';
      goal.progress.completionPercentage = 100;
      
      // Send completion email
      const user = await User.findById(transaction.userId);
      if (user) {
        await sendGoalCompletionEmail(
          user.email,
          user.displayName || user.fullName,
          goal.title,
          goal.goalSummary.targetAmount
        );
      }
    }

    goal.progress.lastReviewedAt = new Date();
    await goal.save();
  }
};