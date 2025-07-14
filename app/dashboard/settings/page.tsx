"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

interface UserInfo {
    email: string;
    name?: string;
    age?: number;
    gender?: string;
    height?: number;
}

export default function SettingsPage() {
    const { data: session } = useSession();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    const fetchUserInfo = async () => {
        const res = await fetch("/api/user");
        if (res.ok) {
            const data = await res.json();
            setUserInfo(data);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;

        const res = await fetch("/api/user", {
            method: "DELETE",
        });

        if (res.ok) {
            signOut();
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    return (
        <div className="main-content">
            <div className="settings-container">
                <h2 className="settings-title">Settings</h2>

                <div className="section">
                    <h3 className="section-title">Profile</h3>
                    <p><strong>Email:</strong> {userInfo?.email}</p>
                    {userInfo?.name && <p><strong>Name:</strong> {userInfo.name}</p>}
                    {userInfo?.age && <p><strong>Age:</strong> {userInfo.age}</p>}
                    {userInfo?.gender && <p><strong>Gender:</strong> {userInfo.gender}</p>}
                    {userInfo?.height && <p><strong>Height:</strong> {userInfo.height} cm</p>}
                </div>

                <div className="section">
                    <h3 className="section-title">Account</h3>
                    <div className="button-group">
                        <button className="danger-button" onClick={handleDeleteAccount}>Delete Account</button>
                        <button className="secondary-button" onClick={() => signOut()}>Logout</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
