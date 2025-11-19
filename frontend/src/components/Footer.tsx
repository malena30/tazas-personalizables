export default function Footer() {
    return (
      <footer className="w-full bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
  
          {/* LOGO + DESCRIPCIÓN */}
          <div>
            <h2 className="text-2xl font-bold mb-3">Tazas.shop</h2>
            <p className="text-gray-300">
              Diseñá tu taza personalizada en minutos. Calidad premium y envíos a todo el país.
            </p>
          </div>
  
          {/* NAVEGACIÓN */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Navegación</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/products" className="hover:text-white">Productos</a></li>
              <li><a href="/customizer" className="hover:text-white">Personalizar</a></li>
              <li><a href="/cart" className="hover:text-white">Carrito</a></li>
            </ul>
          </div>
  
          {/* REDES SOCIALES */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Seguinos</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white">Instagram</a></li>
              <li><a href="#" className="hover:text-white">TikTok</a></li>
              <li><a href="#" className="hover:text-white">Facebook</a></li>
            </ul>
          </div>
  
        </div>
  
        {/* COPYRIGHT */}
        <div className="w-full text-center text-gray-500 mt-10 border-t border-gray-700 pt-6">
          © {new Date().getFullYear()} Tazas.shop — Todos los derechos reservados.
        </div>
      </footer>
    );
  }
  