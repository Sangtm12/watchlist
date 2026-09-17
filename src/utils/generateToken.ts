import jwt from "jsonwebtoken";
import type { Response } from "express";

export default function generateToken(userId: string, res: Response): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]) || "7d";
  const payload = { id: userId };
  const token = jwt.sign(payload, secret as jwt.Secret, {
    expiresIn,
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return token;
}
