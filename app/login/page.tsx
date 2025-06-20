"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function login() {


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
        <>
            <h1>Login Page</h1>
            <form onSubmit={handleSumbit}>
                <label htmlFor="email"> Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required></input>
                <label htmlFor="password">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required></input>
                <button type="submit">Submit</button>
            </form>
        </>
    )
}

