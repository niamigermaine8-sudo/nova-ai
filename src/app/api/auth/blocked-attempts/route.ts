import { NextResponse } from "next/server";
import BlockedAttemptModel from "@/models/BlockedAttempt";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectToDatabase();
    const attempts = await BlockedAttemptModel.find().sort({ createdAt: -1 }).limit(100).lean();

    return NextResponse.json(attempts);
  } catch (error) {
    console.error("Blocked attempts fetch error", error);
    return NextResponse.json({ error: "Unable to fetch blocked attempts." }, { status: 500 });
  }
}
