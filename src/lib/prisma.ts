import { PrismaClient } from "@/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";

const prismaClientSingleton = () => {
  if (process.env.NODE_ENV !== "production") {
    const connectionString = `${process.env.DATABASE_URL}`;
    const adapter = new PrismaPg({ connectionString });
    return new PrismaClient({ adapter });
  } else {
    const connectionString = process.env.DATABASE_URL!;
    const adapter = new PrismaNeon({ connectionString });
    return new PrismaClient({ adapter });
  }
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

export default prisma;
