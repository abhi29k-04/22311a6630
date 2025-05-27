const axios = require("axios");
require("dotenv").config();

const API_BASE = process.env.API_BASE_URL;
const TOKEN = process.env.API_TOKEN;

async function getStockPrices(ticker, minutes) {
  const url = `${API_BASE}/${ticker}?minutes=${minutes}`;
  const headers = {
    Authorization: TOKEN,
  };

  const response = await axios.get(url, { headers });
  return response.data;
}

function calculateAverage(prices) {
  const sum = prices.reduce((acc, p) => acc + p.price, 0);
  return sum / prices.length;
}

function calculateCorrelation(prices1, prices2) {
  const n = Math.min(prices1.length, prices2.length);
  const x = prices1.slice(0, n).map(p => p.price);
  const y = prices2.slice(0, n).map(p => p.price);

  const avgX = x.reduce((a, b) => a + b, 0) / n;
  const avgY = y.reduce((a, b) => a + b, 0) / n;

  const numerator = x.reduce((sum, xi, i) => sum + (xi - avgX) * (y[i] - avgY), 0);
  const denominator = Math.sqrt(
    x.reduce((sum, xi) => sum + (xi - avgX) ** 2, 0) *
    y.reduce((sum, yi) => sum + (yi - avgY) ** 2, 0)
  );

  return denominator === 0 ? 0 : numerator / denominator;
}

module.exports = { getStockPrices, calculateAverage, calculateCorrelation };
