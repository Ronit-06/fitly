"use client"

import { useState, useEffect } from "react"

export default function WorkoutLogs() {

    type Workout = {
        _id: string;
        exercise: string;
        sets: number;
        reps: number;
        weight: number;
        date: string;
    };

    const [formData, setFormData] = useState({
        exercise: "",
        sets: "",
        reps: "",
        weight: "",
        date: ""
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);


    const [workouts, setWorkouts] = useState<Workout[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const method = isEditing ? "PUT" : "POST";
        const url = isEditing ? "/api/workouts" : "/api/workouts";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: editId,
                exercise: formData.exercise,
                sets: parseInt(formData.sets),
                reps: parseInt(formData.reps),
                weight: parseFloat(formData.weight),
                date: formData.date,
            }),
        });

        if (res.ok) {
            setFormData({ exercise: "", sets: "", reps: "", weight: "", date: "" });
            setIsEditing(false);
            setEditId(null);
            fetchWorkouts();
        }
    };


    const fetchWorkouts = async () => {
        const res = await fetch("/api/workouts");
        const data = await res.json();
        setWorkouts(data);
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const groupedWorkouts = workouts.reduce((acc: Record<string, Workout[]>, workout) => {
        const date = new Date(workout.date).toLocaleDateString();
        acc[date] = acc[date] || [];
        acc[date].push(workout);
        return acc;
    }, {});


    const handleEdit = (workout: Workout) => {
        setFormData({
            exercise: workout.exercise,
            sets: workout.sets.toString(),
            reps: workout.reps.toString(),
            weight: workout.weight.toString(),
            date: workout.date.split("T")[0],
        });
        setEditId(workout._id);
        setIsEditing(true);
    };


    const handleDelete = async (id: string) => {
        const res = await fetch("/api/workouts", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });

        if (res.ok) {
            fetchWorkouts();
        }
    };

    return (
        <div>
            <h2>Log a Workout</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
                <input name="exercise" placeholder="Exercise" value={formData.exercise} onChange={handleChange} required />
                <input name="sets" placeholder="Sets" value={formData.sets} onChange={handleChange} required />
                <input name="reps" placeholder="Reps" value={formData.reps} onChange={handleChange} required />
                <input name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} required />
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                <button type="submit">Add Workout</button>
            </form>

            <h3>Previous Workouts</h3>
            {Object.entries(groupedWorkouts).map(([date, dayWorkouts]) => (
                <div key={date}>
                    <h4>{date}</h4>
                    {dayWorkouts.map((workout) => (
                        <div key={workout._id}>
                            <p>{workout.exercise} — {workout.sets} sets × {workout.reps} reps @ {workout.weight}kg</p>
                            <button onClick={() => handleEdit(workout)}>Edit</button>
                            <button onClick={() => handleDelete(workout._id)}>Delete</button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
