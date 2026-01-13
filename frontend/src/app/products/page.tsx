"use client";

import { useState, useEffect } from "react";
import { FaShoppingBag } from "react-icons/fa";
import ProductSkeleton from "@/components/ProductSkeleton";
import { useCartStore } from "@/store/cartStore";
import { getProducts } from "@/lib/api";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";

interface UIProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const [tooltipVisible, setTooltipVisible] = useState<number | null>(null);
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
        id: Number(p.id) || 1,
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
    <main className="w-full bg-[var(--background)] min-h-screen py-20 px-6">
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
            <FaShoppingBag />
            <p className="font-bold">{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-[3rem] border border-[var(--border)]">
            <FaShoppingBag className="text-4xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[var(--foreground)]">No hay productos disponibles</h3>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
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
    </main>
  );
}
