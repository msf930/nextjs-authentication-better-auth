"use server";

import { redirect } from "next/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";
import { ensureUserHasCollection } from "../collection";

import { prisma } from "../prisma";


export const getCollection = async (userId: string) => {
        if (userId) {
            await ensureUserHasCollection(userId);
        }
       
        const collectionId = await prisma.collection.findFirst({
            where: { userId: userId },
            select: { id: true },
        });
        const collection = await prisma.collection.findUnique({
            where: { id: collectionId?.id },
            include: {
              items: {
                orderBy: { id: "asc" },
              },
            },
          });
        return collection;
};

export const clearCollection = async (userId: string) => {
  const collection = await prisma.collection.findFirst({
    where: { userId },
    select: { id: true },
  });
  if (!collection) return;

  await prisma.collection.update({
    where: { id: collection.id },
    data: { items: { set: [] } },
  });
};