"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";
import { useCartStore } from "@/store/cartStore";
import { createOrder } from "@/lib/api";
import Image from "next/image";
import { LuShoppingBag, LuArrowRight, LuShieldCheck, LuInfo, LuCircleCheck, LuExternalLink } from "react-icons/lu";

export default function OrderSummary() {
    const { subtotal, shipping, total, buyer, payment } = useCheckout();
    const { cart, clearCart } = useCartStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmedOrder, setConfirmedOrder] = useState<{ id: string; checkoutUrl?: string } | null>(null);

    const handleCheckout = async () => {
        setError(null);
        if (!cart || cart.length === 0) {
            setError("El carrito está vacío");
            return;
        }
        if (!buyer.name || !buyer.email || !buyer.address) {
            setError("Por favor completa los datos de envío");
            return;
        }
        if (!payment) {
            setError("Por favor selecciona un método de pago");
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
                // MP: mostrar botón prominente para ir a pagar
                setConfirmedOrder({ id: order.id, checkoutUrl: order.checkout_url });
            } else {
                // Transferencia / Efectivo: mostrar panel de confirmación
                setConfirmedOrder({ id: order.id });
            }
        } catch (err: any) {
            setError(err.message || "Hubo un error al procesar tu pedido");
        } finally {
            setLoading(false);
        }
    };

    const finalTotal = payment === 'efectivo' ? total * 0.9 : total;

    return (
        <div className="bg-[var(--card)] backdrop-blur-xl rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.05)] border border-[var(--border)] overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="p-8 sm:p-10">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-[var(--accent)]/10 text-[var(--accent)] rounded-2xl">
                        <LuShoppingBag size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-[var(--foreground)] tracking-tight">Tu Pedido</h2>
                </div>

                {/* Items List */}
                <div className="space-y-6 mb-10 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map((item) => (
                        <div key={item.id} className="flex gap-5 group">
                            <div className="relative w-20 h-20 rounded-[1.5rem] bg-[var(--background)] border border-[var(--border)] overflow-hidden flex-shrink-0 shadow-sm transition-transform group-hover:scale-105">
                                {item.image ? (
                                    <Image src={item.image} alt={item.name} fill className="object-contain" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl">☕</div>
                                )}
                                <span className="absolute -top-1 -right-1 w-6 h-6 bg-[var(--foreground)] text-white text-[10px] font-black rounded-xl flex items-center justify-center border-2 border-white shadow-lg">
                                    {item.quantity}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <h3 className="text-sm font-black text-[var(--foreground)] truncate leading-tight group-hover:text-[var(--accent)] transition-colors">
                                    {item.name}
                                </h3>
                                <p className="text-[10px] font-black text-[var(--foreground)]/40 uppercase tracking-widest mt-1">
                                    ${item.price.toLocaleString('es-AR')} c/u
                                </p>
                            </div>
                            <div className="text-sm font-black text-[var(--foreground)] flex flex-col justify-center">
                                ${(item.price * item.quantity).toLocaleString('es-AR')}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Breakdown */}
                <div className="space-y-4 pt-8 border-t border-[var(--border)]">
                    <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-[var(--foreground)]/40 uppercase tracking-widest">Subtotal</span>
                        <span className="text-[var(--foreground)]">${subtotal.toLocaleString('es-AR')}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-[var(--foreground)]/40 uppercase tracking-widest">Envío</span>
                        <span className={shipping.cost > 0 ? 'text-[var(--accent)]' : 'text-green-500'}>
                            {shipping.cost > 0 ? `$${shipping.cost.toLocaleString('es-AR')}` : '¡GRATIS!'}
                        </span>
                    </div>

                    {payment === 'efectivo' && (
                        <div className="flex justify-between items-center text-xs font-black text-green-500 bg-green-50/10 px-4 py-3 rounded-2xl border border-green-500/20 animate-in zoom-in-95">
                            <span className="uppercase tracking-widest">Descuento Efectivo (10%)</span>
                            <span>-${(subtotal * 0.1).toLocaleString('es-AR')}</span>
                        </div>
                    )}

                    <div className="pt-6 border-t border-[var(--border)] mt-6 group">
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-[10px] font-black text-[var(--foreground)]/40 uppercase tracking-[0.2em] block mb-1">Total Final</span>
                                <span className="text-4xl font-black text-[var(--foreground)] tracking-tighter leading-none group-hover:text-[var(--accent)] transition-colors">
                                    ${finalTotal.toLocaleString('es-AR')}
                                </span>
                            </div>
                            <div className="text-right pb-1">
                                <span className="text-[10px] text-[var(--foreground)]/40 font-bold uppercase tracking-widest">IVA Incluido</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Box */}
                {error && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-500 animate-in shake-1 duration-500">
                        <LuInfo size={20} className="shrink-0" />
                        <p className="text-xs font-bold uppercase tracking-wide leading-tight">{error}</p>
                    </div>
                )}

                {/* Panel confirmación de pedido creado */}
                {confirmedOrder ? (
                    <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 p-4 bg-green-50/50 dark:bg-green-950/20 border border-green-500/30 rounded-2xl">
                            <LuCircleCheck size={22} className="text-green-500 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-black text-[var(--foreground)]">¡Pedido #{confirmedOrder.id.slice(0, 8).toUpperCase()} creado!</p>
                                <p className="text-[10px] text-[var(--foreground)]/40 font-bold uppercase tracking-wide mt-0.5">Te enviamos los detalles por email</p>
                            </div>
                        </div>

                        {confirmedOrder.checkoutUrl ? (
                            /* Mercado Pago button */
                            <a
                                href={confirmedOrder.checkoutUrl}
                                className="flex items-center justify-center gap-3 w-full py-5 rounded-[2rem] font-black text-lg bg-[#009EE3] text-white hover:bg-[#0087C8] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#009EE3]/20"
                            >
                                <span className="uppercase tracking-[0.1em]">Ir a Pagar con Mercado Pago</span>
                                <LuExternalLink className="w-5 h-5" />
                            </a>
                        ) : (
                            /* Transfer / Cash: go to orders */
                            <button
                                onClick={() => router.push('/orders')}
                                className="flex items-center justify-center gap-3 w-full py-5 rounded-[2rem] font-black text-lg bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                <span className="uppercase tracking-[0.1em]">Ver mis Pedidos</span>
                                <LuArrowRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={handleCheckout}
                        disabled={loading || cart.length === 0}
                        className={`mt-8 w-full py-5 rounded-[2rem] font-black text-lg transition-all flex justify-center items-center gap-3 shadow-2xl relative overflow-hidden group ${loading || cart.length === 0
                            ? 'bg-[var(--foreground)]/10 text-[var(--foreground)]/30 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] shadow-blue-500/20'
                            }`}
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                <span className="uppercase tracking-widest">Procesando...</span>
                            </>
                        ) : (
                            <>
                                <span className="uppercase tracking-[0.1em]">Finalizar Compra</span>
                                <LuArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                )}

                <div className="mt-8 flex items-center justify-center gap-3 py-4 bg-[var(--background)] rounded-2xl">
                    <LuShieldCheck className="text-blue-500" size={18} />
                    <span className="text-[9px] font-black text-[var(--foreground)]/40 uppercase tracking-widest">Pago 100% Protegido</span>
                </div>
            </div>
        </div>
    );
}
