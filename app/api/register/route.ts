import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/dbConnect"
import { User } from "../../../models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, age, gender, height, weight, goal, calorieTarget } = await req.json();

    if (!name || !email || !password || !age || !gender || !height || !weight || !goal || !calorieTarget) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      age, 
      gender, 
      height, 
      weight, 
      goal, 
      calorieTarget
    });

    await newUser.save();

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
