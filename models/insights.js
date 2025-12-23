const mongoose = require('mongoose');

const InsightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    incomeVsExpenses: {
      totalIncome: { type: Number, required: true },
      totalExpenses: { type: Number, required: true },
      net: { type: Number, required: true },
      chart: { type: String, default: 'Income vs Expenses Over Time' }
    },

    expenseBreakdown: {
      categories: [
        {
          category: { type: String, required: true },
          total: { type: Number, required: true }
        }
      ],
      chart: { type: String, default: 'Expense Categories Pie Chart' }
    },

    topExpenses: [
      {
        name: String,
        amount: Number,
        date: Date,
        category: String
      }
    ],

    monthlyAverages: {
      averageMonthlyIncome: Number,
      averageMonthlySpend: Number,
      averageMonthlyNet: Number
    },

    incomeSources: {
      sources: [
        {
          category: String,
          total: Number
        }
      ],
      chart: { type: String, default: 'Income Categories' }
    },

    recentLargeTransactions: [
      {
        name: String,
        amount: Number,
        date: Date,
        type: {
          type: String,
          enum: ['income', 'expense']
        }
      }
    ],

    // ───────────────
    // AI INSIGHTS
    // ───────────────
    spendingEfficiencyScore: {
      type: Number,
      min: 0,
      max: 100
    },

    recurringInsights: {
      totalRecurringIncome: Number,
      totalRecurringExpenses: Number,
      recurringIncomePercentage: Number,
      notes: String
    },

    riskSignals: [
      {
        type: {
          type: String
        },
        message: String,
        severity: {
          type: String,
          enum: ['low', 'medium', 'high']
        }
      }
    ],

    optimizationSuggestions: [
      {
        area: String,
        suggestion: String
      }
    ],

    behaviorPatterns: {
      highestIncomeMonth: { type: String, default: null },
      highestExpenseMonth: { type: String, default: null },
      notes: String
    },

    futureProjection: {
      projectedMonthlyNet: Number,
      projectedYearlyNet: Number,
      confidence: {
        type: String,
        enum: ['low', 'medium', 'high']
      }
    },

    summary: {
      type: String,
      required: true
    },

    // ───────────────
    // CACHE CONTROL
    // ───────────────
    transactionCount: {
      type: Number,
      required: true
    },

    lastTransactionAt: {
      type: Date,
      required: true
    },

    generatedAt: {
      type: Date,
      default: Date.now
    },

    expiresAt: {
      type: Date,
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Insight', InsightSchema);