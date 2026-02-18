"use client";

import { useState, useEffect } from "react";
import { LuShoppingBag, LuMessageSquare, LuShapes, LuArrowLeft } from "react-icons/lu";
import ProductSkeleton from "@/components/ProductSkeleton";
import { useCartStore } from "@/store/cartStore";
import { getProducts } from "@/lib/api";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import CollectionCard from "@/components/CollectionCard";

interface UIProduct {
  id: string;
  slug?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  image_fit?: 'contain' | 'cover';
  image_scale?: number;
  category?: 'frases' | 'formas';
}

export default function ProductsPage() {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<'frases' | 'formas' | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await getProducts();
      const cartProducts = productsData.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description || "",
        price: p.price,
        image: p.image_url || "",
        image_fit: p.image_fit,
        image_scale: p.image_scale,
        category: p.category as any,
      }));
      setProducts(cartProducts);
      setError("");
    } catch (err: any) {
      setError(err.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: UIProduct) => {
    addToCart({ ...product, quantity: 1 });
    setTooltipVisible(product.id);
    setTimeout(() => setTooltipVisible(null), 2000);
  };

  const filteredProducts = selectedCollection
    ? products.filter(p => p.category === selectedCollection)
    : products;

  const countFor = (category: 'frases' | 'formas') =>
    products.filter(p => p.category === category).length;

  return (
    <main className="w-full bg-[var(--cream)] min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          {selectedCollection ? (
            <div className="space-y-6">
              <button
                onClick={() => setSelectedCollection(null)}
                className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-[var(--foreground)] transition-colors"
              >
                <LuArrowLeft size={16} />
                Volver a Colecciones
              </button>
              <h1 className="text-5xl md:text-6xl font-title font-black text-[var(--foreground)] tracking-tighter capitalize">
                Colección <span className="text-[var(--accent)]">{selectedCollection}</span>
              </h1>
            </div>
          ) : (
            <>
              <h1 className="text-5xl md:text-6xl font-title font-black text-[var(--foreground)] tracking-tighter mb-6">
                Nuestras <span className="text-[var(--accent)]">Colecciones</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                Elegí el estilo que mejor te acompañe. Frases inspiradoras o formas geométricas con personalidad.
              </p>
            </>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-6 rounded-3xl flex items-center gap-4">
            <LuShoppingBag />
            <p className="font-bold">{error}</p>
          </div>
        )}

        {!loading && !error && !selectedCollection && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <CollectionCard
              title="Frases"
              description="Tazas con mensajes que inspiran y acompañan tu día."
              itemCount={countFor('frases')}
              icon={<LuMessageSquare size={32} />}
              onClick={() => setSelectedCollection('frases')}
            />
            <CollectionCard
              title="Formas"
              description="Diseños geométricos y abstractos con un toque minimalista."
              itemCount={countFor('formas')}
              icon={<LuShapes size={32} />}
              onClick={() => setSelectedCollection('formas')}
            />
          </div>
        )}

        {!loading && !error && selectedCollection && filteredProducts.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-[var(--border)] shadow-xl shadow-black/5">
            <div className="w-20 h-20 bg-[var(--cream)] text-[var(--cream-dark)] rounded-full flex items-center justify-center mx-auto mb-8">
              <LuShoppingBag size={40} />
            </div>
            <h3 className="text-3xl font-black text-zinc-900 tracking-tighter">
              Aún no hay tazas en esta colección
            </h3>
            <p className="text-zinc-600 mt-4 max-w-xs mx-auto font-medium">
              Estamos diseñando nuevas piezas. ¡Chequeá la otra colección!
            </p>
          </div>
        )}

        {!loading && !error && selectedCollection && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                image={product.image}
                description={product.description}
                image_fit={product.image_fit}
                image_scale={product.image_scale}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
