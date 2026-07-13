import { NextResponse } from "next/server";
import UserModel from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectToDatabase();
    const users = await UserModel.find({}, { password: 0, __v: 0 }).lean();
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Users list error", error);
    return NextResponse.json({ error: "Unable to load users." }, { status: 500 });
  }
}
