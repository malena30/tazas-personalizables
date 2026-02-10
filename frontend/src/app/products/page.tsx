"use client";

import { useState, useEffect } from "react";
import { LuShoppingBag } from "react-icons/lu";
import ProductSkeleton from "@/components/ProductSkeleton";
import { useCartStore } from "@/store/cartStore";
import { getProducts } from "@/lib/api";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";

interface UIProduct {
  id: string;
  slug?: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <main className="w-full bg-[var(--cream)] min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-title font-black text-[var(--foreground)] tracking-tighter mb-6">
            Nuestras <span className="text-[var(--accent)]">Tazas</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
            Explora nuestra colección de tazas premium. Diseños exclusivos listos para acompañar tus mejores momentos.
          </p>
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

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-[var(--border)] shadow-xl shadow-black/5">
            <div className="w-20 h-20 bg-[var(--cream)] text-[var(--cream-dark)] rounded-full flex items-center justify-center mx-auto mb-8">
              <LuShoppingBag size={40} />
            </div>
            <h3 className="text-3xl font-black text-zinc-900 tracking-tighter" style={{ color: '#18181b' }}>
              No hay productos disponibles
            </h3>
            <p className="text-zinc-600 mt-4 max-w-xs mx-auto font-medium" style={{ color: '#3f3f46' }}>
              Estamos preparando nuevas tazas exclusivas para vos. ¡Volvé pronto!
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                image={product.image}
                description={product.description}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        )}
      </div>
    </main >
  );
}
