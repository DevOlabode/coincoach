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

    let { explanation } = req.body;

    // ✅ Explicit, safe sanitization
    explanation = validator.escape(explanation.trim());

    const transactions = await Transactions.find({
        userId: req.user._id
    }).lean();

    const aiResult = await goalsAI(explanation, transactions);

    const timeframeValue = aiResult.goalSummary.timeframeMonths;

    const normalizedGoal = {
        user: req.user._id,
        title: aiResult.title,
        userInput: explanation,

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

    const goal = new Goals(normalizedGoal);
    await goal.save();

    req.flash('success', 'Goal created successfully!');
    res.redirect(`/goals/${goal._id}`);
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
