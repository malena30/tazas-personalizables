"use client";

import Link from "next/link";
import { LuX, LuInfo, LuArrowRight, LuRefreshCw, LuMessageCircle } from "react-icons/lu";

export default function FailurePage() {
    return (
        <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6">
            <div className="max-w-xl w-full">
                <div className="bg-white rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-1000">
                    <div className="p-10 sm:p-16 text-center">
                        {/* Failure Icon */}
                        <div className="relative mx-auto w-24 h-24 mb-10">
                            <div className="absolute inset-0 bg-red-500/10 rounded-[2.5rem] rotate-12 animate-pulse" />
                            <div className="absolute inset-0 bg-red-500/20 rounded-[2.5rem] -rotate-12" />
                            <div className="relative w-full h-full bg-red-500 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-red-500/20 rotate-0">
                                <LuX size={48} />
                            </div>
                        </div>

                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
                            ¡UPS! ALGO <span className="text-red-500">FALLÓ</span>
                        </h1>
                        <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs mb-12">
                            No pudimos procesar tu pago
                        </p>

                        {/* Error Info Card */}
                        <div className="bg-red-50/50 rounded-3xl p-8 mb-12 border border-red-100/50 text-left relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 text-red-100 group-hover:text-red-200 transition-colors">
                                <LuInfo size={80} />
                            </div>
                            <div className="relative z-10">
                                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest block mb-2">Posibles Causas</span>
                                <ul className="space-y-2">
                                    <li className="text-sm font-bold text-red-700 flex items-center gap-2">
                                        <div className="w-1 h-1 bg-red-400 rounded-full" />
                                        Fondos insuficientes
                                    </li>
                                    <li className="text-sm font-bold text-red-700 flex items-center gap-2">
                                        <div className="w-1 h-1 bg-red-400 rounded-full" />
                                        Datos de tarjeta incorrectos
                                    </li>
                                    <li className="text-sm font-bold text-red-700 flex items-center gap-2">
                                        <div className="w-1 h-1 bg-red-400 rounded-full" />
                                        Operación rechazada por el banco
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link href="/checkout" className="flex items-center justify-center gap-3 px-8 py-5 bg-[var(--foreground)] text-white rounded-[2rem] font-black text-sm hover:scale-[1.03] transition-all shadow-xl shadow-black/5 group">
                                <LuRefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-700" />
                                REINTENTAR PAGO
                            </Link>
                            <Link href="/contact" className="flex items-center justify-center gap-3 px-8 py-5 bg-white border-2 border-gray-100 text-gray-500 rounded-[2rem] font-black text-sm hover:bg-gray-50 transition-all group">
                                <LuMessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                                SOPORTE TÉCNICO
                            </Link>
                        </div>
                    </div>

                    {/* Footer Tip */}
                    <div className="bg-gray-50/50 p-6 text-center border-t border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                            No se te ha realizado ningún cobro
                            <LuArrowRight size={12} />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
