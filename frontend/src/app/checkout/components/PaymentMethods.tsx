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
        <div className="grid grid-cols-1 gap-4">
            {methods.map((m) => (
                <button
                    key={m.id}
                    onClick={() => handleSelect(m.id)}
                    className={`flex items-center p-5 rounded-2xl border-2 text-left transition-all duration-300 ${payment === m.id
                            ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 ring-1 ring-blue-600"
                            : "border-gray-100 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"
                        }`}
                >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-2xl mr-5">
                        {m.icon}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-[var(--foreground)]">{m.title}</h3>
                            {m.featured && (
                                <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    Recomendado
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{m.description}</p>
                    </div>

                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${payment === m.id ? "border-blue-600 bg-blue-600" : "border-gray-200 dark:border-zinc-700"
                        }`}>
                        {payment === m.id && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
}
