"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LuCheck, LuPackage, LuArrowRight, LuHouse, LuShoppingBag } from "react-icons/lu";
import { Suspense } from "react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId") || searchParams.get("external_reference") || "PENDIENTE";

    return (
        <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6">
            <div className="max-w-xl w-full">
                <div className="bg-white rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-1000">
                    <div className="p-10 sm:p-16 text-center">
                        {/* Success Icon */}
                        <div className="relative mx-auto w-24 h-24 mb-10">
                            <div className="absolute inset-0 bg-green-500/10 rounded-[2.5rem] rotate-12 animate-pulse" />
                            <div className="absolute inset-0 bg-green-500/20 rounded-[2.5rem] -rotate-12" />
                            <div className="relative w-full h-full bg-green-500 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-green-500/20 rotate-0">
                                <LuCheck size={48} />
                            </div>
                        </div>

                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
                            ¡PAGO <span className="text-green-500">RECIBIDO!</span>
                        </h1>
                        <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs mb-12">
                            Tu pedido está siendo procesado
                        </p>

                        {/* Order Info Card */}
                        <div className="bg-gray-50/50 rounded-3xl p-8 mb-12 border border-gray-100 text-left relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 text-gray-100 group-hover:text-gray-200 transition-colors">
                                <LuPackage size={80} />
                            </div>
                            <div className="relative z-10">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Referencia de Pedido</span>
                                <code className="text-lg font-black text-gray-900 tracking-tighter">#{orderId.slice(0, 12).toUpperCase()}</code>
                                <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 w-fit px-3 py-1.5 rounded-full">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    Confirmado por sistema
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link href="/profile" className="flex items-center justify-center gap-3 px-8 py-5 bg-[var(--foreground)] text-white rounded-[2rem] font-black text-sm hover:scale-[1.03] transition-all shadow-xl shadow-black/5 group">
                                <LuShoppingBag size={20} className="group-hover:rotate-12 transition-transform" />
                                VER PEDIDO
                            </Link>
                            <Link href="/" className="flex items-center justify-center gap-3 px-8 py-5 bg-white border-2 border-gray-100 text-gray-500 rounded-[2rem] font-black text-sm hover:bg-gray-50 transition-all group">
                                <LuHouse size={20} className="group-hover:-translate-y-1 transition-transform" />
                                VOLVER A INICIO
                            </Link>
                        </div>
                    </div>

                    {/* Footer Tip */}
                    <div className="bg-gray-50/50 p-6 text-center border-t border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                            Te enviamos un correo con los detalles de tu compra
                            <LuArrowRight size={12} />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
