"use client";

import Skeleton from "./Skeleton";

export default function ProfileSkeleton() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-[var(--border)] shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12 pb-12 border-b border-[var(--border)]">
                    <Skeleton width={128} height={128} borderRadius="2.5rem" />
                    <div className="text-center md:text-left space-y-3">
                        <Skeleton width={200} height={32} />
                        <Skeleton width={150} height={20} />
                        <Skeleton width={100} height={24} borderRadius="full" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton width={80} height={12} />
                            <Skeleton width="100%" height={48} borderRadius="1rem" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
