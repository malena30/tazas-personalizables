"use client";

import { useCheckout } from "@/context/CheckoutContext";
import { LuCreditCard, LuBuilding2, LuBanknote, LuCheck, LuCopy, LuMapPin, LuHash, LuUser } from "react-icons/lu";

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
                <div key={m.id}>
                    <button
                        onClick={() => handleSelect(m.id)}
                        className={`w-full flex items-center p-6 sm:p-8 rounded-[2.5rem] border-2 text-left transition-all duration-500 group relative overflow-hidden ${payment === m.id
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

                    {/* Info panels that expand when selected */}
                    {payment === m.id && m.id === "transferencia" && <BankDetailsPanel />}
                    {payment === m.id && m.id === "efectivo" && <CashPanel />}
                </div>
            ))}
        </div>
    );
}

// ------ Sub-panel: Datos bancarios ------
function BankDetailsPanel() {
    const copy = (text: string) => navigator.clipboard?.writeText(text);
    const field = (label: string, value: string) => (
        <div className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
            <span className="text-[10px] font-black text-[var(--foreground)]/40 uppercase tracking-wider">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--foreground)]">{value}</span>
                <button onClick={() => copy(value)} className="p-1 rounded-lg hover:bg-[var(--accent)]/10 text-[var(--foreground)]/30 hover:text-[var(--accent)] transition-all" title="Copiar">
                    <LuCopy size={12} />
                </button>
            </div>
        </div>
    );
    return (
        <div className="mt-4 p-5 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/30 animate-in slide-in-from-top-2 fade-in duration-300 space-y-1">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">📋 Recibirás los datos de transferencia por email al confirmar el pedido</p>
            {field("Banco", "Banco Galicia")}
            {field("Titular", "Malena Cortés")}
            {field("CBU", "0070999820000012345678")}
            {field("Alias", "KYATHOS.TAZAS")}
            {field("CUIL/CUIT", "27-12345678-9")}
            <p className="text-[10px] text-[var(--foreground)]/40 font-bold mt-3 leading-relaxed">
                * Enviar comprobante por WhatsApp o email. El pedido se confirma al acreditar el pago.
            </p>
        </div>
    );
}

// ------ Sub-panel: Instrucciones Efectivo ------
function CashPanel() {
    return (
        <div className="mt-4 p-5 bg-green-50/50 dark:bg-green-950/20 rounded-2xl border border-green-200/50 dark:border-green-800/30 animate-in slide-in-from-top-2 fade-in duration-300">
            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-4">🏪 Dónde y cómo pagar</p>
            <ol className="space-y-3">
                {[
                    { num: "1", text: "Confirmá tu pedido haciendo clic en \"Finalizar Compra\"" },
                    { num: "2", text: "Recibirás un email con el código de pago" },
                    { num: "3", text: "Presentate con ese código en cualquier local de Rapipago, PagoFácil o Cobro Express" },
                    { num: "4", text: "Conservá el ticket de pago como comprobante" },
                ].map(s => (
                    <li key={s.num} className="flex gap-3 items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white text-[10px] font-black flex items-center justify-center">{s.num}</span>
                        <span className="text-xs font-bold text-[var(--foreground)]/60 leading-relaxed pt-0.5">{s.text}</span>
                    </li>
                ))}
            </ol>
            <p className="text-[10px] text-green-600 font-black mt-4">✅ 10% de descuento aplicado automáticamente</p>
        </div>
    );
}
