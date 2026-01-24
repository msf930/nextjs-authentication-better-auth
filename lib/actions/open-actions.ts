"use server";

import { redirect } from "next/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";
import { ensureUserHasCollection } from "../collection";

import { prisma } from "../prisma";




export const openPack = async (userId: string) => {
    try {

        if (userId) {
            await ensureUserHasCollection(userId);
        }
        
        const items = [];
       
        const group1 = await prisma.item.findMany({
            where: {
                AND: [
                    { rarity: { equals: "Common" } },
                    { id: { not: "208" } },
                    { id: { not: "209" } },
                    { id: { not: "210" } },
                    { id: { not: "211" } },
                    { id: { not: "212" } },
                    { id: { not: "213" } },
                    { id: { not: "214" } },
                    { id: { not: "215" } }
                ]
            }
        });
        const group2 = await prisma.item.findMany({
            where: {

                     rarity: { equals: "Uncommon" } ,
                   
            }
        });
        const group3 = await prisma.item.findMany({
            where: {
                OR: [
                    { rarity: { equals: "Common" } },
                    { rarity: { equals: "Uncommon" } },
                    { rarity: { equals: "Rare" } }
                ]
            }
        });
        const group4 = await prisma.item.findMany({
            where: {
                OR: [
                    { rarity: { equals: "Common" } },
                    { rarity: { equals: "Uncommon" } },
                    { rarity: { equals: "Rare" } },
                    { rarity: { equals: "Illustration Rare" } },
                    { rarity: { equals: "Special Illustration Rare" } },
                    { rarity: { equals: "Hyper Rare" } }
                ]
            }
        });
        const group5 = await prisma.item.findMany({
            where: {
                OR: [
                    { rarity: { equals: "Ultra Rare" } },
                    { rarity: { equals: "Double Rare" } },
                    { rarity: { equals: "Rare" } }

                ]
            }
        });


        const group6 = await prisma.item.findMany({
            where: {
                OR: [
                    { id: { equals: "208" } },
                    { id: { equals: "209" } },
                    { id: { equals: "210" } },
                    { id: { equals: "211" } },
                    { id: { equals: "212" } },
                    { id: { equals: "213" } },
                    { id: { equals: "214" } },
                    { id: { equals: "215" } }
                ]
            }
        });

        for (let i = 0; i < 4; i++) {
            const seed = Math.floor(Math.random() * group1.length);
            const item = group1[seed];
            items.push(item);
        }
        for (let i = 0; i < 3; i++) {
            const seed = Math.floor(Math.random() * group2.length);
            const item = group2[seed];
            items.push(item);
        }
        for (let i = 0; i < 1; i++) {
            const seed = Math.floor(Math.random() * group3.length);
            const item = group3[seed];
            items.push(item);
        }
        for (let i = 0; i < 1; i++) {
            const seed = Math.floor(Math.random() * group4.length);
            const item = group4[seed];
            items.push(item);
        }
        for (let i = 0; i < 1; i++) {
            const seed = Math.floor(Math.random() * group5.length);
            const item = group5[seed];
            items.push(item);
        }
        for (let i = 0; i < 1; i++) {
            const seed = Math.floor(Math.random() * group6.length);
            const item = group6[seed];
            items.push(item);
        }
        const collectionId = await prisma.collection.findFirst({
            where: { userId: userId },
            select: { id: true },
        });
        let currentCollection: any[] = [];
        const currentCollectionItems = await prisma.collection.findUnique({
            where: { id: collectionId?.id },
            include: {
              items: true,
            },
          });
          currentCollection = currentCollectionItems?.items ?? [];
        console.log("currentCollection", currentCollection);
        for (let i = 0; i < items.length; i++) {
            let boolean = true;
            for (let j = 0; j < currentCollection?.length; j++) {
                if(currentCollection[j].itemId === items[i].id) {
                    boolean = false;
                    break;
                }
            }
            if(boolean) {
                await prisma.collection.update({
                    where: { id: collectionId?.id },
                    data: {
                      items: {
                        connect: { id: items[i].id },
                      },
                    },
                  });
            }
        }
        return items;
    } catch (error) {
        console.error("Sign in error:", error);
        throw error;
    }
};


