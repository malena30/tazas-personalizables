"use client";

import { useCheckout } from "@/context/CheckoutContext";

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
            icon: "💳",
            featured: true
        },
        {
            id: "transferencia",
            title: "Transferencia Bancaria",
            description: "Pagá desde tu homebanking. Te enviamos los datos.",
            icon: "🏦",
            featured: false
        },
        {
            id: "efectivo",
            title: "Efectivo / Rapipago",
            description: "10% de descuento pagando en efectivo.",
            icon: "💵",
            featured: false
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-6">
            {methods.map((m) => (
                <button
                    key={m.id}
                    onClick={() => handleSelect(m.id)}
                    className={`flex items-center p-8 rounded-[2rem] border-2 text-left transition-all duration-500 group relative overflow-hidden ${payment === m.id
                        ? "border-[var(--accent)] bg-[var(--cream)] shadow-lg shadow-black/5"
                        : "border-gray-100 dark:border-zinc-800 hover:border-[var(--accent)]/30 bg-[var(--cream)] dark:bg-zinc-900"
                        }`}
                >
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mr-6 transition-transform duration-500 group-hover:scale-110 ${payment === m.id ? "bg-[var(--accent)] text-white shadow-lg shadow-black/10" : "bg-gray-50 dark:bg-zinc-800 text-gray-400"
                        }`}>
                        {m.icon}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">{m.title}</h3>
                            {m.featured && (
                                <span className="text-[10px] font-black bg-[var(--accent)] text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-black/10">
                                    Recomendado
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{m.description}</p>
                    </div>

                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${payment === m.id ? "border-[var(--accent)] bg-[var(--accent)] shadow-lg shadow-black/10" : "border-gray-200 dark:border-zinc-700"
                        }`}>
                        {payment === m.id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-white animate-in zoom-in duration-300" />
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
}
