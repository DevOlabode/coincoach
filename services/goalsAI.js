const Groq = require('groq-sdk');

const goalsAI = async(explanation, transactions) =>{
    const groq = new Groq({
        apiKey : process.env.GROQ_API_KEY
    });

    const prompt = `
    You are a professional personal finance coach and planner.
    
    Your task is to analyze a user's financial goal together with their real transaction history,
    then generate a realistic, step-by-step plan that the user can actually follow to reach the goal.
    
    You are given:
    1. The user's goal explanation written in plain language
    2. A list of the user's financial transactions
    
    You must:
    - Understand the user's goal
    - Extract or infer:
      - targetAmount
      - currentSavings
      - timeframe (in months)
    - Analyze transactions to understand:
      - average monthly income
      - average monthly expenses
      - spending patterns
      - savings potential
    - Create a realistic monthly savings plan based on actual cash flow
    - Warn the user if the goal is unrealistic and suggest adjustments
    - Keep advice simple, conservative, and practical
    - Assume the user is a beginner
    
    Rules:
    - Do NOT promise guaranteed results
    - Do NOT use complex financial jargon
    - Do NOT invent income or expenses not supported by transactions
    - Be honest and realistic
    
    User goal explanation:
    "${explanation}"
    
    User transactions (JSON):
    ${JSON.stringify(transactions)}
    
    Return ONLY valid JSON in the exact structure below.
    Do NOT include explanations, markdown, or extra text. Just JSON
    
    {
      "goalSummary": {
        "targetAmount": number,
        "currentSavings": number,
        "timeframeMonths": number,
        "assumptions": string[]
      },
      "financialAnalysis": {
        "averageMonthlyIncome": number,
        "averageMonthlyExpenses": number,
        "averageMonthlySavings": number,
        "spendingInsights": string[]
      },
      "feasibility": {
        "isAchievable": boolean,
        "reason": string,
        "suggestedAdjustments": string[]
      },
      "monthlyPlan": [
        {
          "month": number,
          "amountToSave": number,
          "recommendedActions": string[]
        }
      ],
      "progressTracking": {
        "monthlyTarget": number,
        "milestones": [
          { "month": number, "expectedSavings": number }
        ],
        "reviewFrequency": "monthly"
      },
      "motivationTip": string
    }
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
    }catch(err){
        console.error('Groq goal planning Error: ', err);
        throw new Error('Failed to generate financial goal plan')
    }
};

module.exports = goalsAI