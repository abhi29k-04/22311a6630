function calculateCorrelation(prices1, prices2) {
  if (prices1.length !== prices2.length) return null;

  const n = prices1.length;
  const avg1 = prices1.reduce((a, b) => a + b, 0) / n;
  const avg2 = prices2.reduce((a, b) => a + b, 0) / n;

  let numerator = 0, denom1 = 0, denom2 = 0;

  for (let i = 0; i < n; i++) {
    const diff1 = prices1[i] - avg1;
    const diff2 = prices2[i] - avg2;
    numerator += diff1 * diff2;
    denom1 += diff1 ** 2;
    denom2 += diff2 ** 2;
  }

  const denominator = Math.sqrt(denom1) * Math.sqrt(denom2);
  return denominator === 0 ? 0 : (numerator / denominator).toFixed(4);
}

module.exports = { calculateCorrelation };
