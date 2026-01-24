"use client";
import { signOut } from "@/lib/actions/auth-actions";
import { openPack } from "@/lib/actions/open-actions";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "radix-ui";
import { useEffect, useState } from "react";
import Image from "next/image";
import { clearCollection, getCollection } from "@/lib/actions/collection-actions";
import type { Item } from "@/generated/prisma/client";

type Session = typeof auth.$Infer.Session;

export default function CollectionClientPage({ session }: { session: Session }) {
    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    console.log(session);
    const name = session.user?.name;
    const email = session.user?.email;
    const userId = session.user?.id;

    // Redirect to auth if not authenticated

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                setIsLoading(true);
                const collection = await getCollection(userId);
                setItems(collection?.items ?? []);
                setIsLoading(false);
            } catch (error) {
                setError("Error fetching collection");
                setIsLoading(false);
            }
        };
        fetchCollection();
    }, [userId, setItems, setError, setIsLoading]);

    const handleClearCollection = async () => {
        try {
            await clearCollection(userId);
            setItems([]);
        } catch (error) {
            setError("Error clearing collection");
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-20">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h1>Collection</h1>
                        {isLoading && <p>Loading...</p>}
                        {error && <p>{error}</p>}
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleClearCollection}>Clear Collection</button>
                        <div>
                            {items.map((item, index) => (
                                <div key={index}><Image src={item.url ?? ""} alt={item.name ?? ""} width={200} height={200} /></div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
