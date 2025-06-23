import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/dbConnect";
import { getServerSession } from "next-auth";
import { Workout } from "../../../models/Workout";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

   const workout = new Workout({
        userId: (session.user as any).id,
        exercise: body.exercise,
        sets: body.sets,
        reps: body.reps,
        weight: body.weight
    });

    const savedWorkout = await workout.save()

    return NextResponse.json(savedWorkout)
}

export async function GET(req: Request){
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workouts = await Workout.find({ userId: (session.user as any).id }).sort({ date: -1 });

    return NextResponse.json(workouts)
}