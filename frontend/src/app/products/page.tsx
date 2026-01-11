"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaMinus, FaShoppingBag, FaPalette, FaCheckCircle } from "react-icons/fa";
import ProductSkeleton from "@/components/ProductSkeleton";
import { useCartStore } from "@/store/cartStore";
import { getProducts, Product } from "@/lib/api";
import { useRouter } from "next/navigation";

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
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const clickSound = typeof window !== "undefined" ? new Audio("/sounds/click.wav") : null;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await getProducts();
      // Convertir de la API Product al formato del carrito
      const cartProducts = productsData.map((p) => ({
        id: Number(p.id) || 1, // Convertir UUID a número para el carrito
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

  const handleQuantityChange = (productId: number, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 1) + delta, 1),
    }));
  };

  const handleAddToCart = (product: UIProduct) => {
    const quantity = quantities[product.id] || 1;
    addToCart({ ...product, quantity });
    setTooltipVisible(product.id);

    clickSound?.play();
    setTimeout(() => setTooltipVisible(null), 2000);
  };

  return (
    <main className="w-full bg-gray-50 dark:bg-zinc-950 min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] tracking-tight">
              Nuestras <span className="text-blue-600">Tazas</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-lg text-lg">
              Explora nuestra colección de tazas premium listas para ser personalizadas con tu toque único.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-[var(--border)] shadow-sm">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20">
              Todos
            </button>
            <button className="px-6 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl font-bold text-sm transition-all">
              Cerámica
            </button>
            <button className="px-6 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl font-bold text-sm transition-all">
              Plástico
            </button>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-6 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-2xl flex items-center justify-center shrink-0">
              <FaShoppingBag />
            </div>
            <div>
              <p className="font-bold">Ocurrió un error</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-[3rem] border border-[var(--border)] shadow-sm">
            <div className="w-24 h-24 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingBag className="text-4xl text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--foreground)]">No hay productos disponibles</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Vuelve a intentarlo más tarde.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-[var(--border)] overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gray-50 dark:bg-zinc-800/50 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="text-7xl group-hover:scale-110 transition-transform duration-500">☕</div>
                    )}
                  </div>

                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <button
                      onClick={() => router.push("/customizer")}
                      className="p-4 bg-white text-blue-600 rounded-2xl hover:bg-blue-50 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg"
                      title="Personalizar"
                    >
                      <FaPalette size={20} />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-8 flex flex-col flex-1">
                  <h2 className="text-xl font-bold text-[var(--foreground)] mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mt-auto space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-[var(--foreground)]">
                        ${product.price.toLocaleString("es-AR")}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center bg-gray-50 dark:bg-zinc-800 rounded-xl p-1 border border-[var(--border)]">
                        <button
                          onClick={() => handleQuantityChange(product.id, -1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-[var(--foreground)]">
                          {quantities[product.id] || 1}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(product.id, 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${tooltipVisible === product.id
                          ? "bg-green-500 text-white shadow-green-500/25"
                          : "bg-gray-900 dark:bg-zinc-800 text-white hover:bg-black dark:hover:bg-zinc-700 shadow-gray-900/20"
                          }`}
                      >
                        {tooltipVisible === product.id ? (
                          <>
                            <FaCheckCircle />
                            ¡Agregado!
                          </>
                        ) : (
                          <>
                            <FaShoppingBag size={16} />
                            Agregar al carrito
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
