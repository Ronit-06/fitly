import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
  email: { type: String, required: true },
  date: { type: Date, required: true },
  weight: Number,
  neck: Number,
  waist: Number,
  hips: Number,
});

export default mongoose.models.Progress || mongoose.model("Progress", ProgressSchema);
