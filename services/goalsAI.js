const Groq = require('groq-sdk');

const goalsAI = async (explanation, transactions) => {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  const prompt = `
You are a professional personal finance coach and financial planner.

Your job is to analyze a user's financial goal alongside their real transaction history
and produce a realistic savings plan the user can follow.

=========================
CURRENCY RULES (CRITICAL)
=========================

1. The user's goal MAY be written in a different currency than their earnings.
   Examples:
   - "Save 6000 Nigerian naira in 4 weeks"
   - "Save €2,000 while earning in USD"

2. You MUST:
   - Detect the currency mentioned in the goal (goalCurrency)
   - Detect the user's primary earning currency from transactions (earningCurrency)
   - Build the savings plan in earningCurrency
   - Convert the targetAmount into earningCurrency

3. Currency detection rules:
   - Use symbols (₦, $, €, £)
   - Use currency names (naira, dollars, euros, pounds)
   - Use transaction currency fields to infer earningCurrency

4. Exchange rates:
   - Use reasonable, recent real-world exchange rates
   - Be conservative
   - Do NOT hallucinate extreme values
   - Return the rate used explicitly

=========================
INPUTS
=========================

User goal explanation:
"${explanation}"

User transactions (JSON):
${JSON.stringify(transactions)}

=========================
FINANCIAL ANALYSIS RULES
=========================

- Analyze transactions to calculate:
  - average income per period
  - average expenses per period
  - average savings per period
- Base calculations strictly on transaction data
- Do NOT invent income or expenses

=========================
PLANNING RULES
=========================

- Determine if the goal timeframe is weekly, monthly, or quarterly
- Build a savings plan per period
- The plan must span the full timeframeValue
- Each period must include:
  - amountToSave (in earningCurrency)
  - practical, simple recommended actions
- Be realistic and conservative

=========================
OUTPUT RULES
=========================

- Return ONLY valid JSON
- Do NOT include explanations, markdown, or extra text
- Do NOT include disclaimers

=========================
RETURN THIS EXACT JSON STRUCTURE
=========================

{
  "title": string,

  "currencyInfo": {
    "goalCurrency": string,
    "earningCurrency": string,
    "exchangeRateUsed": number,
    "originalTargetAmount": number,
    "convertedTargetAmount": number
  },

  "goalSummary": {
    "targetAmount": number,
    "currentSavings": number,
    "timeframeValue": number,
    "timeframeUnit": "week" | "month" | "quarter",
    "assumptions": string[]
  },

  "financialAnalysis": {
    "averageIncomePerPeriod": number,
    "averageExpensesPerPeriod": number,
    "averageSavingsPerPeriod": number,
    "spendingInsights": string[]
  },

  "feasibility": {
    "isAchievable": boolean,
    "reason": string,
    "suggestedAdjustments": string[]
  },

  "plan": [
    {
      "periodNumber": number,
      "amountToSave": number,
      "recommendedActions": string[]
    }
  ],

  "progressTracking": {
    "targetPerPeriod": number,
    "milestones": [
      { "periodNumber": number, "expectedSavings": number }
    ],
    "reviewFrequency": "weekly" | "monthly"
  },

  "motivationTip": string
}
`;

  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0
    });

    const raw = response.choices[0].message.content;

    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    const jsonString = raw.substring(jsonStart, jsonEnd + 1);

    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Groq goal planning error:", err);
    throw new Error("Failed to generate financial goal plan");
  }
};

module.exports = goalsAI;
