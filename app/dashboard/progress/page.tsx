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
    key?: string
}

export default function ProgressPage() {
    const [inputs, setInputs] = useState<{
        [key: string]: string;
    }>({ weight: "", neck: "", waist: "", hips: "", date: "" });
    const [data, setData] = useState<any[]>([]);
    const [editId, setEditId] = useState<string | null>(null);
    const [editInputs, setEditInputs] = useState<any>({});

    const handleChange = (e: any, isEdit = false) => {
        const { name, value } = e.target;
        if (isEdit) {
            setEditInputs({ ...editInputs, [name]: value });
        } else {
            setInputs({ ...inputs, [name]: value });
        }
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

        // Check if there's already an entry with the same date (ignoring time)
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
            if (updated[key] === "") delete updated[key]; // skip empty edits
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

        if (res.ok) {
            fetchProgress();
        }
    };

    const fetchProgress = async () => {
    const res = await fetch("/api/progress", { cache: "no-store" });
    if (res.ok) {
        const json = await res.json();
        const formatted = json.map((entry: ProgressEntry) => ({
            ...entry,
            date: entry.date.split("T")[0], // trim time for graph
        }));
        setData(formatted);
    }
};


    useEffect(() => {
        fetchProgress();
    }, []);

    return (
        <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
            <h2>Add Body Measurements</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                <input type="date" name="date" value={inputs.date} onChange={handleChange} />
                {["weight", "neck", "waist", "hips"].map((field) => (
                    <input
                        key={field}
                        type="number"
                        name={field}
                        value={inputs[field as keyof typeof inputs]}
                        placeholder={field}
                        onChange={handleChange}
                    />
                ))}
                <button onClick={handleSubmit}>Submit</button>
            </div>

            {data.length > 0 && (
                <>
                    <h3 style={{ marginTop: "3rem" }}>Progress Over Time</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={data}>
                            <CartesianGrid stroke="#ccc" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="weight" stroke="#8884d8" />
                            <Line type="monotone" dataKey="neck" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="waist" stroke="#ff7300" />
                            <Line type="monotone" dataKey="hips" stroke="#ff0000" />
                        </LineChart>
                    </ResponsiveContainer>
                </>
            )}

            <h3 style={{ marginTop: "2rem" }}>Entries</h3>
            {data.map((entry) => (
                <div key={entry._id} style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #ccc" }}>
                    {editId === entry._id ? (
                        <div>
                            <input type="date" name="date" defaultValue={entry.date.split("T")[0]} onChange={(e) => handleChange(e, true)} />
                            {["weight", "neck", "waist", "hips"].map((key) => (
                                <input
                                    key={key}
                                    name={key}
                                    type="number"
                                    defaultValue={entry[key]}
                                    onChange={(e) => handleChange(e, true)}
                                    placeholder={key}
                                />
                            ))}
                            <button onClick={() => handleEdit(entry._id)}>Save</button>
                            <button onClick={() => setEditId(null)}>Cancel</button>
                        </div>
                    ) : (
                        <div>
                            <strong>{new Date(entry.date).toLocaleDateString()}</strong>
                            <div>Weight: {entry.weight ?? "-"}</div>
                            <div>Neck: {entry.neck ?? "-"}</div>
                            <div>Waist: {entry.waist ?? "-"}</div>
                            <div>Hips: {entry.hips ?? "-"}</div>
                            <button onClick={() => { setEditId(entry._id); setEditInputs(entry); }}>Edit</button>
                            <button onClick={() => handleDelete(entry._id)}>Delete</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}