import express from "express";
const router = express.Router();

// Placeholder sports news route
router.get("/", (req, res) => {
  res.json({
    message: "Sample sports news data (Week 5 placeholder)",
    data: [
      { title: "LeBron leads Lakers to victory", source: "ESPN" },
      { title: "Arsenal secure draw with Chelsea", source: "BBC Sport" }
    ]
  });
});

export default router;
