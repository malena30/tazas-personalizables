"use client";

import { LuArrowRight } from "react-icons/lu";

interface CollectionCardProps {
    title: string;
    description: string;
    itemCount: number;
    onClick: () => void;
    image?: string;
    icon: React.ReactNode;
}

export default function CollectionCard({ title, description, itemCount, onClick, image, icon }: CollectionCardProps) {
    return (
        <button
            onClick={onClick}
            className="group relative w-full aspect-[4/5] md:aspect-square overflow-hidden rounded-[3rem] border border-[var(--border)] bg-white dark:bg-zinc-900 transition-all duration-500 hover:shadow-2xl hover:shadow-black/10 active:scale-[0.98]"
        >
            {/* Background Image/Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-950 opacity-50 transition-opacity group-hover:opacity-100" />

            {/* Decorative Icon in background */}
            <div className="absolute -right-8 -bottom-8 text-black/5 dark:text-white/5 text-9xl transform rotate-12 transition-transform group-hover:scale-110 group-hover:rotate-6">
                {icon}
            </div>

            <div className="relative h-full p-10 flex flex-col justify-between text-left">
                <div className="space-y-4">
                    <div className="w-16 h-16 bg-[var(--cream)] rounded-2xl flex items-center justify-center text-[var(--accent)] transform transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none mb-2">
                            {title}
                        </h3>
                        <p className="text-white/70 text-sm font-medium leading-relaxed max-w-[200px]">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                        {itemCount} Diseños exclusivos
                    </span>
                    <div className="w-12 h-12 bg-[var(--foreground)] text-[var(--background)] rounded-full flex items-center justify-center transform translate-x-4 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 shadow-xl">
                        <LuArrowRight size={24} />
                    </div>
                </div>
            </div>
        </button>
    );
}
