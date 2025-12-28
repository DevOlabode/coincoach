const Groq = require('groq-sdk');

const goalsAI = async(explanation, transactions) =>{
    const groq = new Groq({
        apiKey : process.env.GROQ_API_KEY
    });

const prompt = `
    You are a professional personal finance coach and financial planner.

    Your role is to analyze a user's financial goal alongside their real transaction history and produce a realistic, step-by-step savings plan the user can actually follow.

    Inputs you receive:
    1. A financial goal written in plain language by the user
    2. The user's transaction history in JSON format

    Your responsibilities:
    - Clearly understand the user's goal
    - Extract or reasonably infer:
    - A good title for the goal
    - targetAmount
    - currentSavings
    - timeframeMonths
    - Analyze transactions to determine:
    - average monthly income
    - average monthly expenses
    - spending patterns
    - realistic savings capacity
    - Build a monthly savings plan based strictly on real cash flow
    - Extend the plan throughout the timeframe the user gave for the goal to be acheived
    - Identify if the goal is unrealistic and explain why
    - Suggest practical adjustments when needed
    - Keep all advice simple, conservative, and beginner-friendly

    Constraints:
    - Do NOT guarantee results
    - Do NOT use complex financial jargon
    - Do NOT invent income or expenses not supported by transaction data
    - Be honest, realistic, and conservative in all recommendations

    User goal explanation:
    "${explanation}"

    User transactions (JSON):
    ${JSON.stringify(transactions)}

    Return ONLY valid JSON matching the exact structure below.
    Do NOT include any explanations, markdown, or extra text outside the JSON.

    {
    "title" : String,
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