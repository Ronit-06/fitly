import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/dbConnect";
import { getServerSession } from "next-auth";
import { Workout } from "../../../models/Workout";
import { authOptions } from "../auth/[...nextauth]/route";

type SessionUser = {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    _id: string;
};


export async function POST(req: Request) {

    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const workout = new Workout({
        userId: (session.user as any)._id,
        exercise: body.exercise,
        sets: body.sets,
        reps: body.reps,
        weight: body.weight,
        date: body.date
    });

    const savedWorkout = await workout.save()

    return NextResponse.json(savedWorkout)
}

export async function GET(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workouts = await Workout.find({ userId: (session.user as any)._id }).sort({ date: -1 });

    return NextResponse.json(workouts)
}

export async function DELETE(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    const deletedWorkout = await Workout.findOneAndDelete({
        _id: id,
        userId: (session.user as SessionUser)._id,
    });

    return NextResponse.json(deletedWorkout);
}

export async function PUT(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, exercise, sets, reps, weight, date } = await req.json();

    const updatedWorkout = await Workout.findOneAndUpdate(
        { _id: id, userId: (session.user as SessionUser)._id },
        { exercise, sets, reps, weight, date },
        { new: true }
    );

    return NextResponse.json(updatedWorkout);
}
