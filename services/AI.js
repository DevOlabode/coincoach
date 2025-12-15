// services/AI.js

const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports.chatbot = async (chatMessage, transactions) => {
    const prompt = `

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