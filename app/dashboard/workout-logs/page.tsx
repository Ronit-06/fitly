"use client"

import { useState, useEffect } from "react"

export default function WorkoutLogs() {
    const [formData, setFormData] = useState({
        exercise: "",
        sets: "",
        reps: "",
        weight: "",
    })

    const [workouts, setWorkouts] = useState<any[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/workouts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                exercise: formData.exercise,
                sets: parseInt(formData.sets),
                reps: parseInt(formData.reps),
                weight: parseFloat(formData.weight),
            })
        })


        if (res.ok) {
            setFormData({ exercise: "", sets: "", reps: "", weight: "" })
            fetchWorkouts();
        }
    }

    const fetchWorkouts = async () =>{
        const res = await fetch("/api/workouts")
        const data = await res.json();
        setWorkouts(data);
        console.log(workouts)
    }

    useEffect(()=>{
        fetchWorkouts();
    }, [])
    
    
    return (
        <div>
            <h2>Log a Workout</h2>
            <form onSubmit={handleSubmit}>
                <input name="exercise" placeholder="Exercise" value={formData.exercise} onChange={handleChange} required />
                <input name="sets" placeholder="Sets" value={formData.sets} onChange={handleChange} required />
                <input name="reps" placeholder="Reps" value={formData.reps} onChange={handleChange} required />
                <input name="weight" placeholder="Weight" value={formData.weight} onChange={handleChange} required />
                <button type="submit">Add Workout</button>
            </form>

            <h3>Previous Workouts</h3>
            <ul>
                {workouts.map((workout: any) => (
                    <li key={workout._id}>
                        {workout.exercise} - {workout.set} sets - {workout.reps} reps - {workout.weight} kg
                    </li>
                ))}
            </ul>
        </div>
    )
}