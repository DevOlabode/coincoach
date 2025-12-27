const Goals = require('../models/goals');
const Transactions = require('../models/transactions');
const goalsAI = require('../services/goalsAI');

module.exports.index = async (req, res) => {
  const goals = await Goals.find({ user: req.user._id });
  res.render('goals/index', { goals });
};

module.exports.goals = async (req, res) => {
  const { explanation } = req.body;

  // 1️⃣ Fetch transactions
  const transactions = await Transactions.find({
    userId: req.user._id
  }).lean();

  // 2️⃣ Call AI
  const aiResult = await goalsAI(explanation, transactions);

  /**
   * 3️⃣ Normalize AI output → match Goal schema
   */

  const timeframeValue = aiResult.goalSummary.timeframeMonths;

  const normalizedGoal = {
    user: req.user._id,

    goalSummary: {
      targetAmount: aiResult.goalSummary.targetAmount,
      currentSavings: aiResult.goalSummary.currentSavings,
      timeframeValue,
      timeframeUnit: 'month',
      assumptions: aiResult.goalSummary.assumptions || []
    },

    financialAnalysis: {
      averageIncomePerPeriod: aiResult.financialAnalysis.averageMonthlyIncome,
      averageExpensesPerPeriod: aiResult.financialAnalysis.averageMonthlyExpenses,
      averageSavingsPerPeriod: aiResult.financialAnalysis.averageMonthlySavings,
      spendingInsights: aiResult.financialAnalysis.spendingInsights || []
    },

    feasibility: aiResult.feasibility,

    plan: aiResult.monthlyPlan.map(item => ({
      periodNumber: item.month,
      amountToSave: item.amountToSave,
      recommendedActions: item.recommendedActions || []
    })),

    progressTracking: {
      targetPerPeriod: aiResult.progressTracking.monthlyTarget,
      milestones: aiResult.progressTracking.milestones.map(m => ({
        periodNumber: m.month,
        expectedSavings: m.expectedSavings
      })),
      reviewFrequency: 'monthly'
    },

    motivationTip: aiResult.motivationTip
  };

  // 4️⃣ Save goal
  const goal = new Goals(normalizedGoal);
  await goal.save();

  req.flash('success', 'Goal created successfully!');
  res.redirect('/goals');
};

module.exports.show = async(req, res)=>{
    const goal = await Goals.findById(req.params.id);
    res.render('goals/show', {goal})
}
