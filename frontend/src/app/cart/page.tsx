"use client";

import { LuTrash2, LuPlus, LuMinus, LuArrowRight, LuShoppingBag, LuX } from "react-icons/lu";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] tracking-tight">
            Tu <span className="text-blue-600">Carrito</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg">
            Revisá tus productos antes de finalizar la compra.
          </p>
        </header>

        {cart.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-20 text-center border border-[var(--border)] shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <LuShoppingBag className="text-5xl text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-md mx-auto text-lg leading-relaxed">
              Parece que aún no has añadido nada. ¡Explora nuestros productos y personaliza tu taza ideal!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 hover:scale-105 active:scale-95"
            >
              Explorar Productos
              <LuArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* COLUMNA IZQUIERDA: LISTA DE PRODUCTOS */}
            <div className="flex-1 space-y-8">
              <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-[var(--border)] overflow-hidden shadow-sm">
                <div className="divide-y divide-[var(--border)]">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-8 flex flex-col sm:flex-row gap-8 hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-all group"
                    >
                      {/* Imagen */}
                      <div className="w-full sm:w-40 h-40 bg-gray-50 dark:bg-zinc-800 rounded-3xl overflow-hidden flex-shrink-0 border border-[var(--border)] relative">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl">☕</div>
                        )}
                      </div>

                      {/* Detalles */}
                      <div className="flex-1 flex flex-col justify-between py-2">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-[var(--foreground)] leading-tight group-hover:text-blue-600 transition-colors">
                              {item.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Precio Unitario:</span>
                              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                ${item.price.toLocaleString('es-AR')}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-3 text-gray-400 hover:text-red-500 transition-all rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Eliminar"
                          >
                            <LuTrash2 size={20} />
                          </button>
                        </div>

                        <div className="flex flex-wrap justify-between items-end mt-6 gap-4">
                          {/* Controles de cantidad */}
                          <div className="flex items-center bg-gray-50 dark:bg-zinc-800 rounded-2xl p-1.5 border border-[var(--border)]">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, Math.max(1, item.quantity - 1))
                              }
                              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors"
                            >
                              <LuMinus size={12} />
                            </button>
                            <span className="w-12 text-center font-black text-lg text-[var(--foreground)]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors"
                            >
                              <LuPlus size={12} />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Subtotal Item</p>
                            <p className="text-2xl font-black text-[var(--foreground)]">
                              ${(item.price * item.quantity).toLocaleString('es-AR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón Vaciar */}
              <div className="flex justify-start">
                <button
                  onClick={clearCart}
                  className="text-gray-400 hover:text-red-500 flex items-center gap-2 text-sm font-bold transition-all px-6 py-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10"
                >
                  <LuTrash2 size={16} />
                  Vaciar mi carrito
                </button>
              </div>
            </div>

            {/* COLUMNA DERECHA: RESUMEN + ENVÍO */}
            <aside className="lg:w-[400px]">
              <div className="sticky top-32 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-[var(--border)] shadow-2xl shadow-blue-500/5 overflow-hidden">
                <div className="p-10">
                  <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8">Resumen</h2>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Subtotal</span>
                      <span className="font-bold text-xl text-[var(--foreground)]">
                        ${subtotal.toLocaleString('es-AR')}
                      </span>
                    </div>

                    {/* SELECT DE PROVINCIA */}
                    <div className="pt-6 border-t border-[var(--border)]">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                        Calcular Envío
                      </label>
                      <div className="relative">
                        <select
                          value={province}
                          onChange={handleProvinceChange}
                          className="w-full p-4 bg-gray-50 dark:bg-zinc-800 border border-[var(--border)] rounded-2xl text-[var(--foreground)] font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
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
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                          <LuPlus size={10} className="rotate-45" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-6">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">Costo de envío</span>
                        <span className={`font-bold ${shippingCost > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-300'}`}>
                          {shippingCost > 0 ? `$${shippingCost.toLocaleString('es-AR')}` : '—'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-[var(--border)]">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-[var(--foreground)]">Total Final</span>
                        <div className="text-right">
                          <span className="block text-3xl font-black text-blue-600 dark:text-blue-400">
                            ${total.toLocaleString('es-AR')}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">IVA Incluido</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="w-full mt-10 bg-blue-600 text-white py-5 rounded-[1.5rem] font-bold text-xl shadow-xl shadow-blue-500/25 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                      Finalizar Compra
                      <LuArrowRight size={18} />
                    </button>

                    <div className="flex items-center justify-center gap-2 mt-6 text-gray-400">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">Pago Seguro Encriptado</p>
                    </div>
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
