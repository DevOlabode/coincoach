const conversion = async (from, to) => {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.error || "Failed to fetch conversion rate");
        }

        return data.conversion_rate; // number
    } catch (error) {
        console.error("Conversion error:", error.message);
        return null;
    }
};

module.exports = conversion