import type { NextFunction, Request, RequestHandler, Response } from "express";
import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";

type JwtPayload = {
  id: string;
};

const authMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const jwtSecret = (process.env.JWT_SECRET || "") as string;
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decode = jwt.verify(token, jwtSecret);

    const user = await prisma.user.findUnique({
      where: {
        id: (decode as JwtPayload).id,
      },
    });

    if (!user) {
      return res.status(400).json({ error: "User doesn't exist" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      error: "Auth failed",
    });
  }
};

export default authMiddleware;
