"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading" || status === "unauthenticated") {
        return <p className="dashboard-loading">Loading...</p>;
    }

    return (
        <main className="dashboard-container">
            <section className="dashboard-links">
                <h2 className="dashboard-section-title">Your Fitness Tools</h2>
                <div className="dashboard-card-grid">
                    <Link href="/dashboard/workout-logs" className="dashboard-card">
                        <h3>Workout Logger</h3>
                        <p>Track your daily workouts and exercises.</p>
                    </Link>
                    <Link href="/dashboard/food-logger" className="dashboard-card">
                        <h3>Food Logger</h3>
                        <p>Log your meals and monitor nutrition intake.</p>
                    </Link>
                    <Link href="/dashboard/progress" className="dashboard-card">
                        <h3>Progress</h3>
                        <p>View body measurements and progress charts.</p>
                    </Link>
                </div>
            </section>
        </main>
    );
}
