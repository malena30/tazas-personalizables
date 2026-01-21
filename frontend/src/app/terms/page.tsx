"use client";

import Link from "next/link";
import { FaArrowLeft, FaGavel } from "react-icons/fa";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[var(--accent)] transition-colors mb-12"
                >
                    <FaArrowLeft size={12} />
                    Volver al inicio
                </Link>

                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
                        <FaGavel size={24} />
                    </div>
                    <h1 className="text-4xl font-title font-black text-[var(--foreground)] tracking-tighter">
                        Términos y Condiciones
                    </h1>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-400">
                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">1. Aceptación de los Términos</h2>
                        <p>
                            Al acceder y utilizar el sitio web Tazas.shop, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestros servicios.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">2. Personalización de Productos</h2>
                        <p>
                            Tazas.shop ofrece un servicio de personalización de tazas. El usuario es responsable de la calidad y legalidad de las imágenes y textos que suba a la plataforma. Nos reservamos el derecho de rechazar diseños que contengan contenido ofensivo, ilegal o que infrinja derechos de autor.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">3. Propiedad Intelectual</h2>
                        <p>
                            El usuario declara poseer los derechos necesarios sobre cualquier imagen o diseño proporcionado para la personalización. Tazas.shop no se hace responsable por infracciones de propiedad intelectual cometidas por los usuarios.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">4. Pagos y Precios</h2>
                        <p>
                            Todos los precios están expresados en pesos argentinos (ARS) e incluyen IVA, a menos que se indique lo contrario. Los pagos se procesan a través de Mercado Pago. El pedido se procesará una vez confirmado el pago.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">5. Envíos y Devoluciones</h2>
                        <p>
                            Debido a la naturaleza personalizada de nuestros productos, no se aceptan devoluciones a menos que el producto presente fallas de fabricación o daños durante el transporte. En tales casos, el usuario deberá contactarnos dentro de las 48 horas de recibido el pedido.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">6. Limitación de Responsabilidad</h2>
                        <p>
                            Tazas.shop no será responsable por daños indirectos, incidentales o consecuentes que resulten del uso o la imposibilidad de uso de nuestros servicios o productos.
                        </p>
                    </section>

                    <section className="pt-10 border-t border-[var(--border)]">
                        <p className="text-sm italic">
                            Última actualización: 20 de enero de 2026.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
