"use client";

import { FaRegTrashAlt } from "react-icons/fa";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    shippingCost,
    setShippingCost,
  } = useCartStore();

  const [province, setProvince] = useState("");

  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const calculateShipping = (prov: string) => {
    const table: Record<string, number> = {
      "Buenos Aires": 4500,
      CABA: 3500,
      Córdoba: 6000,
      "Santa Fe": 6500,
      Mendoza: 7000,
      Tucumán: 7500,
      Salta: 8000,
      Neuquén: 9000,
      "Río Negro": 9200,
      Chubut: 10000,
      "Santa Cruz": 12000,
      "Tierra del Fuego": 15000,
    };
    return table[prov] || 0;
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prov = e.target.value;
    setProvince(prov);
    setShippingCost(calculateShipping(prov));
  };

  const subtotal = calculateSubtotal();
  const total = subtotal + shippingCost;

  const handleCheckout = () => {
    if (!user) {
      router.push("/login?redirect=/checkout");
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* COLUMNA IZQUIERDA: LISTA DE PRODUCTOS */}
      <div className="lg:col-span-2 space-y-4 text-[var(--foreground)]">
        <h1 className="text-3xl font-title font-bold mb-4 text-[var(--foreground)]">Carrito</h1>

        {cart.length === 0 ? (
          <p className="text-[var(--foreground)] opacity-60 font-text text-lg">Tu carrito está vacío.</p>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item.id}
                className="p-4 border border-[var(--border)] rounded-lg flex justify-between items-center bg-[var(--background)] shadow-sm"
              >
                {/* Nombre y precio */}
                <div>
                  <p className="font-title font-semibold text-[var(--foreground)]">{item.name}</p>
                  <p className="text-[var(--foreground)] font-mono">${item.price}</p>
                </div>

                {/* Controles */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    className="px-3 py-1 border border-[var(--border)] rounded font-mono"
                  >
                    -
                  </button>

                  <span className="font-mono text-[var(--foreground)]">{item.quantity}</span>

                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 border border-[var(--border)] rounded font-mono"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-red-600 hover:text-red-700 transition cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 hover:scale-110 transition-transform"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 6V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {/* Botón Vaciar */}
            <button
              onClick={clearCart}
              className="bg-red-500 text-white px-4 py-2 rounded font-text flex items-center gap-2 cursor-pointer hover:bg-red-600 transition-colors"
            >
              <FaRegTrashAlt size={18} />
              Vaciar carrito
            </button>
          </>
        )}
      </div>

      {/* COLUMNA DERECHA: RESUMEN + ENVÍO */}
      {cart.length > 0 && (
        <div className="p-6 border border-[var(--border)] rounded-lg bg-[var(--background)] shadow-md h-fit sticky top-24">
          <h2 className="text-2xl font-title font-bold mb-4 text-[var(--foreground)]">Resumen de compra</h2>

          <div className="text-lg">
            <p className="flex justify-between mb-2 text-[var(--foreground)] font-text">
              <span>Productos</span>
              <span className="font-mono">${subtotal}</span>
            </p>

            {/* SELECT DE PROVINCIA */}
            <div className="my-4">
              <label className="font-text font-medium text-[var(--foreground)]">Envío</label>
              <select
                value={province}
                onChange={handleProvinceChange}
                className="w-full mt-2 p-2 border border-[var(--border)] rounded text-[var(--foreground)] bg-[var(--background)] font-text"
              >
                <option value="">Seleccionar provincia</option>
                <option>Buenos Aires</option>
                <option>CABA</option>
                <option>Córdoba</option>
                <option>Santa Fe</option>
                <option>Mendoza</option>
                <option>Tucumán</option>
                <option>Salta</option>
                <option>Neuquén</option>
                <option>Río Negro</option>
                <option>Chubut</option>
                <option>Santa Cruz</option>
                <option>Tierra del Fuego</option>
              </select>

              <p className="mt-2 flex justify-between text-[var(--foreground)] font-text">
                <span>Costo de envío</span>
                <span className="font-mono">${shippingCost}</span>
              </p>
            </div>

            <hr className="my-4" />

            <p className="text-2xl font-title font-bold flex justify-between text-[var(--foreground)]">
              <span>Total</span>
              <span className="font-mono">${total}</span>
            </p>

            {/* BOTÓN COMPRAR → LLEVA A /checkout (con check de auth) */}
            <button
              onClick={handleCheckout}
              className="w-full mt-6 bg-[var(--accent)] text-[var(--foreground)] py-3 text-lg font-text font-semibold rounded-lg shadow hover:opacity-90 transition-opacity block text-center cursor-pointer"
            >
              Comprar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
