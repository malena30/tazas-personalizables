"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LuInstagram, LuFacebook, LuMail, LuPhone } from "react-icons/lu";

export default function Footer() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();

    // Configurar un observer para detectar cambios en la clase 'dark'
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <footer className="w-full border-t border-[var(--border)] pt-24 pb-12 px-6 bg-[var(--cream)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src="/LOGO.png"
                  alt="KYATHOS Logo"
                  width={150}
                  height={50}
                  style={{
                    height: '50px',
                    width: 'auto',
                    filter: isDark ? 'none' : 'invert(1) brightness(0.2)'
                  }}
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-title font-black tracking-tighter mt-2 text-gray-800 dark:text-[var(--foreground)]">
                KYATHOS <span className="font-text font-light text-lg tracking-widest uppercase ml-1 text-[var(--accent)]">tazas</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-[var(--foreground)] opacity-60">
              Transformamos tus ideas en piezas únicas. Calidad premium y personalización sin límites para tus momentos especiales.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-all shadow-sm bg-[var(--accent)]">
                <LuInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-all shadow-sm bg-[var(--accent)]">
                <LuFacebook size={18} />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-[var(--gold)]">Tienda</h4>
            <ul className="space-y-4 text-sm font-bold text-[var(--foreground)] opacity-70">
              <li><Link href="/products" className="hover:text-[var(--accent)] transition-colors">Todos los Productos</Link></li>
              <li><Link href="/customizer" className="hover:text-[var(--accent)] transition-colors">Personalizar</Link></li>
              <li><Link href="/products?category=ceramica" className="hover:text-[var(--accent)] transition-colors">Tazas de Cerámica</Link></li>
              <li><Link href="/products?category=plastico" className="hover:text-[var(--accent)] transition-colors">Tazas de Plástico</Link></li>
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-[var(--gold)]">Ayuda</h4>
            <ul className="space-y-4 text-sm font-bold text-[var(--foreground)] opacity-70">
              <li><Link href="/orders" className="hover:text-[var(--accent)] transition-colors">Seguir mi Pedido</Link></li>
              <li><Link href="/terms" className="hover:text-[var(--accent)] transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/privacy" className="hover:text-[var(--accent)] transition-colors">Política de Privacidad</Link></li>
              <li><Link href="/faq" className="hover:text-[var(--accent)] transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--accent)] transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-[var(--gold)]">Contacto</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[var(--accent)]/10 text-[var(--accent)]">
                  <LuMail size={14} />
                </div>
                <div className="text-sm">
                  <p className="mb-1 text-[var(--foreground)] opacity-50">Email</p>
                  <a href="mailto:tazas.personalizables@outlook.com" className="font-bold hover:text-[var(--accent)] transition-colors text-[var(--foreground)]">tazas.personalizables@outlook.com</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[var(--accent)]/10 text-[var(--accent)]">
                  <LuPhone size={14} />
                </div>
                <div className="text-sm">
                  <p className="mb-1 text-[var(--foreground)] opacity-50">Teléfono</p>
                  <a href="tel:+542494243094" className="font-bold hover:text-[var(--accent)] transition-colors text-[var(--foreground)]">+54 249 4243094</a>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest text-[var(--foreground)] opacity-50">
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
