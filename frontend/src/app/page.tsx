"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import TestimonialCard from "@/components/TestimonialCard";
import SimpleMugHero from "@/components/SimpleMugHero";
import ProductSkeleton from "@/components/ProductSkeleton";
import { getProducts, Product } from "@/lib/api";
import { LuPalette, LuShoppingBag, LuArrowRight, LuStar, LuShieldCheck, LuTruck } from "react-icons/lu";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.slice(0, 4)); // Mostrar solo los primeros 4
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <main className="w-full bg-[var(--background)] min-h-screen">

      {/* HERO SECTION */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[var(--background)]">
        {/* Subtle background texture/elements */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent)] rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent)] rounded-full blur-[120px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-xs font-black uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <LuStar size={10} />
              <span>Calidad Premium Garantizada</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-title font-black text-[var(--foreground)] mb-8 leading-[0.9] tracking-tighter animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Lo cotidiano, <br />
              <span className="text-[var(--accent)]">con intención.</span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--foreground)] opacity-60 mb-12 font-text max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Personaliza cada detalle y crea una pieza única que hable de vos. Calidad excepcional en cada sorbo.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Link
                href="/customizer"
                className="px-10 py-5 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black text-lg shadow-2xl shadow-black/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                <LuPalette size={20} />
                Diseñar Ahora
              </Link>
              <Link
                href="/products"
                className="px-10 py-5 bg-transparent text-[var(--foreground)] rounded-2xl font-black text-lg border-2 border-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all flex items-center justify-center gap-3"
              >
                Ver Catálogo
                <LuArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Hero Image (3D) */}
          <div className="relative z-10 flex justify-center animate-in fade-in zoom-in duration-1000 delay-200">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 bg-[var(--accent)]/20 rounded-full filter blur-[100px] animate-pulse"></div>
              <SimpleMugHero />
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="w-full py-16 bg-zinc-900 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="space-y-2">
              <p className="text-5xl font-black text-white tracking-tighter">+1.5k</p>
              <p className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Clientes Felices</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-black text-white tracking-tighter">+500</p>
              <p className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Diseños Únicos</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-black text-white tracking-tighter">24h</p>
              <p className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Producción Express</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-black text-white tracking-tighter">100%</p>
              <p className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Garantía Total</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="w-full py-32 px-6 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-5xl md:text-6xl font-title font-black text-white tracking-tighter mb-6">
              ¿Cómo <span className="text-[var(--accent)]">Funciona?</span>
            </h2>
            <p className="text-white/80 text-xl leading-relaxed">
              Tres simples pasos para transformar una idea en tu taza favorita.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="relative p-10 bg-zinc-900 rounded-[3rem] border border-white/10 group hover:border-[var(--accent)] transition-all duration-500">
              <div className="w-16 h-16 mb-8 bg-white text-zinc-900 rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl group-hover:scale-110 transition-transform duration-300">
                01
              </div>
              <h3 className="text-2xl font-black text-white mb-4">
                Diseña
              </h3>
              <p className="text-white leading-relaxed">
                Usa nuestro editor intuitivo para agregar textos, imágenes y elementos únicos que reflejen tu personalidad.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-10 bg-white dark:bg-zinc-900 rounded-[3rem] border border-[var(--border)] group hover:border-[var(--accent)] transition-all duration-500">
              <div className="w-16 h-16 mb-8 bg-[var(--accent)] text-[var(--background)] rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl group-hover:scale-110 transition-transform duration-300">
                02
              </div>
              <h3 className="text-2xl font-black text-white mb-4">
                Compra
              </h3>
              <p className="text-white leading-relaxed">
                Agrega al carrito y completa tu pedido de forma segura con Mercado Pago. Aceptamos todas las tarjetas.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-10 bg-zinc-900 rounded-[3rem] border border-white/10 group hover:border-[var(--accent)] transition-all duration-500">
              <div className="w-16 h-16 mb-8 bg-white text-zinc-900 rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl group-hover:scale-110 transition-transform duration-300">
                03
              </div>
              <h3 className="text-2xl font-black text-white mb-4">
                Recibe
              </h3>
              <p className="text-white leading-relaxed">
                Tu taza personalizada llega a tu puerta en pocos días, protegida y lista para ser estrenada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section id="productos" className="w-full py-32 px-6 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-6xl font-title font-black text-[var(--foreground)] tracking-tighter mb-6">
                Productos <span className="text-[var(--accent)]">Destacados</span>
              </h2>
              <p className="text-white text-xl leading-relaxed">
                Una selección de nuestras piezas más queridas, listas para ser el lienzo de tu creatividad.
              </p>
            </div>
            <Link
              href="/products"
              className="px-8 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black text-sm hover:scale-[1.05] transition-all shadow-xl shadow-black/10"
            >
              Ver Todo el Catálogo
            </Link>
          </div>

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
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image_url || ""}
                  description={product.description || ""}
                  onAddToCart={() => { }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="w-full py-24 px-6 bg-zinc-950 border-y border-white/10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[var(--accent)]/10 text-[var(--accent)] rounded-2xl flex items-center justify-center shrink-0">
              <LuTruck size={24} />
            </div>
            <div>
              <h4 className="font-black text-white text-lg">Envío Nacional</h4>
              <p className="text-sm text-white/60">Llegamos a todo el país con seguimiento en tiempo real.</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[var(--accent)]/10 text-[var(--accent)] rounded-2xl flex items-center justify-center shrink-0">
              <LuShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-black text-white text-lg">Pago 100% Seguro</h4>
              <p className="text-sm text-white/60">Tus datos están protegidos con encriptación de grado bancario.</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[var(--accent)]/10 text-[var(--accent)] rounded-2xl flex items-center justify-center shrink-0">
              <LuStar size={24} />
            </div>
            <div>
              <h4 className="font-black text-white text-lg">Calidad Premium</h4>
              <p className="text-sm text-white/60">Solo usamos materiales de alta gama para resultados duraderos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="w-full py-32 px-6 bg-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-5xl md:text-6xl font-title font-black text-white tracking-tighter mb-6">
              Lo que dicen nuestros <span className="text-[var(--accent)]">clientes</span>
            </h2>
            <p className="text-white/60 text-xl leading-relaxed">
              Más de 1,000 personas ya disfrutan de sus tazas personalizadas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
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

      {/* FINAL CTA SECTION */}
      <section className="w-full py-32 px-6">
        <div className="max-w-5xl mx-auto bg-[var(--foreground)] rounded-[4rem] p-16 md:p-24 text-center text-[var(--background)] shadow-2xl shadow-black/20 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

          <h2 className="text-5xl md:text-7xl font-title font-black mb-8 relative z-10 tracking-tighter leading-none">
            ¿Listo para crear tu <br />
            <span className="text-[var(--accent)]">taza ideal?</span>
          </h2>
          <p className="text-xl md:text-2xl text-[var(--background)] opacity-60 mb-12 relative z-10 max-w-2xl mx-auto">
            Empieza a diseñar ahora y tené tu taza única en pocos días. El regalo perfecto está a un clic.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
            <Link
              href="/customizer"
              className="px-12 py-6 bg-[var(--accent)] text-[var(--background)] rounded-2xl font-black text-xl shadow-2xl shadow-black/10 hover:scale-[1.05] active:scale-[0.95] transition-all"
            >
              Comenzar a Diseñar
            </Link>
            <Link
              href="/products"
              className="px-12 py-6 bg-transparent border-2 border-[var(--background)] text-[var(--background)] rounded-2xl font-black text-xl hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-all"
            >
              Ver Catálogo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
