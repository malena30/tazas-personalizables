export default function Footer() {
  return (
    <footer className="w-full bg-[var(--background)] border-t border-[var(--border)] mt-20 pt-10 pb-6">
      <div className="max-w-6xl mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Columna 1 */}
          <div>
            <h3 className="font-title font-semibold text-[var(--foreground)] mb-4">Acerca de</h3>
            <ul className="space-y-2 text-sm text-[var(--foreground)] opacity-60 font-text">
              <li><a href="#" className="hover:text-[var(--accent)] transition-colors">Tazas.shop</a></li>
              <li><a href="#" className="hover:text-[var(--accent)] transition-colors">Tendencias</a></li>
              <li><a href="#" className="hover:text-[var(--accent)] transition-colors">Sustentabilidad</a></li>
            </ul>
          </div>

          {/* Columna 2 */}
          <div>
            <h3 className="font-title font-semibold text-[var(--foreground)] mb-4">Ayuda</h3>
            <ul className="space-y-2 text-sm text-[var(--foreground)] opacity-60 font-text">
              <li><a href="#" className="hover:text-[var(--accent)] transition-colors">Comprar</a></li>
              <li><a href="#" className="hover:text-[var(--accent)] transition-colors">Vender</a></li>
              <li><a href="#" className="hover:text-[var(--accent)] transition-colors">Resolución de problemas</a></li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div>
            <h3 className="font-title font-semibold text-[var(--foreground)] mb-4">Redes sociales</h3>
            <ul className="space-y-2 text-sm text-[var(--foreground)] opacity-60 font-text">
              <li><a href="#" className="hover:text-[var(--accent)] transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-[var(--accent)] transition-colors">Tik Tok</a></li>
            </ul>
          </div>

          {/* Columna 4 */}
          <div>
            <h3 className="font-title font-semibold text-[var(--foreground)] mb-4">Mi cuenta</h3>
            <ul className="space-y-2 text-sm text-[var(--foreground)] opacity-60 font-text">
              <li><a href="#" className="hover:text-[var(--accent)] transition-colors">Resumen</a></li>
              <li><a href="#" className="hover:text-[var(--accent)] transition-colors">Favoritos</a></li>
              <li><a href="#" className="hover:text-[var(--accent)] transition-colors">Mis compras</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-6 text-xs text-[var(--foreground)] opacity-50 font-text">
          <p className="mb-2">
            © {new Date().getFullYear()} Tazas.shop S.R.L.
          </p>
          <p>
            Av. Siempreviva 742, Piso 4, CP 1234, Buenos Aires, Argentina
          </p>
        </div>
      </div>
    </footer>
  );
}
