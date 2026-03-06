import { Suspense } from "react";
import ProfilePage from "./ProfilePage";

// This server component wrapper allows the "use client" ProfilePage
// (which uses useSearchParams) to be properly wrapped in Suspense,
// satisfying Next.js 15's requirement.
export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
            <ProfilePage />
        </Suspense>
    );
}
