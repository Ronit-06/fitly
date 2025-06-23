"use client"

import Link from "next/link";
import { ReactNode } from "react";
import '../styles/globals.css';
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";


export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    const pathname = usePathname();

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-content">
                    <div>
                        <p className="sidebar-text"><Link href="/dashboard" className="name">{session?.user?.name || "User"}</Link></p>
                        <p className="sidebar-text"><Link href="/dashboard" className="name-email">{session?.user?.email || "User"}</Link></p>
                    </div>
                    
                    <nav>
                        <ul className="nav-list">
                            <li><Link href="/dashboard" className={`nav-link ${pathname === "/dashboard" ? "active" : ""}`}>Dashboard</Link></li>
                            <li><Link href="/dashboard/food-logger" className={`nav-link ${pathname === "/dashboard/food-logger" ? "active" : ""}`}>Nutrition</Link></li>
                            <li><Link href="/dashboard/workout-logs" className={`nav-link ${pathname === "/dashboard/workout-logs" ? "active" : ""}`}>Workouts</Link></li>
                            <li><Link href="/dashboard/progress" className={`nav-link ${pathname === "/dashboard/progress" ? "active" : ""}`}>Progress</Link></li>
                            <li><Link href="/dashboard/settings" className={`nav-link ${pathname === "/dashboard/settings" ? "active" : ""}`}>Settings</Link></li>
                        </ul>
                    </nav>
                </div>
            </aside>

            {/* Page Content */}
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
