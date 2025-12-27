const mongoose = require("mongoose");
const {Schema} = mongoose;

const MonthlyPlanSchema = new Schema({
  month: {
    type: Number,
    required: true
  },
  amountToSave: {
    type: Number,
    required: true
  },
  recommendedActions: [String]
});

const MilestoneSchema = new Schema({
  month: {
    type: Number,
    required: true
  },
  expectedSavings: {
    type: Number,
    required: true
  }
});

const GoalSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // ===== Goal Summary =====
    goalSummary: {
      targetAmount: {
        type: Number,
        required: true
      },
      currentSavings: {
        type: Number,
        required: true
      },
      timeframeMonths: {
        type: Number,
        required: true
      },
      assumptions: [String]
    },

    // ===== Financial Analysis =====
    financialAnalysis: {
      averageMonthlyIncome: Number,
      averageMonthlyExpenses: Number,
      averageMonthlySavings: Number,
      spendingInsights: [String]
    },

    // ===== Feasibility =====
    feasibility: {
      isAchievable: {
        type: Boolean,
        required: true
      },
      reason: String,
      suggestedAdjustments: [String]
    },

    // ===== Monthly Plan =====
    monthlyPlan: [MonthlyPlanSchema],

    // ===== Progress Tracking =====
    progressTracking: {
      monthlyTarget: Number,
      milestones: [MilestoneSchema],
      reviewFrequency: {
        type: String,
        enum: ["weekly", "monthly", "quarterly"],
        default: "monthly"
      }
    },

    // ===== User Progress (Dynamic) =====
    progress: {
      totalSavedSoFar: {
        type: Number,
        default: 0
      },
      currentMonth: {
        type: Number,
        default: 1
      },
      completionPercentage: {
        type: Number,
        default: 0
      },
      lastReviewedAt: Date
    },

    motivationTip: {
      type: String
    },

    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", GoalSchema);
