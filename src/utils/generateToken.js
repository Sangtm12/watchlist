//use command to generate jwt secret:  openssl rand -base64 32
import jwt from "jsonwebtoken";

export default function generateToken(userId, res) {
  const payload = { id: userId };
  const token = jwt.sign(payload, process.env.JWT_TOKEN, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  return token;
}
