"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  // Cargar preferencia de tema al montar el componente
  useEffect(() => {
    // Verificar si hay una preferencia guardada
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else if (savedTheme === "light") {
      setIsDark(false);
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      // Si no hay preferencia, usar la del sistema
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.add("light");
      }
    }
  }, []);

  // Función para cambiar el tema
  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      // Activar modo oscuro
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      // Activar modo claro
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <nav className="w-full bg-[var(--accent)] shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* LOGO */}
        <Link href="/" className="text-3xl font-title font-extrabold text-[var(--foreground)] tracking-tight">
          Tazas.shop
        </Link>

        {/* MENÚ DESKTOP */}
        <div className="hidden md:flex gap-8 text-base text-[var(--foreground)] items-center font-text font-medium">
          <Link href="/" className="hover:opacity-70 transition-opacity">Inicio</Link>
          <Link href="/products" className="hover:opacity-70 transition-opacity">Productos</Link>
          <Link href="/customizer" className="hover:opacity-70 transition-opacity">Personalizar</Link>

          {/* Carrito */}
          <div className="relative">
            <Link href="/cart" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
              <span className="text-2xl">🛒</span>
            </Link>

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-mono font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </div>

          {/* Botón de Tema */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity text-2xl"
            aria-label="Cambiar tema"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Botón menú móvil */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-3xl text-[var(--foreground)] focus:outline-none"
        >
          {open ? "✖" : "☰"}
        </button>
      </div>

      {/* MENÚ MÓVIL */}
      {open && (
        <div className="md:hidden bg-[var(--background)] w-full px-5 py-4 flex flex-col gap-4 shadow-md border-t border-[var(--border)]">
          <Link href="/" onClick={() => setOpen(false)} className="text-[var(--foreground)] font-text">Inicio</Link>
          <Link href="/products" onClick={() => setOpen(false)} className="text-[var(--foreground)] font-text">Productos</Link>
          <Link href="/customizer" onClick={() => setOpen(false)} className="text-[var(--foreground)] font-text">Personalizar</Link>
          <Link href="/cart" onClick={() => setOpen(false)} className="text-[var(--foreground)] font-text flex justify-between">
            Carrito
            {totalItems > 0 && <span className="text-[var(--accent)] font-mono font-bold">({totalItems})</span>}
          </Link>

          {/* Botón de Tema en móvil */}
          <button
            onClick={toggleTheme}
            className="text-[var(--foreground)] font-text flex items-center gap-2"
          >
            <span className="text-xl">{isDark ? "☀️" : "🌙"}</span>
            {isDark ? "Modo Claro" : "Modo Oscuro"}
          </button>
        </div>
      )}
    </nav>
  );
}
