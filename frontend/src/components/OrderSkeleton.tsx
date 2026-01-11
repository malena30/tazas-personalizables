"use client";

import Skeleton from "./Skeleton";

export default function OrderSkeleton() {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-[var(--border)] shadow-sm space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Skeleton width={48} height={48} borderRadius="0.75rem" />
                    <div className="space-y-2">
                        <Skeleton width={120} height={16} />
                        <Skeleton width={80} height={12} />
                    </div>
                </div>
                <div className="text-right space-y-2">
                    <Skeleton width={60} height={16} />
                    <Skeleton width={40} height={12} />
                </div>
            </div>
            <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center">
                <Skeleton width={100} height={12} />
                <Skeleton width={24} height={24} borderRadius="full" />
            </div>
        </div>
    );
}
