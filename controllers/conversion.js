module.exports.index = (req, res) => {
    res.render("conversion/index", {
      preferredCurrency: "USD"
    });
  };
  