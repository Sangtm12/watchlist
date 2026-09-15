import { prisma } from "../config/db";
import bcrypt from "bcryptjs";
//use argon2 for memory-hard defense, no length limits

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExists) {
    return res.status(400).json({
      error: "User already exists with this email",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    },
  });
};

const login = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    res.status(401).json({
      error: "Wrong email or password",
    });
  }

  const isPasswordValid = bcrypt.compare(password, user.password);

  if (!isPasswordValid)
    json.status(401).json({
      error: "Wrong email or password",
    });
};

export { register, login };
