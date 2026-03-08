import { NextResponse } from "next/server";
import { signAuthToken } from "@/lib/auth";
import { getUserByUsernameOrEmail } from "@/lib/db";
import { compare } from "bcryptjs";

export async function POST(request: Request) {
  const body = await request.json();

  const username = String(body?.username || "").trim();
  const password = String(body?.password || "").trim();

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
  }

  const user = await getUserByUsernameOrEmail(username);
  if (!user) {
    return NextResponse.json({ error: "Account not found. Please register first." }, { status: 404 });
  }

  const isValidPassword = await compare(password, user.passwordHash);
  if (!isValidPassword) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const token = signAuthToken({ username });

  const response = NextResponse.json({ message: "Login successful" });
  response.cookies.set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/"
  });

  return response;
}
