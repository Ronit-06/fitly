import mongoose, { Schema, models } from "mongoose";

const WorkoutSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    exercise: {
        type: String,
        required: true,
    },
    sets: {
        type: Number,
        required: true,
    },
    reps: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export const Workout = models.Workout || mongoose.model("Workout", WorkoutSchema);
