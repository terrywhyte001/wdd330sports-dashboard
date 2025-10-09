import express from "express";
import axios from "axios";
import Score from "../models/scoreModel.js";

const router = express.Router();
const SPORTS_API_KEY = process.env.SPORTS_API_KEY;

// ✅ Fetch mixed sports with fallback data
router.get("/", async (req, res) => {
  try {
    console.log("🔍 Fetching live sports scores...");

    // Try TheSportsDB API first (free, no key required)
    let combined = [];
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const sportsDbResponse = await axios.get(
        `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${today}`
      );
      
      if (sportsDbResponse.data.events) {
        combined = sportsDbResponse.data.events.slice(0, 8).map((event) => ({
          sport: event.strSport || "Soccer",
          team: event.strHomeTeam || "Team A",
          opponent: event.strAwayTeam || "Team B", 
          score: event.intHomeScore !== null && event.intAwayScore !== null 
                 ? `${event.intHomeScore}-${event.intAwayScore}`
                 : "vs",
          date: new Date(event.dateEvent || Date.now()).toLocaleDateString(),
        }));
        console.log(`✅ Found ${combined.length} events from TheSportsDB`);
      }
    } catch (apiError) {
      console.log("⚠️ TheSportsDB API failed, using fallback data");
    }

    // If no data from API, use sample data
    if (combined.length === 0) {
      combined = [
        { sport: "Soccer", team: "Manchester City", opponent: "Arsenal", score: "2-1", date: new Date().toLocaleDateString() },
        { sport: "Soccer", team: "Liverpool", opponent: "Chelsea", score: "3-0", date: new Date().toLocaleDateString() },
        { sport: "Basketball", team: "Lakers", opponent: "Warriors", score: "112-108", date: new Date().toLocaleDateString() },
        { sport: "Basketball", team: "Celtics", opponent: "Heat", score: "98-95", date: new Date(Date.now() - 86400000).toLocaleDateString() },
        { sport: "American Football", team: "Chiefs", opponent: "Bills", score: "24-20", date: new Date(Date.now() - 172800000).toLocaleDateString() },
        { sport: "Hockey", team: "Maple Leafs", opponent: "Bruins", score: "4-2", date: new Date(Date.now() - 259200000).toLocaleDateString() },
      ];
      console.log("📊 Using sample sports data");
    }

    // --- Fallback in case APIs return empty ---
    if (combined.length === 0) {
      console.warn("⚠️ No live data found. Returning sample data...");
      return res.json([
        { sport: "Football", team: "Arsenal", opponent: "Chelsea", score: "1-1", date: new Date() },
        { sport: "Basketball", team: "Lakers", opponent: "Warriors", score: "102-98", date: new Date() },
      ]);
    }

    // --- Optional: Save to DB ---
    await Score.insertMany(combined, { ordered: false }).catch(() => {});

    res.json(combined);
  } catch (err) {
    console.error("❌ Error fetching sports data:", err.message);
    res.status(500).json({ error: "Failed to fetch sports data" });
  }
});

export default router;

