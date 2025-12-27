const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlanStepSchema = new Schema({
  periodNumber: {
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
  periodNumber: {
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
    title :{
        type : String,
        required : true,
    },
    userInput : {
        type : String,
        required : true
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

      timeframeValue: {
        type: Number,
        required: true
      },
      timeframeUnit: {
        type: String,
        enum: ["week", "month", "quarter"],
        required: true
      },

      assumptions: [String]
    },

    // ===== Financial Analysis =====
    financialAnalysis: {
      averageIncomePerPeriod: Number,
      averageExpensesPerPeriod: Number,
      averageSavingsPerPeriod: Number,
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

    // ===== Plan (Weekly / Monthly / Quarterly) =====
    plan: [PlanStepSchema],

    // ===== Progress Tracking =====
    progressTracking: {
      targetPerPeriod: Number,
      milestones: [MilestoneSchema],
      reviewFrequency: {
        type: String,
        enum: ["weekly", "monthly"],
        default: "monthly"
      }
    },

    // ===== User Progress =====
    progress: {
      totalSavedSoFar: {
        type: Number,
        default: 0
      },
      currentPeriod: {
        type: Number,
        default: 1
      },
      completionPercentage: {
        type: Number,
        default: 0
      },
      lastReviewedAt: Date
    },

    motivationTip: String,

    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", GoalSchema);