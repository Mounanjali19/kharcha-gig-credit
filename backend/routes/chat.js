const express = require("express");
const router = express.Router();
const Anthropic = require("@anthropic-ai/sdk");
const fs = require("fs");
const path = require("path");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CHAT_PROMPT = fs.readFileSync(
  path.join(__dirname, "../prompts/03_chat_agent_prompt.txt"),
  "utf-8"
);

// POST /api/chat
// Body: { message, language, workerContext, history }
router.post("/", async (req, res) => {
  try {
    const { message, language = "English", workerContext, history = [] } = req.body;

    const systemPrompt = `${CHAT_PROMPT}

Current worker context:
- Name: ${workerContext?.name || "Worker"}
- Gig Credit Score: ${workerContext?.score || "Not yet calculated"}
- Score Tier: ${workerContext?.tier || "Unknown"}
- Average Monthly Income: ₹${workerContext?.avgIncome || "Unknown"}
- Platform: ${workerContext?.platform || "Swiggy/Ola"}
- Platform Rating: ${workerContext?.platformRating || "Not provided"}

IMPORTANT: Respond ONLY in ${language}. Keep responses simple, warm, and under 4 sentences.`;

    const messages = [
      ...history,
      { role: "user", content: message }
    ];

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    });

    res.json({
      success: true,
      reply: response.content[0].text,
      history: [...messages, { role: "assistant", content: response.content[0].text }],
    });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Chat failed" });
  }
});

module.exports = router;
