import { NextResponse } from "next/server";
import UserModel, { hashPassword } from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";

// IP-based signup limits disabled

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, password, school } = body || {};

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    await connectToDatabase();

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await UserModel.findOne({ email: normalizedEmail }).lean();
    if (existingUser) {
      return NextResponse.json({ error: "A user with that email already exists." }, { status: 409 });
    }

    const hashedPassword = hashPassword(password);

    const user = await UserModel.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
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
