export default function Home() {
  return (
    <main className="w-full flex flex-col items-center">

      {/* HERO CON IMAGEN GRANDE */}
<section
  className="relative w-full h-[85vh] bg-cover bg-center flex items-center justify-center"
  style={{
    backgroundImage:
      "url('https://images.pexels.com/photos/1415550/pexels-photo-1415550.jpeg')"
  }}
>
  {/* Oscurecido para que el texto se vea */}
  <div className="absolute inset-0 bg-black/40"></div>

  {/* Contenido del Hero */}
  <div className="relative z-10 text-center text-white px-6 max-w-2xl">
    <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
      Creá tu Taza Personalizada
    </h1>

    <p className="text-lg md:text-2xl mt-4 mb-8 drop-shadow-md">
      Convertí tus fotos, frases o dibujos en una taza única.
    </p>

    <a
      href="/customizer"
      className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-all"
    >
      Diseñar ahora
    </a>
  </div>
</section>


      {/* PRODUCTOS DESTACADOS */}
      <section className="max-w-6xl w-full px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          Modelos más vendidos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Card 1 */}
          <div className="bg-white shadow rounded-xl p-4 hover:scale-105 transition">
            <img
              src="https://images.pexels.com/photos/1415550/pexels-photo-1415550.jpeg"
              className="rounded-lg h-60 w-full object-cover"
            />
            <h3 className="text-xl font-semibold mt-4 text-black">Taza Minimalista</h3>
            <p className="text-gray-600 my-2">Perfecta para frases simples.</p>
            <button className="bg-blue-600 text-white font-medium w-full py-2 rounded-lg mt-2 hover:bg-blue-700">
              Ver detalles
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white shadow rounded-xl p-4 hover:scale-105 transition">
            <img
              src="https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg"
              className="rounded-lg h-60 w-full object-cover"
            />
            <h3 className="text-xl font-semibold mt-4 text-black">Taza con Foto</h3>
            <p className="text-gray-600 my-2">Ideal para regalos personalizados.</p>
            <button className="bg-blue-600 text-white font-medium w-full py-2 rounded-lg mt-2 hover:bg-blue-700">
              Ver detalles
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-white shadow rounded-xl p-4 hover:scale-105 transition">
            <img
              src="https://images.pexels.com/photos/326682/pexels-photo-326682.jpeg"
              className="rounded-lg h-60 w-full object-cover"
            />
            <h3 className="text-xl font-semibold mt-4 text-black">Taza Ilustrada</h3>
            <p className="text-gray-600 my-2">Para diseños artísticos o dibujos.</p>
            <button className="bg-blue-600 text-white font-medium w-full py-2 rounded-lg mt-2 hover:bg-blue-700">
              Ver detalles
            </button>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="w-full bg-gray-100 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-black">
          ¿Por qué elegirnos?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">

          <div>
            <h3 className="text-xl font-semibold text-black">🎨 Calidad de impresión</h3>
            <p className="mt-2 text-gray-600">
              Colores nítidos, resistentes al lavado.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-black">🚚 Envíos seguros</h3>
            <p className="mt-2 text-gray-600">
              Llegan protegidas y sin golpes.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-black">⚡ Personalización rápida</h3>
            <p className="mt-2 text-gray-600">
              Diseñá tu taza en minutos.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}
