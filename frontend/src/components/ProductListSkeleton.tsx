"use client";

import Skeleton from "./Skeleton";

export default function ProductListSkeleton() {
    return (
        <div className="flex flex-col md:flex-row p-6 gap-6 border-b border-[var(--border)] last:border-0">
            {/* Image Placeholder */}
            <Skeleton className="w-full md:w-48 h-48 shrink-0" />

            {/* Info Placeholder */}
            <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="space-y-2 w-full">
                        <Skeleton height="1.5rem" width="40%" />
                        <Skeleton height="1rem" width="90%" />
                        <Skeleton height="1rem" width="80%" />
                    </div>
                    <Skeleton height="1.5rem" width="20%" />
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <Skeleton height="2.5rem" width="8rem" borderRadius="0.5rem" />
                    <Skeleton height="2.5rem" width="10rem" borderRadius="0.5rem" />
                </div>
            </div>
        </div>
    );
}
