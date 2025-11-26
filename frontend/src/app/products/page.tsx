"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore, Product } from "@/store/cartStore";

export default function ProductsPage() {
  const addToCart = useCartStore((state) => state.addToCart);
  const [tooltipVisible, setTooltipVisible] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const clickSound = typeof window !== "undefined" ? new Audio("/sounds/click.wav") : null;

  const products: Product[] = [
    {
      id: 1,
      name: "Taza Minimalista Cerámica Premium",
      description: "Diseño simple y elegante. Ideal para oficinas o regalos corporativos.",
      price: 3500,
      image: "https://images.pexels.com/photos/1415550/pexels-photo-1415550.jpeg",
    },
    {
      id: 2,
      name: "Taza Personalizada Con Tu Foto Full Color",
      description: "Subí tu foto y recibila impresa en alta calidad. Resistente al microondas.",
      price: 4200,
      image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg",
    },
    {
      id: 3,
      name: "Taza Ilustrada Diseño Exclusivo Artístico",
      description: "Ilustraciones originales de artistas locales. Coleccionables.",
      price: 3900,
      image: "https://images.pexels.com/photos/326682/pexels-photo-326682.jpeg",
    },
  ];

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
        </div>
      </div>
    </main>
  );
}
