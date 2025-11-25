import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full flex flex-col items-center bg-[var(--background)] min-h-screen pb-20 -mt-10">

      {/* HERO BANNER */}
      <section className="w-full bg-[var(--accent)] py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-[var(--foreground)] mb-8 md:mb-0">
            <h1 className="text-3xl md:text-5xl font-title font-semibold mb-4">
              Creá tu taza <br /> <span className="font-bold">única y original</span>
            </h1>
            <p className="text-lg md:text-xl mb-6 font-text font-light">
              Personalizala con tus fotos, frases o diseños favoritos.
            </p>
            <Link
              href="/customizer"
              className="bg-[var(--foreground)] text-[var(--background)] font-text font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-all shadow-md inline-block"
            >
              Diseñar ahora
            </Link>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md h-64 md:h-80 bg-[var(--background)] rounded-lg shadow-lg overflow-hidden border border-[var(--border)]">
              <Image
                src="https://images.pexels.com/photos/1415550/pexels-photo-1415550.jpeg"
                alt="Banner Tazas"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>


      {/* SECCIÓN DE PRODUCTOS */}
      <section className="max-w-6xl w-full px-4 mt-12">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-title font-medium text-[var(--foreground)]">
            PRODUCTOS DESTACADOS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

          {/* Card 1 */}
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
            <div className="relative h-56 w-full border-b border-[var(--border)]">
              <Image
                src="https://images.pexels.com/photos/1415550/pexels-photo-1415550.jpeg"
                alt="Taza Minimalista"
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="text-2xl font-mono font-medium text-[var(--foreground)]">$ 3.500</h3>
              <p className="text-sm text-[var(--foreground)] opacity-70 font-text mt-2 line-clamp-2">Taza Minimalista Cerámica Premium Personalizable</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
            <div className="relative h-56 w-full border-b border-[var(--border)]">
              <Image
                src="https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg"
                alt="Taza con Foto"
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="text-2xl font-mono font-medium text-[var(--foreground)]">$ 4.200</h3>
              <p className="text-sm text-[var(--foreground)] opacity-70 font-text mt-2 line-clamp-2">Taza Personalizada Con Tu Foto Full Color</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
            <div className="relative h-56 w-full border-b border-[var(--border)]">
              <Image
                src="https://images.pexels.com/photos/326682/pexels-photo-326682.jpeg"
                alt="Taza Ilustrada"
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="text-2xl font-mono font-medium text-[var(--foreground)]">$ 3.900</h3>
              <p className="text-sm text-[var(--foreground)] opacity-70 font-text mt-2 line-clamp-2">Taza Ilustrada Diseño Exclusivo Artístico</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
            <div className="relative h-56 w-full border-b border-[var(--border)]">
              <Image
                src="https://images.pexels.com/photos/1207918/pexels-photo-1207918.jpeg"
                alt="Set de Tazas"
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="text-2xl font-mono font-medium text-[var(--foreground)]">$ 7.500</h3>
              <p className="text-sm text-[var(--foreground)] opacity-70 font-text mt-2 line-clamp-2">Set X2 Tazas Pareja Personalizadas Amor</p>
            </div>
          </div>

        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="max-w-6xl w-full px-4 mt-12 mb-10">
        <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">💳</div>
            <div>
              <h3 className="text-lg font-title font-semibold text-[var(--foreground)]">Pagá con tarjeta o en efectivo</h3>
              <Link href="#" className="text-[var(--accent)] text-sm font-text hover:underline">Ver medios de pago</Link>
            </div>
          </div>

          <div className="w-px h-12 bg-[var(--border)] hidden md:block"></div>

          <div className="flex items-center gap-4">
            <div className="text-4xl">📦</div>
            <div>
              <h3 className="text-lg font-title font-semibold text-[var(--foreground)]">Envío rápido a todo el país</h3>
              <Link href="#" className="text-[var(--accent)] text-sm font-text hover:underline">Ver costos y tiempos</Link>
            </div>
          </div>

          <div className="w-px h-12 bg-[var(--border)] hidden md:block"></div>

          <div className="flex items-center gap-4">
            <div className="text-4xl">🛡️</div>
            <div>
              <h3 className="text-lg font-title font-semibold text-[var(--foreground)]">Compra protegida</h3>
              <Link href="#" className="text-[var(--accent)] text-sm font-text hover:underline">Se abren en una nueva pestaña</Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
