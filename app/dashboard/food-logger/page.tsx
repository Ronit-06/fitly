"use client";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from "react";

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


export default function NutritionSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<FoodItem[]>([]); // not null
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
    setResult(data.foods || []);
    setLoading(false);

    console.log(result)
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
          {result.map((item: { fdcId: any; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; servingSize: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; servingSizeUnit: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; foodNutrients: any[]; }, index: any) => (
            <div
              key={item.fdcId || index}
              style={{
                background: "#f5f5f5",
                padding: "1rem",
                borderRadius: "6px",
                marginBottom: "1rem",
              }}
            >
              <h3>{item.description}</h3>
              <p><strong>Serving Size:</strong> {item.servingSize} {item.servingSizeUnit}</p>
              <p><strong>Calories:</strong> {item.foodNutrients?.find((n: { nutrientName: string; }) => n.nutrientName === "Energy")?.value} kcal</p>
              <p><strong>Protein:</strong> {item.foodNutrients?.find((n: { nutrientName: string; }) => n.nutrientName === "Protein")?.value} g</p>
              <p><strong>Carbs:</strong> {item.foodNutrients?.find((n: { nutrientName: string; }) => n.nutrientName === "Carbohydrate, by difference")?.value} g</p>
              <p><strong>Fat:</strong> {item.foodNutrients?.find((n: { nutrientName: string; }) => n.nutrientName === "Total lipid (fat)")?.value} g</p>
              <button onClick={() => handleSave(item)}>Save to Log</button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
