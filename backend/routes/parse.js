const express = require("express");
const router = express.Router();
const Anthropic = require("@anthropic-ai/sdk");
const fs = require("fs");
const path = require("path");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Load the parser prompt
const PARSER_PROMPT = fs.readFileSync(
  path.join(__dirname, "../prompts/01_upi_parser_prompt.txt"),
  "utf-8"
);

// POST /api/parse
// Body: { csvData: "raw CSV string" }
router.post("/", async (req, res) => {
  try {
    const { csvData } = req.body;
    if (!csvData) return res.status(400).json({ error: "No CSV data provided" });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `${PARSER_PROMPT}\n\nHere is the UPI transaction CSV data:\n${csvData}`,
        },
      ],
    });

    const raw = message.content[0].text;
    // Strip markdown code fences if present
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    res.json({ success: true, data: parsed });
  } catch (err) {
    console.error("Parse error:", err);
    res.status(500).json({ error: "Failed to parse UPI data" });
  }
});

module.exports = router;
