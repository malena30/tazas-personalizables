"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FavoritesRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/profile?tab=favorites");
    }, [router]);

    return (
        <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-[var(--accent)]/20 rounded-full"></div>
                <p className="text-[var(--accent)] font-bold animate-bounce text-xs uppercase tracking-widest">Redirigiendo a tus favoritos...</p>
            </div>
        </div>
    );
}
