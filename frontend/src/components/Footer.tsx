"use client";

import Link from "next/link";
import Image from "next/image";
import { LuInstagram, LuTwitter, LuFacebook, LuMail, LuPhone, LuMapPin, LuShoppingBag } from "react-icons/lu";

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-zinc-950 border-t border-[var(--border)] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/LOGO.png"
                alt="KYATHOS Logo"
                width={150}
                height={50}
                style={{ height: '50px', width: 'auto' }}
                className="object-contain"
              />
              <span className="text-2xl font-title font-black text-[var(--foreground)] tracking-tighter mt-2">
                KYATHOS <span className="text-[var(--accent)] font-text font-light text-lg tracking-widest uppercase ml-1">tazas</span>
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-xs">
              Transformamos tus ideas en piezas únicas. Calidad premium y personalización sin límites para tus momentos especiales.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-50 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-gray-400 hover:text-[var(--accent)] hover:bg-white dark:hover:bg-zinc-800 transition-all border border-[var(--border)]">
                <LuInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-50 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-gray-400 hover:text-[var(--accent)] hover:bg-white dark:hover:bg-zinc-800 transition-all border border-[var(--border)]">
                <LuFacebook size={18} />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-8">Tienda</h4>
            <ul className="space-y-4 text-sm font-bold text-[var(--foreground)]">
              <li><Link href="/products" className="hover:text-[var(--accent)] transition-colors">Todos los Productos</Link></li>
              <li><Link href="/customizer" className="hover:text-[var(--accent)] transition-colors">Personalizar</Link></li>
              <li><Link href="/products?category=ceramica" className="hover:text-[var(--accent)] transition-colors">Tazas de Cerámica</Link></li>
              <li><Link href="/products?category=plastico" className="hover:text-[var(--accent)] transition-colors">Tazas de Plástico</Link></li>
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-8">Ayuda</h4>
            <ul className="space-y-4 text-sm font-bold text-[var(--foreground)]">
              <li><Link href="/orders" className="hover:text-[var(--accent)] transition-colors">Seguir mi Pedido</Link></li>
              <li><Link href="/terms" className="hover:text-[var(--accent)] transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/privacy" className="hover:text-[var(--accent)] transition-colors">Política de Privacidad</Link></li>
              <li><Link href="/faq" className="hover:text-[var(--accent)] transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--accent)] transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-8">Contacto</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[var(--accent)]/10 text-[var(--accent)] rounded-lg flex items-center justify-center shrink-0">
                  <LuMail size={14} />
                </div>
                <div className="text-sm">
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Email</p>
                  <a href="mailto:tazas.personalizables@outlook.com" className="font-bold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors">tazas.personalizables@outlook.com</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[var(--accent)]/10 text-[var(--accent)] rounded-lg flex items-center justify-center shrink-0">
                  <LuPhone size={14} />
                </div>
                <div className="text-sm">
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Teléfono</p>
                  <a href="tel:+542494243094" className="font-bold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors">+54 249 4243094</a>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} KYATHOS tazas. Hecho con ❤️ en Argentina.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-[var(--accent)] transition-colors">Privacidad</Link>
            <Link href="/terms" className="hover:text-[var(--accent)] transition-colors">Términos</Link>
            <Link href="#" className="hover:text-[var(--accent)] transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
