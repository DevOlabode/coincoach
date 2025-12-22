const Groq = require("groq-sdk");

const transactionInsight = async (transactions) => {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const prompt = `
You are a financial analytics engine.  
You will receive a list of user transactions in JSON format.  
Each transaction includes:  
- name  
- type ("income" or "expense")  
- amount  
- currency  
- date  
- category  
- description  
- recurring (boolean)  
- recurrence (optional)  
- inputMethod  

Your task is to analyze ALL transactions and return a structured JSON object containing financial insights.

### REQUIRED OUTPUT FORMAT (JSON ONLY):

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
  ]
}

### RULES:
- Only return JSON. No explanations.
- All numbers must be numeric, not strings.
- Dates must remain in ISO format.
- Ignore transactions with invalid or missing amounts or dates.
- Group monthly averages by calendar month.
- “Large transactions” = top 5 highest‑value transactions in the last 90 days.
- If a section has no data, return an empty array or null values.
- Do not invent data; only compute from the provided transactions.

### transactions:
${JSON.stringify(transactions)}
`;

  try {
    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768", // Groq's best structured-output model
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0, // deterministic output
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