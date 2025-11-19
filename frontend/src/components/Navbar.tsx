"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-5 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Tazas.shop
        </Link>

        <div className="hidden md:flex gap-8 text-lg items-center">
          <Link href="/" className="text-black hover:text-blue-500">Home</Link>
          <Link href="/products" className="text-black hover:text-blue-500">Productos</Link>
          <Link href="/customizer" className="text-black hover:text-blue-500">Personalizar</Link>

          {/* Carrito con badge */}
          <div className="relative">
            <Link href="/cart" className="text-black hover:text-blue-500">
              Carrito
            </Link>

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                {totalItems}
              </span>
            )}
          </div>
        </div>

        <button 
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl focus:outline-none"
        >
          {open ? "✖" : "☰"}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white w-full px-5 pb-4 flex flex-col gap-4 shadow-md">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/products" onClick={() => setOpen(false)}>Productos</Link>
          <Link href="/customizer" onClick={() => setOpen(false)}>Personalizar</Link>

          {/* Carrito en menú móvil */}
          <div className="relative">
            <Link href="/cart" onClick={() => setOpen(false)}>Carrito</Link>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-3 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                {totalItems}
              </span>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
