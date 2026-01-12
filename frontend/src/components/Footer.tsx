import { FaInstagram, FaTwitter, FaFacebook, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-zinc-950 border-t border-[var(--border)] mt-32 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="text-2xl font-title font-black text-[var(--foreground)] tracking-tighter">
              Tazas<span className="text-blue-600">.shop</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              Creamos momentos únicos a través de tazas personalizadas de alta calidad. Tu diseño, tu estilo, tu taza.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-50 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-50 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-50 transition-all">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-50 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-800 hover:bg-blue-50 transition-all">
                <FaFacebook size={18} />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--foreground)] mb-6">Tienda</h3>
            <ul className="space-y-4 text-sm font-bold text-gray-500 dark:text-gray-400">
              <li><Link href="/products" className="hover:text-blue-600 transition-colors">Todos los Productos</Link></li>
              <li><Link href="/customizer" className="hover:text-blue-600 transition-colors">Personalizar</Link></li>
              <li><Link href="/products?category=ceramica" className="hover:text-blue-600 transition-colors">Tazas de Cerámica</Link></li>
              <li><Link href="/products?category=plastico" className="hover:text-blue-600 transition-colors">Tazas de Plástico</Link></li>
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--foreground)] mb-6">Ayuda</h3>
            <ul className="space-y-4 text-sm font-bold text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Preguntas Frecuentes</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Envíos y Devoluciones</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--foreground)] mb-6">Contacto</h3>
            <ul className="space-y-4 text-sm font-bold text-gray-500 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-blue-600" />
                <span>Av. Siempreviva 742, Piso 4<br />CABA, Argentina</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-blue-600" />
                <a href="mailto:hola@tazas.shop" className="hover:text-blue-600 transition-colors">hola@tazas.shop</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <p>© {new Date().getFullYear()} Tazas.shop S.R.L. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}