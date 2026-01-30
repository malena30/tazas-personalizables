"use client";

import Link from "next/link";
import { LuArrowLeft, LuShieldCheck } from "react-icons/lu";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[var(--accent)] transition-colors mb-12"
                >
                    <LuArrowLeft size={12} />
                    Volver al inicio
                </Link>

                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center">
                        <LuShieldCheck size={24} />
                    </div>
                    <h1 className="text-4xl font-title font-black text-[var(--foreground)] tracking-tighter">
                        Política de Privacidad
                    </h1>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-400">
                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">1. Recolección de Información</h2>
                        <p>
                            En Tazas.shop, recolectamos información personal necesaria para procesar sus pedidos y mejorar su experiencia. Esto incluye nombre, correo electrónico, dirección de envío y número de teléfono.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">2. Uso de los Datos</h2>
                        <p>
                            Utilizamos sus datos para:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Procesar y enviar sus pedidos.</li>
                            <li>Comunicarnos con usted sobre el estado de su compra.</li>
                            <li>Enviar boletines informativos (solo si se ha suscrito).</li>
                            <li>Mejorar nuestro sitio web y servicios.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">3. Protección de la Información</h2>
                        <p>
                            Implementamos medidas de seguridad para proteger su información personal. Los datos de pago son procesados de forma segura por Mercado Pago y nunca se almacenan en nuestros servidores.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">4. Cookies</h2>
                        <p>
                            Utilizamos cookies para mejorar la navegación, recordar sus preferencias y analizar el tráfico del sitio. Usted puede configurar su navegador para rechazar cookies, aunque esto puede afectar algunas funcionalidades del sitio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">5. Terceros</h2>
                        <p>
                            No vendemos ni alquilamos su información personal a terceros. Compartimos datos solo con proveedores de servicios necesarios para operar (ej: servicios de envío, procesadores de pago).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">6. Sus Derechos</h2>
                        <p>
                            Usted tiene derecho a acceder, corregir o solicitar la eliminación de sus datos personales en cualquier momento. Para ello, puede contactarnos a través de nuestro correo electrónico de soporte.
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
