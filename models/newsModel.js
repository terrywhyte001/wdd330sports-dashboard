import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  title: String,
  source: String,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("News", newsSchema);
