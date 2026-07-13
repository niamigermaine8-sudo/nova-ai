import { NextResponse } from "next/server";
import UserModel, { hashPassword } from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, password, school } = body || {};

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    await connectToDatabase();

    const existing = await UserModel.findOne({ email: email.toLowerCase().trim() }).lean();
    if (existing) {
      return NextResponse.json({ error: "A user with that email already exists." }, { status: 409 });
    }

    const hashedPassword = hashPassword(password);
    const user = await UserModel.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      school: school?.trim() || "",
    });

    return NextResponse.json({
      success: true,
      user: { fullName: user.fullName, email: user.email, school: user.school || "" },
    });
  } catch (error) {
    console.error("Signup error", error);
    return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
  }
}
