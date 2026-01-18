"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  FaShoppingBag,
  FaUserCircle,
  FaSun,
  FaMoon,
  FaCrown,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from "react-icons/fa";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const { user, logout } = useAuth();
  const router = useRouter();

  // Detect scroll for transparent navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cargar preferencia de tema al montar el componente
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
      if (prefersDark) document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 border-b ${scrolled
      ? "bg-[var(--background)]/90 backdrop-blur-xl border-[var(--border)] py-3 shadow-sm"
      : "bg-[var(--background)] border-[var(--border)] py-5"
      }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        {/* LOGO */}
        <Link href="/" className="text-2xl font-title font-black text-[var(--foreground)] tracking-tighter flex items-center gap-2">
          <div className="w-10 h-10 bg-[var(--foreground)] rounded-xl flex items-center justify-center text-[var(--background)] shadow-lg shadow-black/10">
            <FaShoppingBag size={18} />
          </div>
          <span>Tazas<span className="text-[var(--accent)]">.shop</span></span>
        </Link>

        {/* MENÚ DESKTOP */}
        <div className="hidden md:flex gap-8 text-sm text-[var(--foreground)] items-center font-text font-bold">
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">Inicio</Link>
          <Link href="/products" className="hover:text-[var(--accent)] transition-colors">Productos</Link>
          <Link href="/customizer" className="hover:text-[var(--accent)] transition-colors">Personalizar</Link>
          {user && (
            <>
              <Link href="/orders" className="hover:text-[var(--accent)] transition-colors">Mis Pedidos</Link>
              <Link href="/profile" className="hover:text-[var(--accent)] transition-colors">Mi Perfil</Link>
            </>
          )}
          {user?.is_admin && (
            <Link href="/admin" className="flex items-center gap-1.5 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-black uppercase tracking-wider">
              <FaCrown size={12} />
              Admin
            </Link>
          )}

          <div className="h-6 w-px bg-[var(--border)] mx-2"></div>

          {/* Carrito */}
          <Link href="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
            <FaShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--accent)] text-[var(--background)] text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-black/10">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Botón de Tema */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
            aria-label="Cambiar tema"
          >
            {isDark ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>

          {/* User / Auth */}
          {user ? (
            <div className="flex items-center gap-4 ml-2">
              <Link href="/profile" className="flex items-center gap-2 group">
                {user.avatar_url ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-[var(--accent)]">
                    <Image src={user.avatar_url} alt={user.username} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full flex items-center justify-center border border-[var(--accent)]/20">
                    <FaUserCircle size={20} />
                  </div>
                )}
                <span className="text-sm group-hover:text-[var(--accent)] transition-colors">{user.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Cerrar Sesión"
              >
                <FaSignOutAlt size={18} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-6 py-2.5 bg-gray-900 dark:bg-zinc-800 text-white rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-gray-900/10"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>

        {/* Botón menú móvil */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-[var(--foreground)] hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
        >
          {open ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* MENÚ MÓVIL */}
      {open && (
        <div className="md:hidden bg-white dark:bg-zinc-900 w-full px-6 py-8 flex flex-col gap-6 shadow-2xl border-t border-[var(--border)] animate-in slide-in-from-top duration-300">
          <Link href="/" onClick={() => setOpen(false)} className="text-lg font-bold flex items-center gap-3">
            <span className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg flex items-center justify-center">🏠</span>
            Inicio
          </Link>
          <Link href="/products" onClick={() => setOpen(false)} className="text-lg font-bold flex items-center gap-3">
            <span className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg flex items-center justify-center">☕</span>
            Productos
          </Link>
          <Link href="/customizer" onClick={() => setOpen(false)} className="text-lg font-bold flex items-center gap-3">
            <span className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg flex items-center justify-center">🎨</span>
            Personalizar
          </Link>
          {user && (
            <>
              <Link href="/orders" onClick={() => setOpen(false)} className="text-lg font-bold flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg flex items-center justify-center">📦</span>
                Mis Pedidos
              </Link>
              <Link href="/profile" onClick={() => setOpen(false)} className="text-lg font-bold flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg flex items-center justify-center">👤</span>
                Mi Perfil
              </Link>
            </>
          )}

          <div className="h-px bg-[var(--border)] w-full my-2"></div>

          <Link href="/cart" onClick={() => setOpen(false)} className="text-lg font-bold flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg flex items-center justify-center">🛒</span>
              Carrito
            </div>
            {totalItems > 0 && (
              <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full">{totalItems} items</span>
            )}
          </Link>

          {user?.is_admin && (
            <Link href="/admin" onClick={() => setOpen(false)} className="text-lg font-bold flex items-center gap-3 text-purple-600 dark:text-purple-400">
              <span className="w-8 h-8 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-lg flex items-center justify-center">👑</span>
              Admin Panel
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className="text-lg font-bold flex items-center gap-3"
          >
            <span className="w-8 h-8 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
              {isDark ? <FaSun size={16} /> : <FaMoon size={16} />}
            </span>
            {isDark ? "Modo Claro" : "Modo Oscuro"}
          </button>

          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
              className="mt-4 w-full py-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2"
            >
              <FaSignOutAlt />
              Cerrar Sesión
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-4 w-full py-4 bg-gray-900 dark:bg-zinc-800 text-white rounded-2xl font-bold text-center"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
