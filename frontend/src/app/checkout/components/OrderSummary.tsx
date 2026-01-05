"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";
import { useCartStore } from "@/store/cartStore";
import { createOrder } from "@/lib/api";
import Image from "next/image";

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
                    product_id: !item.designId ? String(item.id) : undefined,
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
            console.error("Error al crear la orden:", error);
            alert(error.message || "Hubo un error al procesar tu pedido");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
            <div className="p-6 sm:p-8">
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">Resumen del Pedido</h2>

                {/* Items List */}
                <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map((item) => (
                        <div key={item.id} className="flex gap-4">
                            <div className="relative w-16 h-16 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-[var(--border)] overflow-hidden flex-shrink-0">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xl">☕</div>
                                )}
                                <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900">
                                    {item.quantity}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-[var(--foreground)] truncate">{item.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    ${item.price.toLocaleString('es-AR')} c/u
                                </p>
                            </div>
                            <div className="text-sm font-bold text-[var(--foreground)]">
                                ${(item.price * item.quantity).toLocaleString('es-AR')}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 pt-6 border-t border-[var(--border)]">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Subtotal</span>
                        <span>${subtotal.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Envío</span>
                        <span>{shipping.cost > 0 ? `$${shipping.cost.toLocaleString('es-AR')}` : (shipping.method === 'correo' ? 'Calculando...' : 'Gratis')}</span>
                    </div>

                    {payment === 'efectivo' && (
                        <div className="flex justify-between text-sm text-green-600 dark:text-green-400 font-medium">
                            <span>Descuento Efectivo (10%)</span>
                            <span>-${(subtotal * 0.1).toLocaleString('es-AR')}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-[var(--border)] mt-2">
                        <span className="text-lg font-bold text-[var(--foreground)]">Total</span>
                        <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                            ${(payment === 'efectivo' ? total * 0.9 : total).toLocaleString('es-AR')}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleCheckout}
                    disabled={loading || cart.length === 0}
                    className={`mt-8 w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all flex justify-center items-center gap-3 ${loading || cart.length === 0
                        ? 'bg-gray-200 dark:bg-zinc-800 text-gray-400 cursor-not-allowed shadow-none'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] shadow-blue-500/20'
                        }`}
                >
                    {loading ? (
                        <>
                            <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                            <span>Procesando...</span>
                        </>
                    ) : (
                        <>
                            <span>Confirmar Compra</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </>
                    )}
                </button>

                <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 mt-4 px-4">
                    Al confirmar la compra aceptás nuestros términos y condiciones. Tu pago es procesado de forma segura.
                </p>
            </div>
        </div>
    );
}
