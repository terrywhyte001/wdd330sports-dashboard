import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  team1: String,
  team2: String,
  score: String,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Score", scoreSchema);
