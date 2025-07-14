"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import '../styles/globals.css';
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSumbit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await signIn("credentials", {
            email,
            password,
            redirect: true,
            callbackUrl: "/dashboard"
        });
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Login</h1>
            <form onSubmit={handleSumbit} className="login-form">
                <label htmlFor="email" className="login-label">Email</label>
                <input
                    id="email"
                    type="email"
                    className="login-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password" className="login-label">Password</label>
                <input
                    id="password"
                    type="password"
                    className="login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className="login-button">Sign In</button>
                <p className="login-link">
                    Don’t have an account? <Link href="/signup">Sign up here</Link>
                </p>
            </form>
        </div>
    );
}
