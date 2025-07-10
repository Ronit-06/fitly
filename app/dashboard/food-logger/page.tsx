"use client";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";

interface FoodItem {
  fdcId: number;
  description: string;
  servingSize: number;
  servingSizeUnit: string;
  foodNutrients: {
    nutrientName: string;
    value: number;
  }[];
}

interface NutritionLogEntry {
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  servingUnit: string;
  date: string;
}

export default function NutritionSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<FoodItem[]>([]); // not null
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<NutritionLogEntry[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch("/api/nutrition-log");
      const data = await res.json();
      setLogs(data.logs || []);
    };

    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const res = await fetch("/api/nutrition-log");
    const data = await res.json();
    setLogs(data.logs || []);
  };

  const handleSearch = async () => {
    setLoading(true);
    const res = await fetch("/api/food-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    setResult(data.foods || []);
    setLoading(false);

    console.log(result)
  };

  const handleDelete = async (id: string) => {
    const res = await fetch("/api/nutrition-log", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      alert("Deleted successfully");
      fetchLogs(); // refresh logs
    } else {
      alert("Failed to delete log");
    }
  };


  const handleSave = async (foodItem: any) => {
    const log = {
      description: foodItem.description,
      calories: foodItem.foodNutrients?.find((n: { nutrientName: string; }) => n.nutrientName === "Energy")?.value || 0,
      protein: foodItem.foodNutrients?.find((n: { nutrientName: string; }) => n.nutrientName === "Protein")?.value || 0,
      carbs: foodItem.foodNutrients?.find((n: { nutrientName: string; }) => n.nutrientName === "Carbohydrate, by difference")?.value || 0,
      fat: foodItem.foodNutrients?.find((n: { nutrientName: string; }) => n.nutrientName === "Total lipid (fat)")?.value || 0,
      servingSize: foodItem.servingSize,
      servingUnit: foodItem.servingSizeUnit,
      date: new Date().toISOString(),
    };

    const res = await fetch("/api/nutrition-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(log),
    });

    if (res.ok) {
      alert("Log saved successfully!");
      fetchLogs();
    } else {
      alert("Error saving log.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>Search Food</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. chicken breast"
        style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
      />
      <button onClick={handleSearch} disabled={loading} style={{ padding: "0.5rem 1rem" }}>
        {loading ? "Searching..." : "Search"}
      </button>

      {result.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Search Results</h3>
          {result.map((food) => (
            <div
              key={food.fdcId}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "6px",
                marginBottom: "1rem",
              }}
            >
              <p><strong>{food.description}</strong></p>
              <p>Serving: {food.servingSize} {food.servingSizeUnit}</p>
              <p>Calories: {food.foodNutrients?.find(n => n.nutrientName === "Energy")?.value || 0} kcal</p>
              <p>Protein: {food.foodNutrients?.find(n => n.nutrientName === "Protein")?.value || 0} g</p>
              <p>Carbs: {food.foodNutrients?.find(n => n.nutrientName === "Carbohydrate, by difference")?.value || 0} g</p>
              <p>Fat: {food.foodNutrients?.find(n => n.nutrientName === "Total lipid (fat)")?.value || 0} g</p>
              <button onClick={() => handleSave(food)}>Save to Log</button>
            </div>
          ))}
        </div>
      )}

      {logs.length > 0 && (
        <div style={{ marginTop: "3rem" }}>
          <h2>Nutrition Logs</h2>
          {Object.entries(
            logs.reduce((grouped, log) => {
              const date = new Date(log.date).toLocaleDateString();
              if (!grouped[date]) grouped[date] = [];
              grouped[date].push(log);
              return grouped;
            }, {} as Record<string, NutritionLogEntry[]>)
          ).map(([date, entries]) => (
            <div key={date} style={{ marginBottom: "2rem" }}>
              <h3>{date}</h3>
              {entries.map((log, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#e3f2fd",
                    padding: "1rem",
                    borderRadius: "6px",
                    marginBottom: "1rem",
                  }}
                >
                  <p><strong>{log.description}</strong></p>
                  <p>Serving: {log.servingSize} {log.servingUnit}</p>
                  <p>Calories: {log.calories} kcal</p>
                  <p>Protein: {log.protein} g</p>
                  <p>Carbs: {log.carbs} g</p>
                  <p>Fat: {log.fat} g</p>
                  <button onClick={() => handleDelete((log as any)._id)}>Delete</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
