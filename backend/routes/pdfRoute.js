const express = require("express");
const router  = express.Router();
const puppeteer = require("puppeteer");
const path    = require("path");
const fs      = require("fs");

// Make sure reports directory exists
const REPORTS_DIR = path.join(__dirname, "../reports");
if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR);

// ── HTML template for the PDF ─────────────────────────────────────────────────
function buildHTML(data) {
  const {
    workerName, platform, score, tier, tierColor,
    avgIncome, transactions, incomeVariance, topPayer,
    factors, tips, loan, months, incomes,
    beforeScore, reportDate,
  } = data;

  // Build factor rows
  const factorRows = factors.map(f => `
    <div class="factor-row">
      <span class="factor-label">${f.label}</span>
      <div class="factor-bar-bg">
        <div class="factor-bar-fill" style="width:${f.value}%; background:${tierColor}"></div>
      </div>
      <span class="factor-value">${f.value}%</span>
      <span class="factor-weight">${f.weight}%</span>
    </div>
  `).join("")

  // Build income chart bars
  const maxIncome  = Math.max(...incomes)
  const chartBars  = months.map((m, i) => {
    const h = Math.round((incomes[i] / maxIncome) * 80)
    const isLast = i === months.length - 1
    return `
      <div class="chart-col">
        <div class="chart-bar" style="height:${h}px; background:${isLast ? tierColor : tierColor + '55'}"></div>
        <div class="chart-label">${m}</div>
      </div>
    `
  }).join("")

  // Build tips
  const tipItems = tips.map(t => `
    <div class="tip-item">
      <span class="tip-icon">${t.icon}</span>
      <div>
        <strong>${t.title}</strong>
        <p>${t.body}</p>
      </div>
    </div>
  `).join("")

  const delta = score - beforeScore

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Sora', sans-serif;
    background: #FFFBF7;
    color: #1A1410;
    padding: 40px;
    width: 800px;
  }

  /* HEADER */
  .header {
    background: #1A1410;
    border-radius: 16px;
    padding: 28px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  .logo { font-size: 28px; font-weight: 800; color: #F97316; letter-spacing: -1px; }
  .logo span { color: rgba(255,255,255,0.4); }
  .header-right { text-align: right; }
  .header-right .report-title { font-size: 11px; color: rgba(255,255,255,0.4); letter-spacing: 2px; text-transform: uppercase; }
  .header-right .report-date  { font-size: 13px; color: white; font-weight: 600; margin-top: 4px; }

  /* WORKER INFO */
  .worker-card {
    background: white;
    border: 1px solid rgba(249,115,22,0.15);
    border-radius: 14px;
    padding: 20px 24px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .avatar {
    width: 52px; height: 52px; border-radius: 50%;
    background: linear-gradient(135deg,#F97316,#FBB040);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; font-weight: 800; color: white; flex-shrink: 0;
  }
  .worker-name  { font-size: 18px; font-weight: 700; }
  .worker-sub   { font-size: 12px; color: #8C7B6B; margin-top: 3px; }

  /* TWO COLUMNS */
  .two-col { display: flex; gap: 20px; margin-bottom: 20px; }
  .col-left  { width: 220px; flex-shrink: 0; }
  .col-right { flex: 1; }

  /* SCORE CARD */
  .score-card {
    background: #1A1410;
    border-radius: 14px;
    padding: 24px 20px;
    text-align: center;
    height: 100%;
  }
  .score-label { font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 10px; }
  .score-number { font-size: 52px; font-weight: 800; color: white; letter-spacing: -3px; line-height: 1; }
  .score-denom  { font-size: 16px; font-weight: 400; color: rgba(255,255,255,0.3); }
  .score-tier   { display: inline-block; margin-top: 12px; font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 99px; }

  /* FACTOR BREAKDOWN */
  .card {
    background: white;
    border: 1px solid rgba(249,115,22,0.15);
    border-radius: 14px;
    padding: 18px 20px;
  }
  .card-title { font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #8C7B6B; margin-bottom: 14px; }

  .factor-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .factor-label { font-size: 11px; color: #3D2E22; width: 130px; flex-shrink: 0; }
  .factor-bar-bg { flex: 1; height: 5px; background: #F5EDE4; border-radius: 3px; overflow: hidden; }
  .factor-bar-fill { height: 100%; border-radius: 3px; }
  .factor-value { font-size: 11px; font-weight: 700; width: 32px; text-align: right; }
  .factor-weight { font-size: 10px; color: #8C7B6B; width: 26px; text-align: right; }

  /* STATS ROW */
  .stats-row { display: flex; gap: 12px; margin-bottom: 20px; }
  .stat-card {
    flex: 1;
    background: white;
    border: 1px solid rgba(249,115,22,0.15);
    border-radius: 12px;
    padding: 14px 16px;
  }
  .stat-label { font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #8C7B6B; margin-bottom: 5px; }
  .stat-value { font-size: 20px; font-weight: 800; color: #1A1410; letter-spacing: -0.5px; }
  .stat-delta { font-size: 10px; font-weight: 600; margin-top: 3px; }

  /* CHART */
  .chart-wrap { display: flex; align-items: flex-end; gap: 8px; height: 100px; padding-bottom: 20px; position: relative; }
  .chart-col { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
  .chart-bar { width: 100%; border-radius: 4px 4px 0 0; min-height: 4px; }
  .chart-label { font-size: 10px; color: #8C7B6B; }

  /* LOAN BANNER */
  .loan-banner {
    background: #1A1410;
    border-radius: 14px;
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .loan-label  { font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 6px; }
  .loan-amount { font-size: 26px; font-weight: 800; color: white; letter-spacing: -1px; }
  .loan-rate   { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 2px; }
  .lender-badges { display: flex; gap: 8px; }
  .lender-badge { background: rgba(249,115,22,0.13); border: 1px solid rgba(249,115,22,0.32); color: #F97316; font-size: 11px; font-weight: 700; padding: 5px 14px; border-radius: 99px; }

  /* BEFORE / AFTER */
  .journey { display: flex; align-items: center; gap: 16px; margin-top: 14px; }
  .journey-box { flex: 1; border-radius: 10px; padding: 14px 16px; text-align: center; }
  .journey-label  { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #8C7B6B; margin-bottom: 5px; }
  .journey-score  { font-size: 30px; font-weight: 800; letter-spacing: -1px; }
  .journey-arrow  { font-size: 22px; color: #16A34A; font-weight: 700; flex-shrink: 0; }
  .journey-delta  { text-align: center; margin-top: 10px; }
  .delta-badge    { display: inline-block; background: #DCFCE7; color: #16A34A; font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 99px; }

  /* TIPS */
  .tip-item { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px solid #FEF0E0; }
  .tip-item:last-child { border-bottom: none; }
  .tip-icon { font-size: 18px; flex-shrink: 0; width: 28px; }
  .tip-item strong { display: block; font-size: 12px; font-weight: 700; margin-bottom: 2px; }
  .tip-item p { font-size: 11px; color: #3D2E22; line-height: 1.5; }

  /* FOOTER */
  .footer { margin-top: 28px; text-align: center; padding-top: 16px; border-top: 1px solid rgba(249,115,22,0.1); }
  .footer p { font-size: 10px; color: #8C7B6B; line-height: 1.8; }
</style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div class="logo">Kharcha<span>.</span></div>
    <div class="header-right">
      <div class="report-title">Financial Health Report</div>
      <div class="report-date">${reportDate}</div>
    </div>
  </div>

  <!-- WORKER INFO -->
  <div class="worker-card">
    <div class="avatar">${workerName.charAt(0)}</div>
    <div>
      <div class="worker-name">${workerName}</div>
      <div class="worker-sub">${platform} · Report generated by Kharcha · Vibe-a-thon 2026</div>
    </div>
  </div>

  <!-- SCORE + FACTORS -->
  <div class="two-col">
    <div class="col-left">
      <div class="score-card">
        <div class="score-label">Kharcha Credit Score</div>
        <div>
          <span class="score-number">${score}</span>
          <span class="score-denom">/850</span>
        </div>
        <div class="score-tier" style="background:${tierColor}22; color:${tierColor}; border:1px solid ${tierColor}55">
          ${tier}
        </div>
      </div>
    </div>
    <div class="col-right">
      <div class="card" style="height:100%">
        <div class="card-title">Score Breakdown</div>
        ${factorRows}
        <div style="margin-top:12px; padding-top:10px; border-top:1px solid #FEF0E0; font-size:10px; color:#8C7B6B; line-height:1.6">
          Data source: UPI transaction history · No salary slip needed
        </div>
      </div>
    </div>
  </div>

  <!-- STATS -->
  <div class="stats-row">
    <div class="stat-card">
      <div class="stat-label">Avg Monthly Income</div>
      <div class="stat-value">${avgIncome}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Transactions / Month</div>
      <div class="stat-value">${transactions}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Top Payer</div>
      <div class="stat-value" style="font-size:15px; padding-top:3px">${topPayer}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Income Variance</div>
      <div class="stat-value" style="font-size:18px">${incomeVariance}</div>
    </div>
  </div>

  <!-- CHART + TIPS -->
  <div class="two-col">
    <div class="col-right">
      <div class="card">
        <div class="card-title">Monthly Income (₹)</div>
        <div class="chart-wrap">${chartBars}</div>
      </div>
    </div>
    <div class="col-right">
      <div class="card">
        <div class="card-title">AI Financial Tips</div>
        ${tipItems}
      </div>
    </div>
  </div>

  <!-- LOAN BANNER -->
  <div class="loan-banner" style="margin-top:20px">
    <div>
      <div class="loan-label">Loan Eligibility Estimate</div>
      <div class="loan-amount">${loan.range}</div>
      <div class="loan-rate">${loan.rate} · ${loan.type} · ${loan.tenure}</div>
    </div>
    <div class="lender-badges">
      ${loan.lenders.map(l => `<span class="lender-badge">${l}</span>`).join("")}
    </div>
  </div>

  <!-- BEFORE / AFTER -->
  <div class="card" style="margin-top:20px">
    <div class="card-title">Score Journey — 6 Months</div>
    <div class="journey">
      <div class="journey-box" style="background:#F9F5F2">
        <div class="journey-label">6 Months Ago</div>
        <div class="journey-score" style="color:#8C7B6B">${beforeScore}</div>
      </div>
      <div class="journey-arrow">→</div>
      <div class="journey-box" style="background:#FEF3E2">
        <div class="journey-label">Today</div>
        <div class="journey-score" style="color:${tierColor}">${score}</div>
      </div>
    </div>
    <div class="journey-delta">
      <span class="delta-badge">↑ Improved ${delta} points in 6 months</span>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <p>
      This report was generated by Kharcha · AI-powered Gig Credit Scoring · Vibe-a-thon 2026 · NMIT<br>
      For lender use only · Score based on UPI transaction history · Not a CIBIL report
    </p>
  </div>

</body>
</html>`
}

// ── POST /api/pdf/generate ────────────────────────────────────────────────────
router.post("/generate", async (req, res) => {
  try {
    const { workerData, scoreData } = req.body;

    if (!workerData || !scoreData) {
      return res.status(400).json({ error: "workerData and scoreData are required" });
    }

    // Build data object for the HTML template
    const data = {
      workerName:    workerData.name      || "Gig Worker",
      platform:      workerData.platform  || "Gig Platform",
      score:         scoreData.finalScore,
      tier:          scoreData.tier,
      tierColor:     getTierColor(scoreData.tier),
      avgIncome:     workerData.avgIncome || "N/A",
      transactions:  workerData.transactions || "N/A",
      incomeVariance: workerData.incomeVariance || "N/A",
      topPayer:      workerData.topPayer  || "N/A",
      factors:       scoreData.factors    || [],
      tips:          workerData.tips      || [],
      loan:          buildLoanData(scoreData.finalScore),
      months:        workerData.months    || [],
      incomes:       workerData.incomes   || [],
      beforeScore:   scoreData.beforeScore || scoreData.finalScore - 50,
      reportDate:    new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
    };

    const html = buildHTML(data);

    // Launch puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate unique filename
    const filename  = `kharcha-report-${Date.now()}.pdf`;
    const filepath  = path.join(REPORTS_DIR, filename);

    await page.pdf({
      path: filepath,
      width: "800px",
      printBackground: true,
      margin: { top: "0px", bottom: "0px", left: "0px", right: "0px" },
    });

    await browser.close();

    res.json({
      success: true,
      filename,
      downloadUrl: `/api/pdf/download/${filename}`,
    });

  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

// ── GET /api/pdf/download/:filename ──────────────────────────────────────────
router.get("/download/:filename", (req, res) => {
  const { filename } = req.params;

  // Basic security — no path traversal
  if (filename.includes("..") || filename.includes("/")) {
    return res.status(400).json({ error: "Invalid filename" });
  }

  const filepath = path.join(REPORTS_DIR, filename);

  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: "Report not found" });
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="Kharcha-Report.pdf"`);
  res.sendFile(filepath);
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function getTierColor(tier) {
  if (!tier) return "#F97316";
  const t = tier.toLowerCase();
  if (t.includes("excellent") || t.includes("very good")) return "#16A34A";
  if (t.includes("good"))   return "#F97316";
  if (t.includes("fair"))   return "#D97706";
  return "#DC2626";
}

function buildLoanData(score) {
  if (score >= 750) return { range: "₹50,000 – ₹1,00,000", rate: "Est. 12% interest", type: "Microloan", tenure: "18–36 months", lenders: ["KreditBee", "PaySense"] };
  if (score >= 650) return { range: "₹25,000 – ₹50,000",   rate: "Est. 14% interest", type: "Microloan", tenure: "12–24 months", lenders: ["KreditBee"] };
  if (score >= 550) return { range: "₹10,000 – ₹25,000",   rate: "Est. 18% interest", type: "Microloan", tenure: "6–12 months",  lenders: ["MoneyTap"] };
  return { range: "Not eligible yet", rate: "Improve your score", type: "—", tenure: "—", lenders: [] };
}

module.exports = router;
