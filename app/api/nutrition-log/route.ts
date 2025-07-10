import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { dbConnect } from "../../../lib/dbConnect";
import { NutritionLog } from "../../../models/nutriontonLog";

// SECRET is needed for getToken
const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret });
  const userEmail = token?.email;

  if (!token || !userEmail) {
    return new Response("Unauthorized", { status: 401 });
  }

  await dbConnect();
  const logs = await NutritionLog.find({ userEmail });
  return Response.json({ logs });
}

export async function DELETE(req: NextRequest) {
  const token = await getToken({ req, secret });
  const userEmail = token?.email;

  if (!token || !userEmail) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await req.json();
  await dbConnect();
  await NutritionLog.deleteOne({ _id: id, userEmail });
  return Response.json({ success: true });
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret });
  const userEmail = token?.email;

  if (!token || !userEmail) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body = await req.json();
  await dbConnect();
  const saved = await NutritionLog.create({ ...body, userEmail });
  console.log("Saved Log:", saved.toObject());

  return Response.json({ success: true });
}