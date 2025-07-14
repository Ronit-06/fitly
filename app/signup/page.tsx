"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import '../styles/globals.css';
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignupPage() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");

    { errorMessage && <p className="error-text">{errorMessage}</p> }

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        age: "",
        gender: "",
        height: "",
        weight: "",
        goal: "",
        calorieTarget: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("http://localhost:3000/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData), // include all fields
        });

        if (res.ok) {
            // Automatically sign in
            await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: true,
                callbackUrl: "/dashboard"
            });
        } else {
            const error = await res.json();
            setErrorMessage(error.message || "Failed to register.");
        }
    };

    return (
        <div className="signup-container">
            <h2 className="signup-title">Create an Account</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                <input type="number" name="height" placeholder="Height (cm)" value={formData.height} onChange={handleChange} required />
                <input type="number" name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} required />
                <input type="text" name="goal" placeholder="Your Goal" value={formData.goal} onChange={handleChange} required />
                <input type="number" name="calorieTarget" placeholder="Daily Calorie Target" value={formData.calorieTarget} onChange={handleChange} required />
                <button type="submit">Register</button>
                <p className="login-link">
                    Already have an account? <Link href="/login">Login in here</Link>
                </p>
            </form>
        </div>
    );
}
