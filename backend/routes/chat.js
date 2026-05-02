const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const fs = require("fs");
const path = require("path");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const CHAT_PROMPT = fs.readFileSync(
  path.join(__dirname, "../prompts/03_chat_agent_prompt.txt"),
  "utf-8"
);

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
      { role: "user", content: message },
    ];

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1000,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    const reply = response.choices[0].message.content;

    res.json({
      success: true,
      reply,
      history: [...messages, { role: "assistant", content: reply }],
    });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Chat failed" });
  }
});

module.exports = router;