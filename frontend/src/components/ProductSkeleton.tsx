"use client";

import Skeleton from "./Skeleton";

export default function ProductSkeleton() {
    return (
        <div className="bg-[var(--accent)] rounded-2xl overflow-hidden border border-[var(--border)] p-0">
            {/* Image Placeholder */}
            <Skeleton height="16rem" width="100%" borderRadius="0" />

            {/* Content Placeholder */}
            <div className="p-6 space-y-4">
                <Skeleton height="1.5rem" width="70%" />
                <Skeleton height="1rem" width="90%" />

                <div className="flex items-center justify-between pt-2">
                    <Skeleton height="2rem" width="40%" />
                    <Skeleton height="2.5rem" width="45%" borderRadius="0.5rem" />
                </div>
            </div>
        </div>
    );
}
