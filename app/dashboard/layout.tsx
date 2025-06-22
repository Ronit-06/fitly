import Link from "next/link";
import { ReactNode } from "react";
import '../styles/globals.css';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <nav>
                    <ul className="nav-list">
                        <li><Link href="/dashboard" className="nav-link">Dashboard</Link></li>
                        <li><Link href="/dashboard/food-looger" className="nav-link">Food Logger</Link></li>
                        <li><Link href="/dashboard/workout-logs" className="nav-link">Workout Logs</Link></li>
                    </ul>
                </nav>
            </aside>

            {/* Page Content */}
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
