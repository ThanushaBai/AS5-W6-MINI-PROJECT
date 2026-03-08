import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { addUser, ensureUserIndexes, getUserByEmail, getUserByUsername } from "@/lib/db";
import { generateId } from "@/lib/utils";

export async function POST(request: Request) {
  const body = await request.json();

  const username = String(body?.username || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "").trim();

  if (username.length < 3) {
    return NextResponse.json({ error: "Username must be at least 3 characters" }, { status: 400 });
  }

  if (password.length < 4) {
    return NextResponse.json({ error: "Password must be at least 4 characters" }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  await ensureUserIndexes();

  const [existing, existingEmail] = await Promise.all([
    getUserByUsername(username),
    getUserByEmail(email)
  ]);

  if (existing) {
    return NextResponse.json({ error: "Username already exists" }, { status: 409 });
  }

  if (existingEmail) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const bcryptRounds = Number(process.env.BCRYPT_ROUNDS || "8");
  const passwordHash = await hash(password, bcryptRounds);

  await addUser({
    id: generateId(),
    username,
    email,
    passwordHash,
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({ message: "Registration successful" }, { status: 201 });
}
