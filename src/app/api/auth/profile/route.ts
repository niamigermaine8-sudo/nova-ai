import { NextResponse } from "next/server";
import UserModel from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { currentEmail, fullName, email, school } = body || {};

    if (!currentEmail || !fullName || !email) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    await connectToDatabase();

    const user = await UserModel.findOne({ email: currentEmail.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const newEmail = email.toLowerCase().trim();
    if (newEmail !== user.email) {
      const existing = await UserModel.findOne({ email: newEmail }).lean();
      if (existing) {
        return NextResponse.json({ error: "That email is already used by another account." }, { status: 409 });
      }
    }

    user.fullName = fullName.trim();
    user.email = newEmail;
    user.school = school?.trim() || "";
    await user.save();

    return NextResponse.json({ success: true, user: { fullName: user.fullName, email: user.email, school: user.school } });
  } catch (error) {
    console.error("Profile update error", error);
    return NextResponse.json({ error: "Unable to update profile." }, { status: 500 });
  }
}
