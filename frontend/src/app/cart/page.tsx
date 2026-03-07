"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { LuTrash2, LuPlus, LuMinus, LuArrowRight, LuShoppingBag, LuTruck } from "react-icons/lu";

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCartStore();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!user) {
      router.push("/login?redirect=/checkout");
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] tracking-tight">
            Tu <span className="text-[var(--accent)]">Carrito</span>
          </h1>
          <p className="text-[var(--foreground)]/50 mt-4 text-lg">
            Revisá tus productos antes de finalizar la compra.
          </p>
        </header>

        {cart.length === 0 ? (
          <div className="bg-[var(--card)] rounded-[3rem] p-20 text-center border border-[var(--border)] shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-32 h-32 bg-[var(--background)] rounded-full flex items-center justify-center mx-auto mb-8">
              <LuShoppingBag className="text-5xl text-[var(--accent)]" />
            </div>
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">Tu carrito está vacío</h2>
            <p className="text-[var(--foreground)]/50 mb-10 max-w-md mx-auto text-lg leading-relaxed">
              Parece que aún no has añadido nada. ¡Explora nuestros productos y personaliza tu taza ideal!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-3 bg-[var(--accent)] text-white px-10 py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-black/10 hover:scale-105 active:scale-95"
            >
              Explorar Productos
              <LuArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* COLUMNA IZQUIERDA: LISTA DE PRODUCTOS */}
            <div className="flex-1 space-y-8">
              <div className="bg-[var(--card)] rounded-[2.5rem] border border-[var(--border)] overflow-hidden shadow-sm">
                <div className="divide-y divide-[var(--border)]">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-8 flex flex-col sm:flex-row gap-8 hover:bg-[var(--background)] transition-all group"
                    >
                      {/* Imagen */}
                      <div className="w-full sm:w-40 h-40 bg-[var(--background)] rounded-3xl overflow-hidden flex-shrink-0 border border-[var(--border)] relative">
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
                            <h3 className="text-xl font-bold text-[var(--foreground)] leading-tight group-hover:text-[var(--accent)] transition-colors">
                              {item.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs font-bold text-[var(--foreground)]/40 uppercase tracking-widest">Precio Unitario:</span>
                              <span className="text-sm font-bold text-[var(--accent)]">
                                ${item.price.toLocaleString('es-AR')}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-3 text-[var(--foreground)]/30 hover:text-red-500 transition-all rounded-2xl hover:bg-red-50"
                            title="Eliminar"
                          >
                            <LuTrash2 size={20} />
                          </button>
                        </div>

                        <div className="flex flex-wrap justify-between items-end mt-6 gap-4">
                          {/* Controles de cantidad */}
                          <div className="flex items-center bg-[var(--background)] rounded-2xl p-1.5 border border-[var(--border)]">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, Math.max(1, item.quantity - 1))
                              }
                              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[var(--accent)] transition-colors"
                            >
                              <LuMinus size={12} />
                            </button>
                            <span className="w-12 text-center font-black text-lg text-[var(--foreground)]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[var(--accent)] transition-colors"
                            >
                              <LuPlus size={12} />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest mb-1">Subtotal Item</p>
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
                  className="text-[var(--foreground)]/30 hover:text-red-500 flex items-center gap-2 text-sm font-bold transition-all px-6 py-3 rounded-2xl hover:bg-red-50"
                >
                  <LuTrash2 size={16} />
                  Vaciar mi carrito
                </button>
              </div>
            </div>

            {/* COLUMNA DERECHA: RESUMEN */}
            <aside className="lg:w-[400px]">
              <div className="sticky top-32 bg-[var(--card)] rounded-[2.5rem] border border-[var(--border)] shadow-2xl shadow-black/5 overflow-hidden">
                <div className="p-10">
                  <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8">Resumen</h2>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--foreground)]/60 font-medium">Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} productos)</span>
                      <span className="font-bold text-xl text-[var(--foreground)]">
                        ${subtotal.toLocaleString('es-AR')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-[var(--background)] rounded-2xl border border-[var(--border)]">
                      <LuTruck size={18} className="text-[var(--accent)] flex-shrink-0" />
                      <p className="text-xs font-bold text-[var(--foreground)]/50 leading-relaxed">
                        El costo de envío se calcula en el checkout con tu código postal
                      </p>
                    </div>

                    <div className="pt-6 border-t border-[var(--border)]">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-[var(--foreground)]">Subtotal</span>
                        <span className="block text-3xl font-black text-[var(--accent)]">
                          ${subtotal.toLocaleString('es-AR')}
                        </span>
                      </div>
                      <p className="text-[10px] text-[var(--foreground)]/30 font-bold uppercase tracking-tighter mt-1 text-right">+ Envío a confirmar</p>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="w-full mt-4 bg-[var(--accent)] text-white py-5 rounded-[1.5rem] font-bold text-xl shadow-xl shadow-black/5 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                      Finalizar Compra
                      <LuArrowRight size={18} />
                    </button>

                    <div className="flex items-center justify-center gap-2 mt-2 text-[var(--foreground)]/30">
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
