import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import scoresRoutes from "./routes/scoresRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";

// --- Load Environment Variables ---
dotenv.config();

// --- Express App Setup ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- Path setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// --- Debug: Check env keys ---
console.log("🔑 SPORTS_API_KEY:", process.env.SPORTS_API_KEY ? "✅ Loaded" : "❌ Missing");
console.log("📰 NEWS_API_KEY:", process.env.NEWS_API_KEY ? "✅ Loaded" : "❌ Missing");

// --- MongoDB Connection ---
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/sportsdashboard";

async function startServer() {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(MONGO_URI);
      console.log("✅ Connected to MongoDB");
    } else {
      console.log("⚠️ No MongoDB URI found, running without database");
    }

    // --- API Routes ---
    app.use("/api/scores", scoresRoutes);
    app.use("/api/news", newsRoutes);

    // --- Default Route (Frontend) ---
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "public", "index.html"));
    });

    // --- Start Server ---
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📊 Sports Dashboard by Evbosaru Iyen Samuel`);
    });
  } catch (err) {
    console.error("❌ Server startup error:", err.message);
    process.exit(1);
  }
}

startServer();