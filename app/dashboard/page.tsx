"use client";

import { useSession } from "next-auth/react"
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

    if (status === "loading") {
        return <p>loading...</p>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {session?.user?.name || session?.user?.email}</p>
        </div>
    )
}