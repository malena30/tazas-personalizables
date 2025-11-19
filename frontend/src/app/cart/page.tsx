"use client";
import Cart from "@/components/Cart";

export default function CartPage() {
  return (
    <main className="w-full max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-10 text-center">Carrito</h1>
      <Cart />
    </main>
  );
}
