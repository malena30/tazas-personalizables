"use client";

import { FaRegTrashAlt, FaPlus, FaMinus, FaArrowRight, FaShoppingBag } from "react-icons/fa";
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
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-[var(--foreground)] tracking-tight">Tu Carrito</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Revisá tus productos antes de finalizar la compra.</p>
        </header>

        {cart.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-[var(--border)] shadow-sm">
            <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingBag className="text-4xl text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Parece que aún no has añadido nada. ¡Explora nuestros productos y personaliza tu taza ideal!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
            >
              Explorar Productos
              <FaArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* COLUMNA IZQUIERDA: LISTA DE PRODUCTOS */}
            <div className="flex-1 space-y-6">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
                <div className="divide-y divide-[var(--border)]">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group"
                    >
                      {/* Imagen */}
                      <div className="w-full sm:w-32 h-32 bg-gray-100 dark:bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0 border border-[var(--border)] relative">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">☕</div>
                        )}
                      </div>

                      {/* Detalles */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-[var(--foreground)] leading-tight">{item.name}</h3>
                            <p className="text-blue-600 dark:text-blue-400 font-bold mt-1">
                              ${item.price.toLocaleString('es-AR')}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10"
                            title="Eliminar"
                          >
                            <FaRegTrashAlt size={18} />
                          </button>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          {/* Controles de cantidad */}
                          <div className="flex items-center bg-gray-100 dark:bg-zinc-800 rounded-xl p-1 border border-[var(--border)]">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, Math.max(1, item.quantity - 1))
                              }
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors"
                            >
                              <FaMinus size={12} />
                            </button>
                            <span className="w-10 text-center font-bold text-[var(--foreground)]">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors"
                            >
                              <FaPlus size={12} />
                            </button>
                          </div>
                          <div className="text-lg font-black text-[var(--foreground)]">
                            ${(item.price * item.quantity).toLocaleString('es-AR')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón Vaciar */}
              <div className="flex justify-end">
                <button
                  onClick={clearCart}
                  className="text-gray-500 hover:text-red-500 flex items-center gap-2 text-sm font-medium transition-colors px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10"
                >
                  <FaRegTrashAlt size={14} />
                  Vaciar carrito
                </button>
              </div>
            </div>

            {/* COLUMNA DERECHA: RESUMEN + ENVÍO */}
            <aside className="lg:w-96">
              <div className="sticky top-24 bg-white dark:bg-zinc-900 rounded-2xl border border-[var(--border)] shadow-xl overflow-hidden">
                <div className="p-8">
                  <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">Resumen de Compra</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Subtotal</span>
                      <span className="font-bold text-[var(--foreground)]">${subtotal.toLocaleString('es-AR')}</span>
                    </div>

                    {/* SELECT DE PROVINCIA */}
                    <div className="pt-4 border-t border-[var(--border)]">
                      <label className="block text-sm font-bold text-[var(--foreground)] mb-2">Calcular Envío</label>
                      <select
                        value={province}
                        onChange={handleProvinceChange}
                        className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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

                      <div className="flex justify-between mt-4 text-gray-600 dark:text-gray-400">
                        <span>Costo de envío</span>
                        <span className="font-bold text-[var(--foreground)]">
                          {shippingCost > 0 ? `$${shippingCost.toLocaleString('es-AR')}` : '—'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[var(--border)]">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-[var(--foreground)]">Total</span>
                        <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
                          ${total.toLocaleString('es-AR')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="w-full mt-8 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                      Continuar Compra
                      <FaArrowRight size={16} />
                    </button>

                    <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 mt-4 px-4">
                      El costo de envío final se confirmará en el siguiente paso según tu dirección exacta.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
