const conversion = require("../services/conversion");

module.exports.index = (req, res) => {
  res.render("conversion/index", {
    preferredCurrency: "USD"
  });
};

module.exports.convert = async (req, res) => {
  const { amount, fromCurrency, toCurrency } = req.body;

  if (!amount || !fromCurrency || !toCurrency) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const rate = await conversion(fromCurrency, toCurrency);

    const convertedAmount = (Number(amount) * rate).toFixed(2);

    res.json({
      rate,
      convertedAmount
    });
  } catch (err) {
    res.status(500).json({ error: "Currency conversion failed" });
  }
};
