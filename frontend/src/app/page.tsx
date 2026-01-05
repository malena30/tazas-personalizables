"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import TestimonialCard from "@/components/TestimonialCard";
import SimpleMugHero from "@/components/SimpleMugHero";
import ProductSkeleton from "@/components/ProductSkeleton";
import { getProducts, Product } from "@/lib/api";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.slice(0, 4)); // Mostrar solo los primeros 4
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <main className="w-full bg-[var(--background)] min-h-screen">

      {/* HERO SECTION */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center md:text-left z-10">
            <h1 className="text-5xl md:text-7xl font-title font-extrabold text-[var(--foreground)] mb-6 leading-tight">
              Diseña tu
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Taza Perfecta
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--foreground)] opacity-80 mb-8 font-text">
              Personaliza con tus fotos, diseños o frases favoritas. Única como vos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/customizer"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                🎨 Diseñar Ahora
              </Link>
              <Link
                href="#productos"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-[var(--foreground)] rounded-full font-semibold text-lg border-2 border-[var(--border)] hover:border-purple-600 hover:scale-105 transition-all duration-300"
              >
                Ver Productos
              </Link>
            </div>
          </div>

          {/* Hero Image (3D) */}
          <div className="relative z-10 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
              <SimpleMugHero />
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="w-full py-12 bg-white dark:bg-gray-900 border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">+1.5k</p>
              <p className="text-sm text-[var(--foreground)] opacity-60 uppercase tracking-widest mt-2">Clientes</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">+500</p>
              <p className="text-sm text-[var(--foreground)] opacity-60 uppercase tracking-widest mt-2">Diseños</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-pink-600 dark:text-pink-400">24h</p>
              <p className="text-sm text-[var(--foreground)] opacity-60 uppercase tracking-widest mt-2">Producción</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">100%</p>
              <p className="text-sm text-[var(--foreground)] opacity-60 uppercase tracking-widest mt-2">Garantía</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="w-full py-20 px-6 bg-[var(--accent)]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-title font-bold text-center text-[var(--foreground)] mb-4">
            ¿Cómo Funciona?
          </h2>
          <p className="text-center text-[var(--foreground)] opacity-70 text-lg mb-16">
            Tres simples pasos para tu taza personalizada
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-full flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                ✏️
              </div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3">
                1. Diseña
              </h3>
              <p className="text-[var(--foreground)] opacity-70">
                Usa nuestro editor intuitivo para agregar textos, imágenes y elementos únicos
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-full flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                🛒
              </div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3">
                2. Compra
              </h3>
              <p className="text-[var(--foreground)] opacity-70">
                Agrega al carrito y completa tu pedido de forma segura con Mercado Pago
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700 rounded-full flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                📦
              </div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3">
                3. Recibe
              </h3>
              <p className="text-[var(--foreground)] opacity-70">
                Tu taza personalizada llega a tu casa en pocos días. ¡Listo para disfrutar!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section id="productos" className="w-full py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-title font-bold text-center text-[var(--foreground)] mb-4">
            Productos Destacados
          </h2>
          <p className="text-center text-[var(--foreground)] opacity-70 text-lg mb-16">
            Las tazas más populares de nuestra tienda
          </p>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image_url || ""}
                  description={product.description || ""}
                />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-block px-8 py-3 border-2 border-[var(--border)] rounded-full font-semibold hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all"
            >
              Ver Todo el Catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="w-full py-20 px-6 bg-[var(--accent)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-title font-bold text-center text-[var(--foreground)] mb-12">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-4">
            {[
              { q: "¿Cuánto tarda el envío?", a: "El tiempo de producción es de 24-48h. El envío suele tardar entre 2 y 5 días hábiles dependiendo de tu ubicación." },
              { q: "¿Las tazas son aptas para microondas?", a: "¡Sí! Todas nuestras tazas de cerámica premium son aptas para microondas y lavavajillas." },
              { q: "¿Puedo subir mis propias fotos?", a: "Absolutamente. Nuestro personalizador te permite subir imágenes en alta resolución para obtener el mejor resultado." },
              { q: "¿Hacen ventas por mayor?", a: "Sí, ofrecemos descuentos especiales para eventos corporativos, souvenirs o revendedores a partir de 12 unidades." }
            ].map((item, i) => (
              <details key={i} className="group bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden">
                <summary className="p-6 cursor-pointer font-bold text-[var(--foreground)] flex justify-between items-center list-none">
                  {item.q}
                  <span className="text-xl group-open:rotate-180 transition-transform">↓</span>
                </summary>
                <div className="px-6 pb-6 text-[var(--foreground)] opacity-70">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="w-full py-20 px-6 bg-gradient-to-b from-[var(--background)] to-[var(--accent)]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-title font-bold text-center text-[var(--foreground)] mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-center text-[var(--foreground)] opacity-70 text-lg mb-16">
            Más de 1,000 clientes satisfechos
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              name="María González"
              rating={5}
              comment="¡Increíble calidad! La taza quedó exactamente como la diseñé. El envío fue súper rápido y el empaque muy cuidado. 100% recomendado."
            />
            <TestimonialCard
              name="Juan Pérez"
              rating={5}
              comment="Compré un set para regalar en un aniversario y fue un éxito total. La impresión es de alta calidad y los colores muy vivos."
            />
            <TestimonialCard
              name="Laura Martínez"
              rating={5}
              comment="Me encanta el diseñador, es muy fácil de usar. Pude crear una taza personalizada para mi mamá en minutos. ¡Le encantó!"
            />
          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="w-full py-20 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-title font-bold mb-4">¡No te pierdas nada!</h2>
          <p className="text-white/80 mb-8">Suscribite para recibir ofertas exclusivas y nuevos templates de diseño.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Tu email"
              className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold hover:bg-purple-50 transition-all">
              Suscribirme
            </button>
          </form>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="w-full py-24 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-title font-bold text-white mb-6">
            ¿Listo para crear tu taza ideal?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Empieza a diseñar ahora y tené tu taza única en pocos días
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/customizer"
              className="px-10 py-5 bg-white text-purple-600 rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
            >
              Comenzar a Diseñar →
            </Link>
            <Link
              href="/products"
              className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-full font-bold text-xl hover:bg-white hover:text-purple-600 transition-all duration-300"
            >
              Ver Catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* Add animations to globals.css */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}
