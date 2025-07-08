// app/api/foodSearch/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { query } = await req.json();

  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.USDA_KEY}&query=${encodeURIComponent(query)}&pageSize=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch from USDA API" }, { status: 500 });
  }
}