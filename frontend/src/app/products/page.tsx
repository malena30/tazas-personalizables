"use client";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

export default function ProductsPage() {
  const addToCart = useCartStore((state) => state.addToCart);

  const products = [
    {
      id: 1,
      name: "Taza Minimalista",
      description: "Perfecta para frases simples o logos. Cerámica premium.",
      price: 3500,
      image:
        "https://images.pexels.com/photos/1415550/pexels-photo-1415550.jpeg",
    },
    {
      id: 2,
      name: "Taza con Foto",
      description: "Ideal para regalos personalizados con fotos.",
      price: 4200,
      image:
        "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg",
    },
    {
      id: 3,
      name: "Taza Ilustrada",
      description: "Perfecta para diseños creativos, dibujos o ilustraciones.",
      price: 3900,
      image:
        "https://images.pexels.com/photos/326682/pexels-photo-326682.jpeg",
    },
  ];

  const [tooltipVisible, setTooltipVisible] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const clickSound = typeof window !== "undefined" ? new Audio("/sounds/click.wav") : null;


  const handleQuantityChange = (productId: number, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 1) + delta, 1),
    }));
  };

  const handleAddToCart = (product: any) => {
    const quantity = quantities[product.id] || 1;
    addToCart({ ...product, quantity });
    setTooltipVisible(product.id);

    // reproducir sonido
    clickSound?.play();

    setTimeout(() => setTooltipVisible(null), 2000);
  };

  return (
    <main className="w-full max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-10 text-center">Catálogo de Productos</h1>

      <div className="space-y-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col md:flex-row items-center bg-white shadow rounded-xl p-4 hover:shadow-xl hover:-translate-y-1 transition relative"
          >
            {/* Imagen */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full md:w-60 h-60 object-cover rounded-lg cursor-pointer"
            />

            {/* Información */}
            <div className="mt-4 md:mt-0 md:ml-6 flex-1">
              <h2 className="text-2xl font-bold cursor-default text-black">{product.name}</h2>
              <p className="text-black mt-2 cursor-default">{product.description}</p>
              <p className="text-3xl font-bold text-blue-600 mt-4 cursor-default">
                ${product.price.toLocaleString("es-AR")}
              </p>

              {/* Selector de cantidad + botón */}
              <div className="flex items-center mt-4">
                {/* Selector de cantidad */}
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(product.id, -1)}
                    className="px-3 py-1 bg-black hover:bg-black cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 cursor-default text-black">
                    {quantities[product.id] || 1}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(product.id, +1)}
                    className="px-3 py-1 bg-black hover:bg-black cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Botón agregar al carrito */}
                <div className="relative inline-block ml-4">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition"
                  >
                    Agregar al carrito
                  </button>

                  {/* Tooltip al costado derecho con fade */}
                  {tooltipVisible === product.id && (
                    <span
                      className="absolute top-1/2 left-full ml-3 -translate-y-1/2 bg-black text-white text-sm px-2 py-1 rounded whitespace-nowrap
                      transition-opacity duration-300 opacity-100"
                    >
                      {quantities[product.id] || 1} agregado
                      {(quantities[product.id] || 1) > 1 ? "s" : ""} al carrito
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
