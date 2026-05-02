const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const fs = require("fs");
const path = require("path");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const PARSER_PROMPT = fs.readFileSync(
  path.join(__dirname, "../prompts/01_upi_parser_prompt.txt"),
  "utf-8"
);

// POST /api/parse
router.post("/", async (req, res) => {
  try {
    const { csvData } = req.body;
    if (!csvData) return res.status(400).json({ error: "No CSV data provided" });

    // Only send first 90 rows to stay within token limit
    const trimmedCsv = csvData.split('\n').slice(0, 90).join('\n');

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `${PARSER_PROMPT}\n\nHere is the UPI transaction CSV data:\n${trimmedCsv}`,
        },
      ],
    });

    const raw = response.choices[0].message.content;
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    res.json({ success: true, data: parsed });
  } catch (err) {
    console.error("Parse error:", err);
    res.status(500).json({ error: "Failed to parse UPI data" });
  }
});

module.exports = router;