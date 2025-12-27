const Groq = require("groq-sdk");

const transactionInsight = async (transactions) => {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const prompt = `
You are a financial analytics and insight engine.

You will receive a list of user transactions in JSON format.
Each transaction includes:
- name
- type ("income" or "expense")
- amount
- currency
- date (ISO format)
- category
- description
- recurring (boolean)
- recurrence (optional)
- inputMethod

Your task is to analyze ALL transactions and return a structured JSON object containing computed metrics AND intelligent insights.

────────────────────────────────────────
REQUIRED OUTPUT FORMAT (JSON ONLY)
────────────────────────────────────────

{
  "incomeVsExpenses": {
    "totalIncome": number,
    "totalExpenses": number,
    "net": number,
    "chart": "Income vs Expenses Over Time"
  },

  "expenseBreakdown": {
    "categories": [
      { "category": string, "total": number }
    ],
    "chart": "Expense Categories Pie Chart"
  },

  "topExpenses": [
    { "name": string, "amount": number, "date": string, "category": string }
  ],

  "monthlyAverages": {
    "averageMonthlyIncome": number,
    "averageMonthlySpend": number,
    "averageMonthlyNet": number
  },

  "incomeSources": {
    "sources": [
      { "category": string, "total": number }
    ],
    "chart": "Income Categories"
  },

  "recentLargeTransactions": [
    { "name": string, "amount": number, "date": string, "type": string }
  ],

  "spendingEfficiencyScore": number,

  "recurringInsights": {
    "totalRecurringIncome": number,
    "totalRecurringExpenses": number,
    "recurringIncomePercentage": number,
    "notes": string
  },

  "riskSignals": [
    {
      "type": string,
      "message": string,
      "severity": "low" | "medium" | "high"
    }
  ],

  "optimizationSuggestions": [
    {
      "area": string,
      "suggestion": string
    }
  ],

  "behaviorPatterns": {
    "highestIncomeMonth": string | null,
    "highestExpenseMonth": string | null,
    "notes": string
  },

  "futureProjection": {
    "projectedMonthlyNet": number,
    "projectedYearlyNet": number,
    "confidence": "low" | "medium" | "high"
  },

  "summary": string
}

────────────────────────────────────────
RULES
────────────────────────────────────────

- Return ONLY valid JSON. No markdown, no explanations.
- Valid JSON and Valid JSON only. Nothing else.
- All numbers must be numeric (no strings).
- Dates must remain in ISO format.
- Ignore transactions with invalid or missing amounts or dates.
- Group monthly calculations by calendar month (YYYY-MM).
- “Large transactions” = top 5 highest-value transactions in the last 90 days.
- If a section has no data, return empty arrays or null values.
- Do NOT invent data.
- Do NOT infer categories that do not exist.
- Category names are case-sensitive; do not auto-merge them.
- Use the full transaction list for all calculations.
- If you don't have a value for something, return NULL

────────────────────────────────────────
TRANSACTIONS INPUT
────────────────────────────────────────
${JSON.stringify(transactions)}
`;

  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b", 
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0,
    });

    const raw = response.choices[0].message.content;

    // Parse JSON safely
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    const jsonString = raw.substring(jsonStart, jsonEnd + 1);

    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Groq Insight Error:", error);
    throw new Error("Failed to generate transaction insights");
  }
};

module.exports = transactionInsight;