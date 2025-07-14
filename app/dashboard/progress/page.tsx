"use client";

import { useEffect, useState } from "react";
import {
    LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";

interface ProgressEntry {
    _id: string;
    date: string;
    weight?: number;
    neck?: number;
    waist?: number;
    hips?: number;
    key?: string;
}

export default function ProgressPage() {
    const [inputs, setInputs] = useState<{ [key: string]: string }>({
        weight: "", neck: "", waist: "", hips: "", date: ""
    });
    const [data, setData] = useState<any[]>([]);
    const [editId, setEditId] = useState<string | null>(null);
    const [editInputs, setEditInputs] = useState<any>({});

    const handleChange = (e: any, isEdit = false) => {
        const { name, value } = e.target;
        if (isEdit) setEditInputs({ ...editInputs, [name]: value });
        else setInputs({ ...inputs, [name]: value });
    };

    const handleSubmit = async () => {
        const payload: any = {};
        for (const key in inputs) {
            if (inputs[key]) {
                payload[key] = key === "date"
                    ? new Date(inputs[key]).toISOString()
                    : parseFloat(inputs[key]);
            }
        }

        if (!payload.date) {
            payload.date = new Date().toISOString();
        }

        const existing = data.find(entry => entry.date.split("T")[0] === inputs.date);

        const res = await fetch("/api/progress", {
            method: existing ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(existing ? { _id: existing._id, ...payload } : payload),
        });

        if (res.ok) {
            setInputs({ weight: "", neck: "", waist: "", hips: "", date: "" });
            fetchProgress();
        }
    };

    const handleEdit = async (_id: string) => {
        const updated = { ...editInputs };
        if (updated.date) updated.date = new Date(updated.date).toISOString();
        for (const key in updated) {
            if (updated[key] === "") delete updated[key];
            else if (key !== "date") updated[key] = parseFloat(updated[key]);
        }

        const res = await fetch("/api/progress", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id, ...updated }),
        });

        if (res.ok) {
            setEditId(null);
            setEditInputs({});
            fetchProgress();
        }
    };

    const handleDelete = async (_id: string) => {
        const res = await fetch("/api/progress", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id }),
        });

        if (res.ok) fetchProgress();
    };

    const fetchProgress = async () => {
        const res = await fetch("/api/progress", { cache: "no-store" });
        if (res.ok) {
            const json = await res.json();
            const formatted = json.map((entry: ProgressEntry) => ({
                ...entry,
                date: entry.date.split("T")[0],
            }));
            setData(formatted);
        }
    };

    useEffect(() => {
        fetchProgress();
    }, []);

    return (
        <div className="progress-container">
            <h2 className="progress-title">Add Body Measurements</h2>
            <div className="progress-input-group">
                <input type="date" name="date" value={inputs.date} onChange={handleChange} className="progress-input" />
                {["weight", "neck", "waist", "hips"].map((field) => (
                    <input
                        key={field}
                        type="number"
                        name={field}
                        value={inputs[field]}
                        placeholder={field}
                        onChange={handleChange}
                        className="progress-input"
                    />
                ))}
                <button className="progress-button" onClick={handleSubmit}>Submit</button>
            </div>

            {data.length > 0 && (
                <>
                    <h3 className="progress-subtitle">Progress Over Time</h3>
                    <div className="progress-chart">
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={data}>
                                <CartesianGrid stroke="#333" />
                                <XAxis dataKey="date" stroke="#ccc" />
                                <YAxis stroke="#ccc" />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="weight" stroke="#8884d8" />
                                <Line type="monotone" dataKey="neck" stroke="#82ca9d" />
                                <Line type="monotone" dataKey="waist" stroke="#ff7300" />
                                <Line type="monotone" dataKey="hips" stroke="#ff0000" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}

            <h3 className="progress-subtitle">Entries</h3>
            <div className="progress-entries">
                {data.map((entry) => (
                    <div key={entry._id} className="progress-entry-card">
                        {editId === entry._id ? (
                            <div className="progress-entry-edit">
                                <input type="date" name="date" defaultValue={entry.date} onChange={(e) => handleChange(e, true)} className="progress-input" />
                                {["weight", "neck", "waist", "hips"].map((key) => (
                                    <input
                                        key={key}
                                        name={key}
                                        type="number"
                                        defaultValue={entry[key]}
                                        onChange={(e) => handleChange(e, true)}
                                        placeholder={key}
                                        className="progress-input"
                                    />
                                ))}
                                <button className="progress-button" onClick={() => handleEdit(entry._id)}>Save</button>
                                <button className="progress-button cancel" onClick={() => setEditId(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                <strong>{new Date(entry.date).toLocaleDateString()}</strong>
                                <div>Weight: {entry.weight ?? "-"}</div>
                                <div>Neck: {entry.neck ?? "-"}</div>
                                <div>Waist: {entry.waist ?? "-"}</div>
                                <div>Hips: {entry.hips ?? "-"}</div>
                                <button className="progress-button edit" onClick={() => { setEditId(entry._id); setEditInputs(entry); }}>Edit</button>
                                <button className="progress-button delete" onClick={() => handleDelete(entry._id)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
