import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-12"
                >
                    <FaArrowLeft size={12} />
                    Volver al inicio
                </Link>

                <h1 className="text-4xl md:text-5xl font-title font-black text-[var(--foreground)] tracking-tighter mb-8">
                    Política de <span className="text-blue-600">Privacidad</span>
                </h1>

                <div className="prose prose-blue dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-400">
                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">1. Información que Recolectamos</h2>
                        <p>
                            Recolectamos información personal que usted nos proporciona directamente, como nombre, dirección de correo electrónico, dirección de envío y número de teléfono, cuando se registra en nuestro sitio o realiza una compra.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">2. Uso de la Información</h2>
                        <p>
                            Utilizamos su información para procesar sus pedidos, gestionar su cuenta, mejorar nuestros servicios y, si usted lo autoriza, enviarle comunicaciones promocionales.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">3. Protección de Datos</h2>
                        <p>
                            Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos personales contra el acceso no autorizado, la alteración o la destrucción.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">4. Cookies</h2>
                        <p>
                            Utilizamos cookies para mejorar su experiencia de navegación, recordar sus preferencias y analizar el tráfico del sitio. Puede configurar su navegador para rechazar las cookies, pero esto podría afectar la funcionalidad del sitio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">5. Terceros</h2>
                        <p>
                            No vendemos ni alquilamos su información personal a terceros. Compartimos datos con proveedores de servicios necesarios para operar nuestro negocio (ej: procesadores de pago como Mercado Pago y servicios de envío).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">6. Sus Derechos</h2>
                        <p>
                            Usted tiene derecho a acceder, rectificar o eliminar sus datos personales en cualquier momento a través de la configuración de su perfil o contactándonos directamente.
                        </p>
                    </section>
                </div>

                <div className="mt-20 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-300 font-medium text-center">
                        Tu privacidad es nuestra prioridad. Si tienes preguntas, escríbenos a <a href="mailto:privacy@tazas.shop" className="font-bold underline">privacy@tazas.shop</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
