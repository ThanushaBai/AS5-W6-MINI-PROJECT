import jwt from "jsonwebtoken";

const AUTH_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET || "dev-secret-change-me";

export function signAuthToken(payload: { username: string }) {
  return jwt.sign(payload, AUTH_SECRET, { expiresIn: "1d" });
}

export function verifyAuthToken(token: string) {
  try {
    return jwt.verify(token, AUTH_SECRET);
  } catch {
    return null;
  }
}
