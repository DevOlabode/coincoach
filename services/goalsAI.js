const Groq = require('groq-sdk');

const goals = async(explanation) =>{
    const groq = new Groq({
        apiKey : process.env.GROQ_API_KEY
    });

    const prompt = `
    You are a professional financial coach helping users reach realistic financial goals.
    
    The user will explain their financial goal in plain language.
    Your job is to:
    1. Clearly understand the user's goal
    2. Extract the target amount, current savings, and timeframe (if mentioned)
    3. If any detail is missing, make a reasonable assumption and clearly state it
    4. Create a step-by-step plan the user can realistically follow
    5. Break the plan into monthly actions
    6. Explain how progress should be tracked over time
    7. Keep the advice practical, simple, and achievable for a normal person
    
    Rules:
    - Do NOT use complicated financial jargon
    - Do NOT promise guaranteed returns
    - Be realistic and conservative
    - Assume the user is a beginner unless stated otherwise
    - Focus on saving discipline, budgeting, and consistency
    
    User goal explanation:
    "${explanation}"
    
    Return the response in the following structured format:
    
    Title:
    (A short motivating title for the goal)
    
    Goal Summary:
    - Target amount:
    - Current amount:
    - Timeframe:
    - Assumptions made (if any):
    
    Monthly Plan:
    - Month 1:
    - Month 2:
    - Month 3:
    (Continue until the goal timeframe ends)
    
    Savings Strategy:
    - How much to save monthly
    - Where to keep the money (e.g. savings account, low-risk options)
    - What to avoid
    
    Progress Tracking:
    - How progress should be measured
    - What milestones to expect
    - When to review or adjust the plan
    
    Motivation Tip:
    (A short encouraging message to help the user stay consistent)
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
}