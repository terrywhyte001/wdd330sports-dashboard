import express from "express";
const router = express.Router();

// Placeholder sports scores route
router.get("/", (req, res) => {
  res.json({
    message: "Sample sports scores data (Week 5 placeholder)",
    data: [
      { team1: "Lakers", team2: "Warriors", score: "102-98" },
      { team1: "Arsenal", team2: "Chelsea", score: "1-1" }
    ]
  });
});

export default router;
