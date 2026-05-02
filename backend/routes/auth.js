const express = require("express");
const router = express.Router();
const admin = require("../config/firebase");
const authMiddleware = require("../middleware/authMiddleware");

const db = admin.firestore();

// ── POST /api/auth/verify ────────────────────────────────────────────────────
router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const { uid, email, name } = req.user;

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set({
        name: name || "",
        email: email || "",
        latestScore: null,
        scoreHistory: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    res.json({ success: true, user: { uid, email, name } });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ error: "Failed to verify user" });
  }
});

// ── POST /api/auth/save-score ────────────────────────────────────────────────
router.post("/save-score", authMiddleware, async (req, res) => {
  try {
    const { uid } = req.user;
    const { scoreData } = req.body;

    if (!scoreData) return res.status(400).json({ error: "No scoreData provided" });

    const userRef = db.collection("users").doc(uid);

    await userRef.set(
      {
        latestScore: scoreData,
        scoreHistory: admin.firestore.FieldValue.arrayUnion({
          ...scoreData,
          savedAt: new Date().toISOString(),
        }),
        lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    res.json({ success: true, message: "Score saved successfully" });
  } catch (err) {
    console.error("Save score error:", err);
    res.status(500).json({ error: "Failed to save score" });
  }
});

// ── GET /api/auth/get-score ──────────────────────────────────────────────────
router.get("/get-score", authMiddleware, async (req, res) => {
  try {
    const { uid } = req.user;

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

    const userData = userDoc.data();

    res.json({
      success: true,
      latestScore: userData.latestScore || null,
      scoreHistory: userData.scoreHistory || [],
      name: userData.name,
      email: userData.email,
    });
  } catch (err) {
    console.error("Get score error:", err);
    res.status(500).json({ error: "Failed to get score" });
  }
});

module.exports = router;