import { PrismaClient } from "@/generated/prisma";

const globalForPrism = global as unknown as {
  prisma: PrismaClient;
};

const prisma = globalForPrism.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrism.prisma = prisma;
}

export default prisma;
