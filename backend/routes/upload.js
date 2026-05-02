const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const multer = require("multer");

// Store in memory only — never written to disk or DB
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed"));
  },
});

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST /api/upload
// Body: multipart/form-data with field "screenshot"
router.post("/", upload.single("screenshot"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const base64Image = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;

    const response = await client.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
            {
              type: "text",
              text: `You are a financial data extractor. This is a screenshot of UPI transaction history from a gig worker's phone (Swiggy/Ola/Urban Company payments).

Extract all visible transactions and return ONLY a valid JSON object with NO markdown, NO backticks, NO explanation:

{
  "platform": "Swiggy/Ola/Urban Company/Mixed",
  "monthlyIncomes": [numbers for each month visible],
  "monthlyTransactions": [count per month],
  "monthlyExpenses": [expenses per month],
  "totalIncome": number,
  "totalExpenses": number,
  "avgMonthlyIncome": number,
  "expenseCategories": {
    "Food": number,
    "Fuel": number,
    "Rent": number,
    "Savings": number,
    "Entertainment": number,
    "Other": number
  },
  "topIncomeSource": "string",
  "dataMonths": ["Mon YYYY", ...]
}

If you cannot read the image clearly, return your best estimate based on what is visible.`,
            },
          ],
        },
      ],
    });

    // Image buffer is garbage collected after this — never stored
    const raw = response.choices[0].message.content;
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    res.json({ success: true, data: parsed, source: "screenshot" });
  } catch (err) {
    console.error("Upload/vision error:", err);
    res.status(500).json({ error: "Failed to process screenshot" });
  }
});

module.exports = router;
