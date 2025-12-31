"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCartStore, Product } from "@/store/cartStore";
import { getProducts } from "@/lib/api";

export default function ProductsPage() {
  const addToCart = useCartStore((state) => state.addToCart);
  const [tooltipVisible, setTooltipVisible] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [products, setProducts] = useState<Product[]>([]);
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

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    addToCart({ ...product, quantity });
    setTooltipVisible(product.id);

    clickSound?.play();
    setTimeout(() => setTooltipVisible(null), 2000);
  };

  return (
    <main className="w-full bg-[var(--background)] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">

        {/* LISTADO DE PRODUCTOS */}
        <div className="w-full">
          <h1 className="text-xl font-title font-semibold text-[var(--foreground)] mb-4">TAZAS</h1>

          {loading && (
            <div className="text-center py-12">
              <p className="text-[var(--foreground)] opacity-70">Cargando productos...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[var(--foreground)] opacity-70">No hay productos disponibles en este momento.</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-sm divide-y divide-[var(--border)]">
              {products.map((product) => (
                <div key={product.id} className="flex flex-col md:flex-row p-6 gap-6 hover:bg-[var(--hover-bg)] transition-colors">

                  {/* Imagen */}
                  <div className="relative w-full md:w-48 h-48 shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain rounded"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h2 className="text-xl font-title font-medium text-[var(--foreground)] mb-2 cursor-pointer hover:text-[var(--accent)] transition-colors">
                      {product.name}
                    </h2>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-mono font-medium text-[var(--foreground)]">
                        $ {product.price.toLocaleString("es-AR")}
                      </span>
                    </div>

                    <p className="text-sm text-[var(--foreground)] opacity-70 font-text mb-4 hidden md:block">
                      {product.description}
                    </p>

                    {/* Controles de compra */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-[var(--border)] rounded overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange(product.id, -1)}
                          className="px-3 py-1 bg-[var(--background)] hover:bg-[var(--accent)] hover:bg-opacity-20 text-[var(--accent)] font-mono font-bold transition-colors"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 text-[var(--foreground)] font-mono min-w-[40px] text-center">
                          {quantities[product.id] || 1}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(product.id, +1)}
                          className="px-3 py-1 bg-[var(--background)] hover:bg-[var(--accent)] hover:bg-opacity-20 text-[var(--accent)] font-mono font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <div className="relative">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-[var(--accent)] text-[var(--foreground)] px-6 py-2 rounded-lg font-text font-semibold hover:opacity-90 transition-all shadow-sm"
                        >
                          Agregar al carrito
                        </button>

                        {tooltipVisible === product.id && (
                          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-[var(--foreground)] text-xs font-text px-3 py-1 rounded shadow-lg whitespace-nowrap z-10">
                            ¡Agregado!
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main >
  );
}
