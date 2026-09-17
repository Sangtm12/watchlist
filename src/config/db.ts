import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("DB connected via prisma");
  } catch (error: unknown) {
    await prisma.$disconnect();
    const message = error instanceof Error ? error.message : "Unknown database connection error";
    console.log(`Connection error: ${message}`);
    process.exit(1);
  }
};

const disconnectDB = async (): Promise<void> => {
  await prisma.$disconnect();
};

export { prisma, connectDB, disconnectDB };
