import mongoose from "mongoose";

const NutritionLogSchema = new mongoose.Schema({
  description: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  servingSize: Number,
  servingUnit: String,
  date: String,
  userEmail: String, 
});

export const NutritionLog = mongoose.models.NutritionLog || mongoose.model("NutritionLog", NutritionLogSchema);
