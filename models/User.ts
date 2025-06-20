import mongoose, { Schema, Document, models } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number; // in cm
  weight?: number; // in kg
  goal?: string;   // e.g., "build muscle", "lose weight"
  calorieTarget?: number;
  createdAt: Date;
}

const UserSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  goal: { type: String,required: true },
  calorieTarget: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite during development
export const User = models.User || mongoose.model<IUser>('User', UserSchema);
