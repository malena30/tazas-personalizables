"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";
import { useCartStore } from "@/store/cartStore";
import { createOrder } from "@/lib/api";
import Image from "next/image";
import { LuShoppingBag, LuArrowRight, LuLock, LuShieldCheck } from "react-icons/lu";

export default function OrderSummary() {
    const { subtotal, shipping, total, buyer, payment } = useCheckout();
    const { cart } = useCartStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        if (!cart || cart.length === 0) {
            alert("El carrito está vacío");
            return;
        }
        if (!buyer.name || !buyer.email || !buyer.address) {
            alert("Por favor completa los datos de envío");
            return;
        }
        if (!payment) {
            alert("Por favor selecciona un método de pago");
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                items: cart.map(item => ({
                    design_id: item.designId || undefined,
                    product_id: !item.designId ? item.id : undefined,
                    quantity: item.quantity,
                    price: item.price
                })),
                shipping_address: buyer,
                payment_method: payment,
                total_amount: total
            };

            const order = await createOrder(orderData);

            if (order.checkout_url) {
                window.location.href = order.checkout_url;
            } else {
                router.push(`/checkout/success?orderId=${order.id}`);
            }
        } catch (error: any) {
            alert(error.message || "Hubo un error al procesar tu pedido");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[var(--cream)] dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl shadow-black/5 border border-[var(--border)] overflow-hidden">
            <div className="p-10">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8">Resumen</h2>

                {/* Items List */}
                <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                    {cart.map((item) => (
                        <div key={item.id} className="flex gap-5 group">
                            <div className="relative w-20 h-20 rounded-2xl bg-gray-50 dark:bg-zinc-800 border border-[var(--border)] overflow-hidden flex-shrink-0">
                                {item.image ? (
                                    <Image src={item.image} alt={item.name} fill className="object-contain group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl">☕</div>
                                )}
                                <span className="absolute -top-1 -right-1 w-6 h-6 bg-[var(--accent)] text-white text-[10px] font-black rounded-lg flex items-center justify-center border-2 border-white dark:border-zinc-900 shadow-lg">
                                    {item.quantity}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0 py-1">
                                <h3 className="text-sm font-bold text-[var(--foreground)] truncate group-hover:text-[var(--accent)] transition-colors">{item.name}</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    ${item.price.toLocaleString('es-AR')} c/u
                                </p>
                            </div>
                            <div className="text-sm font-black text-[var(--foreground)] py-1">
                                ${(item.price * item.quantity).toLocaleString('es-AR')}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="space-y-4 pt-8 border-t border-[var(--border)]">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">Subtotal</span>
                        <span className="font-bold text-[var(--foreground)]">${subtotal.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">Envío</span>
                        <span className={`font-bold ${shipping.cost > 0 ? 'text-[var(--accent)]' : 'text-gray-300'}`}>
                            {shipping.cost > 0 ? `$${shipping.cost.toLocaleString('es-AR')}` : (shipping.method === 'correo' ? 'Calculando...' : 'Gratis')}
                        </span>
                    </div>

                    {payment === 'efectivo' && (
                        <div className="flex justify-between items-center text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10 p-3 rounded-xl border border-green-100 dark:border-green-900/20">
                            <span className="font-bold uppercase text-[10px] tracking-widest">Descuento Efectivo (10%)</span>
                            <span className="font-black">-${(subtotal * 0.1).toLocaleString('es-AR')}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-6 border-t border-[var(--border)] mt-4">
                        <span className="text-xl font-bold text-[var(--foreground)]">Total Final</span>
                        <div className="text-right">
                            <span className="block text-3xl font-black text-[var(--accent)]">
                                ${(payment === 'efectivo' ? total * 0.9 : total).toLocaleString('es-AR')}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">IVA Incluido</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleCheckout}
                    disabled={loading || cart.length === 0}
                    className={`mt-10 w-full py-5 rounded-[1.5rem] font-bold text-xl shadow-xl transition-all flex justify-center items-center gap-3 ${loading || cart.length === 0
                        ? 'bg-gray-100 dark:bg-zinc-800 text-gray-400 cursor-not-allowed shadow-none'
                        : 'bg-[var(--accent)] text-white hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-black/5'
                        }`}
                >
                    {loading ? (
                        <>
                            <span className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
                            <span>Procesando...</span>
                        </>
                    ) : (
                        <>
                            <span>Confirmar Compra</span>
                            <LuArrowRight className="w-6 h-6" />
                        </>
                    )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-8 text-gray-400">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Pago Seguro Encriptado</p>
                </div>
            </div>
        </div>
    );
}
