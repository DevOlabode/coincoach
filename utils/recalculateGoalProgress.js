module.exports = function recalculateGoalProgress(goal) {
    const completedSteps = goal.plan.filter(step => step.completed);
  
    const totalSaved = completedSteps.reduce(
      (sum, step) => sum + step.amountToSave,
      0
    );
  
    goal.progress.totalSavedSoFar = totalSaved;
  
    goal.progress.currentPeriod =
      completedSteps.length + 1 > goal.plan.length
        ? goal.plan.length
        : completedSteps.length + 1;
  
    goal.progress.completionPercentage = Math.min(
      (totalSaved / goal.goalSummary.targetAmount) * 100,
      100
    );
  
    goal.progress.lastReviewedAt = new Date();
  
    if (goal.progress.completionPercentage >= 100) {
      goal.status = 'completed';
    }
  };
  