import mongoose from "mongoose";

const NutritionLogSchema = new mongoose.Schema({
  description: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  servingSize: Number,
  servingUnit: String,
  date: { type: Date, default: Date.now },
});

export const NutritionLog = mongoose.models.NutritionLog || mongoose.model("NutritionLog", NutritionLogSchema);
