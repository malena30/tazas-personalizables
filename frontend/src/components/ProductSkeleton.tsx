"use client";

import Skeleton from "./Skeleton";

export default function ProductSkeleton() {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-[var(--border)] flex flex-col h-full">
            {/* Image Placeholder */}
            <Skeleton className="aspect-square w-full" borderRadius="0" />

            {/* Content Placeholder */}
            <div className="p-8 space-y-4 flex-1 flex flex-col">
                <Skeleton height="1.5rem" width="70%" />
                <Skeleton height="1rem" width="90%" />
                <Skeleton height="1rem" width="80%" />

                <div className="mt-auto pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <Skeleton height="0.5rem" width="3rem" />
                            <Skeleton height="1.5rem" width="5rem" />
                        </div>
                        <Skeleton height="2.5rem" width="5rem" borderRadius="0.75rem" />
                    </div>
                    <Skeleton height="3.5rem" width="100%" borderRadius="1rem" />
                </div>
            </div>
        </div>
    );
}
