"use client";
import { signOut } from "@/lib/actions/auth-actions";
import { openPack } from "@/lib/actions/open-actions";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "radix-ui";
import { useState } from "react";
import Image from "next/image";
type Session = typeof auth.$Infer.Session;

export default function OpenPacksClientPage({ session }: { session: Session }) {
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    console.log(session);
    const name = session.user?.name;
    const email = session.user?.email;
    const userId = session.user?.id;

    // Redirect to auth if not authenticated

    const handleOpenPack = async () => {
        setIsLoading(true);
        setError("");
        try {
            setItems([]);
            const items = await openPack(userId);
            setItems(items);
        } catch (error) {
            setError("Error opening pack");
        } finally {
            setIsLoading(false);
            // console.log(items);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-20">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white rounded-lg shadow p-6">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleOpenPack}>Open Pack</button>

                        {isLoading && <p>Loading...</p>}
                        {error && <p>{error}</p>}
                        {items.length > 0 && (
                            <div>
                                {items.map((item, index) => (
                                    <div key={index}><Image src={item.url ?? ""} alt={item.name ?? ""} width={200} height={200} /></div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
}
