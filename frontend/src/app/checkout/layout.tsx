"use client";

import { CheckoutProvider } from "@/context/CheckoutContext";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <CheckoutProvider>
            {children}
        </CheckoutProvider>
    );
}
