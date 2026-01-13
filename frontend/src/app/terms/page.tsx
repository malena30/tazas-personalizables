import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function TermsPage() {
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
                    Términos y <span className="text-blue-600">Condiciones</span>
                </h1>

                <div className="prose prose-blue dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-400">
                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">1. Aceptación de los Términos</h2>
                        <p>
                            Al acceder y utilizar el sitio web Tazas.shop, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestros servicios.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">2. Personalización de Productos</h2>
                        <p>
                            Tazas.shop ofrece una herramienta de personalización. El usuario es el único responsable del contenido (imágenes, textos, diseños) que cargue en la plataforma. Nos reservamos el derecho de rechazar pedidos que contengan material ofensivo, ilegal o que infrinja derechos de autor.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">3. Propiedad Intelectual</h2>
                        <p>
                            Todos los diseños creados por el usuario utilizando nuestras herramientas pertenecen al usuario. Sin embargo, los elementos gráficos, fuentes y la interfaz de la herramienta de personalización son propiedad exclusiva de Tazas.shop.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">4. Envíos y Entregas</h2>
                        <p>
                            Los tiempos de entrega son estimativos y pueden variar según la ubicación y la demanda. Tazas.shop no se hace responsable por retrasos causados por el servicio de mensajería externo.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">5. Devoluciones y Reembolsos</h2>
                        <p>
                            Debido a la naturaleza personalizada de nuestros productos, no se aceptan devoluciones a menos que el producto presente fallas de fabricación o daños durante el envío. En tales casos, el usuario deberá contactarnos dentro de las 48 horas posteriores a la recepción.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">6. Modificaciones del Servicio</h2>
                        <p>
                            Nos reservamos el derecho de modificar o interrumpir el servicio en cualquier momento sin previo aviso. Los precios de nuestros productos están sujetos a cambios sin previo aviso.
                        </p>
                    </section>
                </div>

                <div className="mt-20 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-300 font-medium text-center">
                        Última actualización: 13 de enero de 2026. Si tienes dudas, contáctanos en <a href="mailto:legal@tazas.shop" className="font-bold underline">legal@tazas.shop</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
