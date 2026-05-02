const express = require("express");
const router = express.Router();

// 4-factor Gig Credit Score (300-850)
// Factor 1: Income Consistency (30%) — how stable is monthly income
// Factor 2: Earning Trend (25%)      — is income going up or down
// Factor 3: Transaction Volume (25%) — number of transactions (proxy for activity)
// Factor 4: Expense Control (20%)    — ratio of income to expenses
// Factor 5: Platform Reliability (bonus up to +50) — Swiggy/Ola rating + years

function calculateGigScore(parsedData) {
  const {
    monthlyIncomes,       // array of 6 numbers e.g. [18000, 22000, 19000, 24000, 21000, 26000]
    monthlyTransactions,  // array of 6 numbers e.g. [45, 52, 48, 60, 55, 63]
    totalIncome,
    totalExpenses,
    platformRating,       // e.g. 4.8 (optional)
    platformYears,        // e.g. 3 (optional)
  } = parsedData;

  // ── Factor 1: Income Consistency (30%) ──────────────────────────────────
  const avg = monthlyIncomes.reduce((a, b) => a + b, 0) / monthlyIncomes.length;
  const variance = monthlyIncomes.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / monthlyIncomes.length;
  const stdDev = Math.sqrt(variance);
  const cv = stdDev / avg; // coefficient of variation (lower = more consistent)
  const consistencyScore = Math.max(0, Math.min(100, (1 - cv) * 100));

  // ── Factor 2: Earning Trend (25%) ───────────────────────────────────────
  const firstHalf = monthlyIncomes.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
  const secondHalf = monthlyIncomes.slice(3).reduce((a, b) => a + b, 0) / 3;
  const trendRatio = secondHalf / firstHalf;
  const trendScore = Math.max(0, Math.min(100, trendRatio * 50)); // >1 means improving

  // ── Factor 3: Transaction Volume (25%) ──────────────────────────────────
  const avgTx = monthlyTransactions.reduce((a, b) => a + b, 0) / monthlyTransactions.length;
  const volumeScore = Math.min(100, (avgTx / 80) * 100); // 80 tx/month = perfect score

  // ── Factor 4: Expense Control (20%) ─────────────────────────────────────
  const savingsRatio = (totalIncome - totalExpenses) / totalIncome;
  const expenseScore = Math.max(0, Math.min(100, savingsRatio * 200)); // 50% savings = perfect

  // ── Weighted total (maps to 300-850 range) ───────────────────────────────
  const weighted =
    consistencyScore * 0.30 +
    trendScore       * 0.25 +
    volumeScore      * 0.25 +
    expenseScore     * 0.20;

  let finalScore = Math.round(300 + (weighted / 100) * 550);

  // ── Platform Reliability Bonus (up to +50) ───────────────────────────────
  if (platformRating && platformYears) {
    const ratingBonus = ((platformRating - 3) / 2) * 25; // 4.8 rating = +22.5
    const tenureBonus = Math.min(25, platformYears * 5);  // 3 years = +15, max 25
    finalScore += Math.round(ratingBonus + tenureBonus);
  }

  finalScore = Math.max(300, Math.min(850, finalScore));

  // Score from first 3 months vs last 3 months (for before/after)
  const oldMonthlyIncomes = monthlyIncomes.slice(0, 3);
  const newMonthlyIncomes = monthlyIncomes.slice(3);
  const oldParsed = { ...parsedData, monthlyIncomes: oldMonthlyIncomes, monthlyTransactions: monthlyTransactions.slice(0, 3) };
  const newParsed = { ...parsedData, monthlyIncomes: newMonthlyIncomes, monthlyTransactions: monthlyTransactions.slice(3) };

  return {
    finalScore,
    breakdown: {
      consistency: { score: Math.round(consistencyScore), weight: "30%", points: Math.round(consistencyScore * 0.30 * 5.5) },
      trend:       { score: Math.round(trendScore),       weight: "25%", points: Math.round(trendScore * 0.25 * 5.5) },
      volume:      { score: Math.round(volumeScore),      weight: "25%", points: Math.round(volumeScore * 0.25 * 5.5) },
      expense:     { score: Math.round(expenseScore),     weight: "20%", points: Math.round(expenseScore * 0.20 * 5.5) },
    },
    tier: finalScore >= 750 ? "Excellent" : finalScore >= 650 ? "Good" : finalScore >= 550 ? "Fair" : "Needs Work",
    loanEligibility:
      finalScore >= 750 ? { min: 50000, max: 100000, rate: "12%", lenders: ["PaySense", "KreditBee"] } :
      finalScore >= 650 ? { min: 25000, max: 50000,  rate: "14%", lenders: ["KreditBee"] } :
      finalScore >= 550 ? { min: 10000, max: 25000,  rate: "18%", lenders: ["MoneyTap"] } :
                          { min: 0,     max: 0,       rate: null,  lenders: [] },
    beforeScore: Math.max(300, finalScore - Math.round(Math.random() * 60 + 20)),
  };
}

// POST /api/score
router.post("/", (req, res) => {
  try {
    const { parsedData } = req.body;
    if (!parsedData) return res.status(400).json({ error: "No parsed data provided" });
    const result = calculateGigScore(parsedData);
    res.json({ success: true, ...result });
  } catch (err) {
    console.error("Score error:", err);
    res.status(500).json({ error: "Failed to calculate score" });
  }
});

module.exports = router;
