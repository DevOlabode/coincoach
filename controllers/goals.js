const Goals = require('../models/goals');
const Transactions = require('../models/transactions');
const goalsAI = require('../services/goalsAI');
const validator = require('validator');

/**
 * =========================
 * INDEX
 * =========================
 */
module.exports.index = async (req, res) => {
  const goals = await Goals.find({ user: req.user._id });
  res.render('goals/index', { goals });
};

/**
 * =========================
 * CREATE GOAL
 * =========================
 */
module.exports.goals = async (req, res) => {
  try {
    let { explanation } = req.body;

    // Sanitize user input (safe for storage & AI)
    explanation = validator.escape(explanation.trim());

    const transactions = await Transactions.find({
      userId: req.user._id
    }).lean();

    const aiResult = await goalsAI(explanation, transactions);

    // ---- Normalize AI Output ----
    const {
      title,
      goalSummary,
      financialAnalysis,
      feasibility,
      plan,
      progressTracking,
      motivationTip
    } = aiResult;

    const normalizedGoal = {
      user: req.user._id,
      title,
      userInput: explanation,

      goalSummary: {
        targetAmount: goalSummary.targetAmount,
        currentSavings: goalSummary.currentSavings,
        timeframeValue: goalSummary.timeframeValue,
        timeframeUnit: goalSummary.timeframeUnit,
        assumptions: goalSummary.assumptions || []
      },

      financialAnalysis: {
        averageIncomePerPeriod: financialAnalysis.averageIncomePerPeriod,
        averageExpensesPerPeriod: financialAnalysis.averageExpensesPerPeriod,
        averageSavingsPerPeriod: financialAnalysis.averageSavingsPerPeriod,
        spendingInsights: financialAnalysis.spendingInsights || []
      },

      feasibility: {
        isAchievable: feasibility.isAchievable,
        reason: feasibility.reason,
        suggestedAdjustments: feasibility.suggestedAdjustments || []
      },

      plan: plan.map(step => ({
        periodNumber: step.periodNumber,
        amountToSave: step.amountToSave,
        recommendedActions: step.recommendedActions || []
      })),

      progressTracking: {
        targetPerPeriod: progressTracking.targetPerPeriod,
        milestones: progressTracking.milestones.map(m => ({
          periodNumber: m.periodNumber,
          expectedSavings: m.expectedSavings
        })),
        reviewFrequency: progressTracking.reviewFrequency
      },

      motivationTip
    };

    const goal = new Goals(normalizedGoal);
    await goal.save();

    req.flash('success', 'Goal created successfully!');
    res.redirect(`/goals/${goal._id}`);
  } catch (err) {
    console.error('Create goal error:', err);
    req.flash('error', 'Failed to create goal');
    res.redirect('/goals');
  }
};

/**
 * =========================
 * SHOW
 * =========================
 */
module.exports.show = async (req, res) => {
  const goal = await Goals.findById(req.params.id);

  if (!goal) {
    req.flash('error', 'Goal not found');
    return res.redirect('/goals');
  }

  res.render('goals/show', { goal });
};

/**
 * =========================
 * DELETE
 * =========================
 */
module.exports.deleteGoal = async (req, res) => {
  const goal = await Goals.findByIdAndDelete(req.params.id);

  if (!goal) {
    req.flash('error', 'Goal not found');
    return res.redirect('/goals');
  }

  req.flash('success', `Deleted the ${goal.title}`);
  res.redirect('/goals');
};

/**
 * =========================
 * UPDATE STATUS
 * =========================
 */
module.exports.updateGoalStatus = async (req, res) => {
  const goal = await Goals.findById(req.params.id);

  if (!goal || goal.user.toString() !== req.user._id.toString()) {
    req.flash('error', 'Goal not found');
    return res.redirect('/goals');
  }

  goal.status = validator.escape(req.body.status);
  await goal.save();

  req.flash('success', `Goal status updated to ${goal.status}`);
  res.redirect(`/goals/${goal._id}`);
};
