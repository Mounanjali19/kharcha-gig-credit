const express = require("express");
const router = express.Router();
const Anthropic = require("@anthropic-ai/sdk");
const fs = require("fs");
const path = require("path");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const REPORT_PROMPT = fs.readFileSync(
  path.join(__dirname, "../prompts/04_report_prompt.txt"),
  "utf-8"
);

// POST /api/report
// Body: { workerData, scoreData }
router.post("/", async (req, res) => {
  try {
    const { workerData, scoreData } = req.body;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `${REPORT_PROMPT}

Worker Data:
${JSON.stringify(workerData, null, 2)}

Score Data:
${JSON.stringify(scoreData, null, 2)}`,
        },
      ],
    });

    res.json({ success: true, reportText: message.content[0].text });
  } catch (err) {
    console.error("Report error:", err);
    res.status(500).json({ error: "Report generation failed" });
  }
});

module.exports = router;
