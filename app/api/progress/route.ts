import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Progress from "../../../models/progressLog";
import { dbConnect } from "../../../lib/dbConnect";

export async function POST(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const progress = new Progress({
        email: session.user.email,
        ...body,
    });

    await progress.save();

    return NextResponse.json({ success: true });
}

export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await Progress.find({ email: session.user.email }).sort({ date: 1 });
    return NextResponse.json(data);
}

export async function PUT(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { _id, ...updates } = body;

    const result = await Progress.findOneAndUpdate(
        { _id, email: session.user.email },
        { $set: updates },
        { new: true }
    );

    return NextResponse.json(result);
}

export async function DELETE(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { _id } = await req.json();

  await Progress.deleteOne({ _id, email: session.user.email });
  return NextResponse.json({ success: true });
}


