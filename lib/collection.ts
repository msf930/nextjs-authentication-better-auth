import { prisma } from "./prisma";

export async function ensureUserHasCollection(userId: string) {
  const existing = await prisma.collection.findFirst({ where: { userId } });
  if (!existing) {
    await prisma.collection.create({ data: { userId } });
  }
}
