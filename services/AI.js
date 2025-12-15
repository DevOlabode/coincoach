// services/AI.js

const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports.chatbot = async (chatMessage, transactions) => {
const prompt = `
You are a personal finance coach guiding users to make smarter spending decisions and manage their money wisely.
Here is a list of the user's recent transactions: ${transactions}.
Using this information, act as a chatbot that answers the user's questions about their financial habits, points out patterns, and suggests practical ways to save or budget better.
User Message: ${chatMessage}
Provide a clear and supportive response.

Rules:
1. Always focus on improving the user's financial health.
2. Give simple, actionable tips for saving and budgeting.
3. Do not include disclaimers about financial advice.
4. Keep responses short and under 150 words.
5. Use a warm, conversational tone.
6. Ask for clarification if the user's request is vague.
7. Do not format responses in markdown.
8. Avoid complex financial terms; keep explanations easy to follow.
9. Encourage responsible and sustainable money habits.
`;
    try {
        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-safeguard-20b",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });
        const content = response.choices[0]?.message?.content;
        const cleanedText = content.trim();
        return cleanedText;
    }catch(err){
        console.error("Summarizer error:", err.message || err);
        return "Summary generation failed.";
    }
};

module.exports.chatbot;