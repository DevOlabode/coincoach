const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports.generateResponse = async (req, res) => {
    try {
        const { messages, sessionId } = req.body;
        const Transaction = require('../models/transactions');
        
        // Get user's recent transactions for context
        const transactions = await Transaction.find({ userId: req.user._id })
            .sort({ date: -1 })
            .limit(50);
        
        const transactionSummary = transactions.map(t => 
            `${t.date.toISOString().split('T')[0]}: ${t.type} - ${t.category} - $${t.amount} - ${t.description}`
        ).join('\n');

        const systemPrompt = `You are a personal finance coach helping users make smarter financial decisions.

Context - User's Recent Transactions:
${transactionSummary}

Guidelines:
1. Focus on improving financial health with actionable advice
2. Provide simple, practical tips for saving and budgeting
3. Use a warm, conversational tone
4. Keep responses concise (under 200 words typically)
5. Ask clarifying questions when needed
6. Avoid complex jargon - keep it accessible
7. Encourage responsible money habits
8. Use the transaction data to provide personalized insights
9. Don't include disclaimers about not being a financial advisor

Analyze spending patterns, identify areas for improvement, and provide specific recommendations based on their actual transaction history.`;

        const chatMessages = [
            { role: "system", content: systemPrompt },
            ...messages
        ];

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: chatMessages,
            temperature: 0.7,
            max_tokens: 1024
        });

        const aiMessage = response.choices[0]?.message?.content || "I apologize, I couldn't generate a response.";
        
        res.json({ message: aiMessage });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
};