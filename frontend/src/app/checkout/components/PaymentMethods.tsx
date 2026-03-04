"use client";

import { useCheckout } from "@/context/CheckoutContext";
import { LuCreditCard, LuBuilding2, LuBanknote, LuCheck } from "react-icons/lu";

export default function PaymentMethods() {
    const { payment, setPayment } = useCheckout();

    const handleSelect = (method: string) => {
        setPayment(method);
    };

    const methods = [
        {
            id: "mercadopago",
            title: "Mercado Pago",
            description: "Tarjetas de crédito, débito y dinero en cuenta.",
            icon: <LuCreditCard size={28} />,
            featured: true,
            color: "blue"
        },
        {
            id: "transferencia",
            title: "Transferencia Bancaria",
            description: "Pagá desde tu homebanking. Te enviamos los datos.",
            icon: <LuBuilding2 size={28} />,
            featured: false,
            color: "amber"
        },
        {
            id: "efectivo",
            title: "Efectivo / Rapipago",
            description: "10% de descuento pagando en efectivo.",
            icon: <LuBanknote size={28} />,
            featured: false,
            color: "green"
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-5">
            {methods.map((m) => (
                <button
                    key={m.id}
                    onClick={() => handleSelect(m.id)}
                    className={`flex items-center p-6 sm:p-8 rounded-[2.5rem] border-2 text-left transition-all duration-500 group relative overflow-hidden ${payment === m.id
                        ? "border-[var(--accent)] bg-[var(--card)] shadow-[0_20px_50px_rgba(0,0,0,0.08)] scale-[1.02]"
                        : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]/30 transition-all shadow-sm"
                        }`}
                >
                    {/* Decorative Background Element */}
                    {payment === m.id && (
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-[var(--accent)]/5 rounded-full blur-3xl animate-pulse" />
                    )}

                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${payment === m.id
                        ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20 rotate-3"
                        : "bg-[var(--background)] text-[var(--foreground)]/40 group-hover:text-[var(--foreground)]/60"
                        }`}>
                        {m.icon}
                    </div>

                    <div className="flex-1 ml-6">
                        <div className="flex items-center gap-3">
                            <h3 className={`text-lg font-black tracking-tight transition-colors ${payment === m.id ? "text-[var(--foreground)]" : "text-[var(--foreground)]/50"}`}>
                                {m.title}
                            </h3>
                            {m.featured && (
                                <span className="text-[9px] font-black bg-[var(--accent)] text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-[var(--accent)]/20">
                                    Recomendado
                                </span>
                            )}
                        </div>
                        <p className={`text-xs font-bold mt-1.5 leading-relaxed transition-colors ${payment === m.id ? "text-[var(--foreground)]/60" : "text-[var(--foreground)]/30"}`}>
                            {m.description}
                        </p>
                    </div>

                    <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${payment === m.id
                        ? "border-[var(--accent)] bg-[var(--accent)] shadow-lg shadow-[var(--accent)]/20 rotate-12"
                        : "border-[var(--border)] bg-[var(--card)]"
                        }`}>
                        {payment === m.id ? (
                            <LuCheck size={24} className="text-white animate-in zoom-in duration-300" />
                        ) : (
                            <div className="w-3 h-3 rounded-full bg-[var(--border)] group-hover:bg-[var(--foreground)]/20 transition-colors" />
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
}
