"use client";

import { useCheckout } from "@/context/CheckoutContext";
import ShippingCalculator from "@/components/ShippingCalculator";

export default function ShippingOptions() {
    const { shipping, setShipping } = useCheckout();

    const handleSelect = (method: string, cost: number = 0) => {
        setShipping({
            method,
            cost,
        });
    };

    const methods = [
        {
            id: "correo",
            title: "Correo Argentino",
            description: "Entrega a domicilio en todo el país.",
            price: shipping.method === "correo" ? (shipping.cost > 0 ? `$${shipping.cost}` : "Calculando...") : "Consultar",
            icon: "🚚"
        },
        {
            id: "retiro",
            title: "Retiro en Domicilio",
            description: "Retirá tu pedido por nuestro taller sin cargo.",
            price: "Gratis",
            icon: "🏠"
        }
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {methods.map((m) => (
                    <button
                        key={m.id}
                        onClick={() => handleSelect(m.id, m.id === "retiro" ? 0 : shipping.cost)}
                        className={`flex flex-col p-8 rounded-[2rem] border-2 text-left transition-all duration-500 group relative overflow-hidden ${shipping.method === m.id
                            ? "border-[var(--accent)] bg-[var(--cream)] shadow-lg shadow-black/5"
                            : "border-gray-100 dark:border-zinc-800 hover:border-[var(--accent)]/30 bg-[var(--cream)] dark:bg-zinc-900"
                            }`}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-500 group-hover:scale-110 ${shipping.method === m.id ? "bg-[var(--accent)] text-white shadow-lg shadow-black/10" : "bg-gray-50 dark:bg-zinc-800 text-gray-400"
                                }`}>
                                {m.icon}
                            </div>
                            {shipping.method === m.id && (
                                <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-lg shadow-black/10 animate-in zoom-in duration-300">
                                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">{m.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex-1 leading-relaxed">{m.description}</p>
                        <div className="mt-6 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Costo</span>
                            <span className="text-lg font-black text-[var(--accent)]">{m.price}</span>
                        </div>
                    </button>
                ))}
            </div>

            {shipping.method === "correo" && (
                <div className="mt-6 p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-300">
                    <h4 className="text-sm font-bold text-[var(--foreground)] mb-4 uppercase tracking-wider">Calcular costo de envío</h4>
                    <ShippingCalculator />
                </div>
            )}
        </div>
    );
}
