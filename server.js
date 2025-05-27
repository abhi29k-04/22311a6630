const express = require("express");
const dotenv = require("dotenv");
const {
  getStockPrices,
  calculateAverage,
  calculateCorrelation
} = require("./services/stockService");

dotenv.config();
const app = express();
const PORT = 3000;

// GET average stock price
app.get("/stocks/:ticker", async (req, res) => {
  const { ticker } = req.params;
  const { minutes, aggregation } = req.query;

  try {
    const prices = await getStockPrices(ticker, minutes);

    if (aggregation === "average") {
      const avg = calculateAverage(prices);
      res.json({ ticker, average: avg });
    } else {
      res.status(400).json({ error: "Unsupported aggregation type" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET correlation between two stocks
app.get("/stockcorrelation", async (req, res) => {
  const { minutes } = req.query;
  const tickers = req.query.ticker;

  if (!Array.isArray(tickers) || tickers.length !== 2) {
    return res.status(400).json({ error: "Provide exactly two ticker symbols" });
  }

  try {
    const [data1, data2] = await Promise.all([
      getStockPrices(tickers[0], minutes),
      getStockPrices(tickers[1], minutes)
    ]);

    const correlation = calculateCorrelation(data1, data2);
    res.json({ ticker1: tickers[0], ticker2: tickers[1], correlation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
