"use client";
import { useState } from "react";

export default function NutritionSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

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
    setResult(data.foods?.[0] || null);
    setLoading(false);

    console.log(result)
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

      {result && (
        <div style={{ marginTop: "2rem", background: "#f5f5f5", padding: "1rem", borderRadius: "6px" }}>
          <h3>{result.description}</h3>
          <p><strong>Serving Size:</strong> {result.servingSize} {result.servingSizeUnit}</p>
          <p><strong>Calories:</strong> {result.foodNutrients?.find((n: { nutrientName: string; }) => n.nutrientName === "Energy")?.value} kcal</p>
          <p><strong>Protein:</strong> {result.foodNutrients?.find((n: { nutrientName: string; }) => n.nutrientName === "Protein")?.value} g</p>
          <p><strong>Carbs:</strong> {result.foodNutrients?.find((n: { nutrientName: string; }) => n.nutrientName === "Carbohydrate, by difference")?.value} g</p>
          <p><strong>Fat:</strong> {result.foodNutrients?.find((n: { nutrientName: string; }) => n.nutrientName === "Total lipid (fat)")?.value} g</p>
        </div>
      )}
    </div>
  );
}
