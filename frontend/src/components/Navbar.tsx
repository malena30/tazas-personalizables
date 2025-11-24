"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <nav className="w-full bg-[#FFE600] shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-10 flex justify-between items-center">

        {/* LOGO */}
        <Link href="/" className="text-3xl font-extrabold text-[#2D3277] tracking-tight">
          Tazas.shop
        </Link>

        {/* MENÚ DESKTOP */}
        <div className="hidden md:flex gap-8 text-base text-[#333] items-center font-medium">
          <Link href="/" className="hover:text-[#3483FA] transition-colors">Inicio</Link>
          <Link href="/products" className="hover:text-[#3483FA] transition-colors">Productos</Link>
          <Link href="/customizer" className="hover:text-[#3483FA] transition-colors">Personalizar</Link>

          {/* Carrito */}
          <div className="relative">
            <Link href="/cart" className="flex items-center gap-2 hover:text-[#3483FA] transition-colors">
              <span className="text-2xl">🛒</span>
            </Link>

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </div>
        </div>

        {/* Botón menú móvil */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-3xl text-[#333] focus:outline-none"
        >
          {open ? "✖" : "☰"}
        </button>
      </div>

      {/* MENÚ MÓVIL */}
      {open && (
        <div className="md:hidden bg-white w-full px-5 py-4 flex flex-col gap-4 shadow-md border-t">
          <Link href="/" onClick={() => setOpen(false)} className="text-[#333]">Inicio</Link>
          <Link href="/products" onClick={() => setOpen(false)} className="text-[#333]">Productos</Link>
          <Link href="/customizer" onClick={() => setOpen(false)} className="text-[#333]">Personalizar</Link>
          <Link href="/cart" onClick={() => setOpen(false)} className="text-[#333] flex justify-between">
            Carrito
            {totalItems > 0 && <span className="text-red-600 font-bold">({totalItems})</span>}
          </Link>
        </div>
      )}
    </nav>
  );
}
