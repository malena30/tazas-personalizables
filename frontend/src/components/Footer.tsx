export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-20 pt-10 pb-6">
      <div className="max-w-6xl mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Columna 1 */}
          <div>
            <h3 className="font-semibold text-[#333] mb-4">Acerca de</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:underline">Tazas.shop</a></li>
              <li><a href="#" className="hover:underline">Tendencias</a></li>
              <li><a href="#" className="hover:underline">Sustentabilidad</a></li>
            </ul>
          </div>

          {/* Columna 2 */}
          <div>
            <h3 className="font-semibold text-[#333] mb-4">Ayuda</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:underline">Comprar</a></li>
              <li><a href="#" className="hover:underline">Vender</a></li>
              <li><a href="#" className="hover:underline">Resolución de problemas</a></li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div>
            <h3 className="font-semibold text-[#333] mb-4">Redes sociales</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:underline">Instagram</a></li>
              <li><a href="#" className="hover:underline">Twitter</a></li>
              <li><a href="#" className="hover:underline">Facebook</a></li>
            </ul>
          </div>

          {/* Columna 4 */}
          <div>
            <h3 className="font-semibold text-[#333] mb-4">Mi cuenta</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:underline">Resumen</a></li>
              <li><a href="#" className="hover:underline">Favoritos</a></li>
              <li><a href="#" className="hover:underline">Mis compras</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 text-xs text-gray-400">
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