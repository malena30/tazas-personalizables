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
            className={`animate-pulse bg-gray-200 dark:bg-zinc-800 ${className}`}
            style={{
                width: width,
                height: height,
                borderRadius: borderRadius
            }}
        />
    );
}
