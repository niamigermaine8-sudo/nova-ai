import { NextResponse } from "next/server";
import UserModel, { hashPassword } from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password." }, { status: 400 });
    }

    await connectToDatabase();

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() }).lean();
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    return NextResponse.json({ success: true, user: { fullName: user.fullName, email: user.email, school: user.school || "" } });
  } catch (error) {
    console.error("Signin error", error);
    return NextResponse.json({ error: "Unable to sign in." }, { status: 500 });
  }
}
