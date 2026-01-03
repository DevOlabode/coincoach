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

        const systemPrompt = `
        You are a personal finance coach inside a budgeting application.
        
        Context – User's Recent Transactions:
        ${transactionSummary}
        
        Tone rules:
        - Explain finances clearly to a practical adult
        - Do NOT sound childish, playful, or patronizing
        - Do NOT use metaphors involving toys, candy, or children
        - Keep language simple, direct, and respectful
        - Sound like a professional finance app, not a chatbot character
        
        Response structure:
        1. Brief summary of income
        2. Brief summary of expenses
        3. Notable spending or saving patterns
        4. 2–3 specific, actionable suggestions
        5. Do NOT ask questions unless essential information is missing
        
        Guidelines:
        - Base insights strictly on the transaction data provided
        - Do not guess the user's emotions or intentions
        - Avoid unnecessary financial jargon
        - Encourage healthy and responsible money habits
        - Do NOT include disclaimers about not being a financial advisor
        - Do NOT use emojis
        - Do NOT format the response as a conversation
        `;
        

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

        const aiMessage =
        response.choices[0]?.message?.content
          ?.replace(/&#x27;/g, "'")
          ?.replace(/&quot;/g, '"')
          ?.replace(/&amp;/g, '&')
        || "I couldn't generate a response.";
              
        res.json({ message: aiMessage });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
};