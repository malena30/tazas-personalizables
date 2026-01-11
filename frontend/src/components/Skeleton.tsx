"use client";

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    borderRadius?: string;
}

export default function Skeleton({
    className = "",
    width,
    height,
    borderRadius = "0.5rem"
}: SkeletonProps) {
    return (
        <div
            className={`relative overflow-hidden bg-gray-100 dark:bg-zinc-800/50 ${className}`}
            style={{
                width: width,
                height: height,
                borderRadius: borderRadius
            }}
        >
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
        </div>
    );
}
