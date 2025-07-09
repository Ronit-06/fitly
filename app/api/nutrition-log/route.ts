// /app/api/nutrition-log/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/dbConnect";
import { NutritionLog } from "../../../models/nutriontonLog";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const newLog = new NutritionLog(body);
    await newLog.save();

    return NextResponse.json({ message: "Saved successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save log" }, { status: 500 });
  }
}
