import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  team: { type: String, required: true },
  opponent: { type: String, required: true },
  score: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Score", scoreSchema);
