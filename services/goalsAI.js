const Groq = require('groq-sdk');

const goalsAI = async(explanation, transactions) =>{
    const groq = new Groq({
        apiKey : process.env.GROQ_API_KEY
    });

    const prompt = `
    You are a professional personal finance coach and financial planner.
    
    Your job is to analyze a user's financial goal alongside their real transaction history
    and produce a realistic savings plan the user can follow.
    
    Inputs you receive:
    1. A financial goal written in plain language by the user
    2. The user's transaction history in JSON format
    
    Your responsibilities:
    - Understand the user's goal and timeframe
    - Determine whether the goal is weekly, monthly, or quarterly
    - Extract or reasonably infer:
      - A clear title for the goal
      - targetAmount
      - currentSavings
      - timeframeValue
      - timeframeUnit (week, month, or quarter)
    
    Financial analysis:
    - Analyze transactions to calculate:
      - average income per period
      - average expenses per period
      - average savings per period
    - Base calculations strictly on transaction data
    - Do NOT invent income or expenses
    
    Planning rules:
    - Build a savings plan per period (week / month / quarter)
    - The plan must span the full timeframeValue
    - Each period should include:
      - amountToSave
      - practical, simple recommended actions
    - Be conservative and realistic
    - If the goal is unrealistic, clearly explain why
    
    Constraints:
    - Do NOT guarantee results
    - Do NOT use complex financial jargon
    - Do NOT guess emotions or intentions
    - Do NOT include disclaimers
    - Return ONLY valid JSON
    - Do NOT include explanations, markdown, or extra text
    
    User goal explanation:
    "${explanation}"
    
    User transactions (JSON):
    ${JSON.stringify(transactions)}
    
    Return ONLY valid JSON matching this exact structure:
    
    {
      "title": String,
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