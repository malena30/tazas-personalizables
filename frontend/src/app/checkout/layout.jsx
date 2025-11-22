"use client";

import { CheckoutProvider } from "@/context/CheckoutContext";

export default function Layout({ children }) {
  return (
    <CheckoutProvider>
      {children}
    </CheckoutProvider>
  );
}
