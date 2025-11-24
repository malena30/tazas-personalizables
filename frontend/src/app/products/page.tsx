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
    <main className="w-full bg-[#EBEBEB] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-6">

        {/* FILTROS LATERALES (Simulados) */}
        <aside className="hidden md:block w-64 shrink-0">
          <h2 className="font-bold text-lg mb-4 text-[#333]">Tazas</h2>
          <p className="font-semibold text-[#333] mb-2">Categorías</p>
          <ul className="text-sm text-[#666] space-y-2 mb-6">
            <li className="cursor-pointer hover:text-[#3483FA]">Cerámica (120)</li>
            <li className="cursor-pointer hover:text-[#3483FA]">Plástico (45)</li>
            <li className="cursor-pointer hover:text-[#3483FA]">Mágicas (12)</li>
          </ul>

          <p className="font-semibold text-[#333] mb-2">Precio</p>
          <ul className="text-sm text-[#666] space-y-2 mb-6">
            <li className="cursor-pointer hover:text-[#3483FA]">Hasta $ 3.500 (50)</li>
            <li className="cursor-pointer hover:text-[#3483FA]">$ 3.500 a $ 5.000 (80)</li>
            <li className="cursor-pointer hover:text-[#3483FA]">Más de $ 5.000 (20)</li>
          </ul>

          <p className="font-semibold text-[#333] mb-2">Envío</p>
          <div className="flex items-center gap-2 mb-6">
            <input type="checkbox" id="envio" className="rounded border-gray-300" />
            <label htmlFor="envio" className="text-sm text-[#666]">Envío gratis</label>
          </div>
        </aside>

        {/* LISTADO DE PRODUCTOS */}
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-[#333] mb-4">Resultados para "Tazas"</h1>

          <div className="bg-white rounded shadow-sm divide-y divide-gray-200">
            {products.map((product) => (
              <div key={product.id} className="flex flex-col md:flex-row p-6 gap-6 hover:bg-gray-50 transition-colors">

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
                  <h2 className="text-xl font-light text-[#333] mb-2 cursor-pointer hover:text-[#3483FA]">
                    {product.name}
                  </h2>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-normal text-[#333]">
                      $ {product.price.toLocaleString("es-AR")}
                    </span>
                    <span className="text-sm text-[#00A650] font-semibold">5% OFF</span>
                  </div>

                  <p className="text-sm text-[#00A650] font-semibold mb-4">
                    Envío gratis mañana
                  </p>

                  <p className="text-sm text-[#666] mb-4 hidden md:block">
                    {product.description}
                  </p>

                  {/* Controles de compra */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(product.id, -1)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-[#3483FA] font-bold"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-[#333] min-w-[40px] text-center">
                        {quantities[product.id] || 1}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(product.id, +1)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-[#3483FA] font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-[#3483FA] text-white px-6 py-2 rounded font-semibold hover:bg-[#2968C8] transition-colors shadow-sm"
                      >
                        Agregar al carrito
                      </button>

                      {tooltipVisible === product.id && (
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#333] text-white text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap z-10">
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
