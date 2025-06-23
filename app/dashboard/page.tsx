"use client";

import { useSession, signOut } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Dashboardpage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    if (status === "loading" || status === "unauthenticated") {
        return <p>loading...</p>;
    }

    return (
        <main style={{ padding: "2rem" }}>
            <h1>Welcome, {session?.user?.name || session?.user?.email}!</h1>
            <button onClick={()=> signOut({callbackUrl: "/login"})} className="logout-btn">Logout</button>
        </main>
    )
}