import { NextResponse } from "next/server";
import UserModel, { hashPassword } from "@/models/User";
import BlockedAttemptModel from "@/models/BlockedAttempt";
import { connectToDatabase } from "@/lib/mongodb";

const MAX_ACCOUNTS_PER_IP = 1;

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, password, school } = body || {};

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    await connectToDatabase();

    const ip = getClientIp(request);
    const normalizedEmail = email.toLowerCase().trim();

    const existingAccountsForIp = await UserModel.countDocuments({ signupIp: ip }).lean();
    if (existingAccountsForIp >= MAX_ACCOUNTS_PER_IP) {
      await BlockedAttemptModel.create({
        ip,
        attemptedEmail: normalizedEmail,
        reason: "duplicate_ip",
      });

      return NextResponse.json(
        { error: "An account has already been created from this network." },
        { status: 403 }
      );
    }

    const existingUserCount = await UserModel.countDocuments({ email: normalizedEmail }).lean();
    if (existingUserCount > 0) {
      return NextResponse.json({ error: "A user with that email already exists." }, { status: 409 });
    }

    const hashedPassword = hashPassword(password);
    const user = await UserModel.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      school: school?.trim() || "",
      signupIp: ip,
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
