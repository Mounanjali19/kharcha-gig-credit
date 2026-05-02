const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const fs = require("fs");
const path = require("path");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const REPORT_PROMPT = fs.readFileSync(
  path.join(__dirname, "../prompts/04_report_prompt.txt"),
  "utf-8"
);

router.post("/", async (req, res) => {
  try {
    const { workerData, scoreData } = req.body;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
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

    res.json({ success: true, reportText: response.choices[0].message.content });
  } catch (err) {
    console.error("Report error:", err);
    res.status(500).json({ error: "Report generation failed" });
  }
});

module.exports = router;