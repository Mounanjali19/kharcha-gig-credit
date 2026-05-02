const express = require("express");
const router = express.Router();

// POST /api/delete
// Clears any server-side session data for this user
// Since we process everything in memory, this is a confirmation endpoint
// that also signals the frontend to clear its local state

router.post("/", (req, res) => {
  try {
    // If you add any server-side caching later, clear it here
    // For now: all processing is in-memory, so nothing to delete on backend
    // This endpoint exists to:
    // 1. Give users a clear "delete" action they can see
    // 2. Future-proof for when Firebase storage is added

    console.log(`[Data Delete] User requested data deletion at ${new Date().toISOString()}`);

    res.json({
      success: true,
      message: "Your data has been cleared. No transaction data is stored on our servers.",
      deletedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Delete request failed" });
  }
});

module.exports = router;
