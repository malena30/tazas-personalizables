"use client";

import { useState } from "react";
import Link from "next/link";
import { FaChevronDown, FaChevronUp, FaQuestionCircle, FaTruck, FaPalette, FaCreditCard, FaShieldAlt } from "react-icons/fa";

const faqs = [
    {
        category: "Envíos",
        icon: <FaTruck className="text-blue-600" />,
        questions: [
            {
                q: "¿Cuánto tarda en llegar mi pedido?",
                a: "El tiempo de producción es de 24 a 48 horas hábiles. Una vez despachado, el envío suele tardar entre 2 y 5 días hábiles dependiendo de tu ubicación en Argentina."
            },
            {
                q: "¿Hacen envíos a todo el país?",
                a: "Sí, realizamos envíos a toda la República Argentina a través de los principales servicios de logística con seguimiento en tiempo real."
            },
            {
                q: "¿Puedo retirar mi pedido personalmente?",
                a: "Actualmente operamos exclusivamente con envíos para garantizar la rapidez y seguridad de las entregas."
            }
        ]
    },
    {
        category: "Personalización",
        icon: <FaPalette className="text-purple-600" />,
        questions: [
            {
                q: "¿Cómo diseño mi taza?",
                a: "Es muy simple: ve a nuestra sección 'Personalizar', elige tu modelo de taza y usa nuestro editor 3D para subir fotos, agregar texto o elegir colores. ¡Verás el resultado en tiempo real!"
            },
            {
                q: "¿Qué calidad tienen las imágenes?",
                a: "Recomendamos subir imágenes en alta resolución (mínimo 1000px) para asegurar una impresión nítida y vibrante. Nuestro sistema te avisará si la calidad es muy baja."
            }
        ]
    },
    {
        category: "Pagos y Seguridad",
        icon: <FaCreditCard className="text-green-600" />,
        questions: [
            {
                q: "¿Qué medios de pago aceptan?",
                a: "Aceptamos todos los medios de pago a través de Mercado Pago: tarjetas de crédito, débito, efectivo (Rapipago/Pago Fácil) y dinero en cuenta de Mercado Pago."
            },
            {
                q: "¿Es seguro comprar en el sitio?",
                a: "Totalmente. Contamos con certificados SSL y todas las transacciones se procesan a través de la plataforma segura de Mercado Pago, protegiendo tus datos bancarios."
            }
        ]
    },
    {
        category: "Garantía y Devoluciones",
        icon: <FaShieldAlt className="text-red-600" />,
        questions: [
            {
                q: "¿Qué pasa si mi taza llega rota?",
                a: "Aunque protegemos cada envío con embalaje especial, si tu producto llega dañado, contáctanos dentro de las 48hs de recibido con una foto y te enviaremos una nueva sin cargo."
            },
            {
                q: "¿Puedo devolver un producto personalizado?",
                a: "Al ser productos creados a medida, solo aceptamos devoluciones por fallas de fabricación o daños en el transporte. Te recomendamos revisar bien tu diseño antes de confirmar la compra."
            }
        ]
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<string | null>(null);

    const toggleFAQ = (id: string) => {
        setOpenIndex(openIndex === id ? null : id);
    };

    return (
        <main className="min-h-screen bg-[var(--background)] py-20 px-6">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                        <FaQuestionCircle />
                        <span>Centro de Ayuda</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-title font-black text-[var(--foreground)] tracking-tighter mb-6">
                        Preguntas <span className="text-[var(--accent)]">Frecuentes</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-xl leading-relaxed">
                        Todo lo que necesitas saber para crear tu taza perfecta.
                    </p>
                </div>

                {/* FAQ Content */}
                <div className="space-y-12">
                    {faqs.map((category, catIdx) => (
                        <div key={catIdx} className="space-y-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-[var(--border)] flex items-center justify-center shadow-sm">
                                    {category.icon}
                                </div>
                                <h2 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
                                    {category.category}
                                </h2>
                            </div>

                            <div className="grid gap-4">
                                {category.questions.map((faq, qIdx) => {
                                    const id = `${catIdx}-${qIdx}`;
                                    const isOpen = openIndex === id;

                                    return (
                                        <div
                                            key={qIdx}
                                            className={`group border border-[var(--border)] rounded-3xl transition-all duration-300 ${isOpen ? 'bg-white dark:bg-zinc-900 shadow-xl shadow-black/5' : 'bg-transparent hover:border-[var(--accent)]'
                                                }`}
                                        >
                                            <button
                                                onClick={() => toggleFAQ(id)}
                                                className="w-full px-8 py-6 flex items-center justify-between text-left"
                                            >
                                                <span className="text-lg font-bold text-[var(--foreground)] pr-8">
                                                    {faq.q}
                                                </span>
                                                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[var(--accent)] text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 group-hover:bg-[var(--accent)]/10 group-hover:text-[var(--accent)]'
                                                    }`}>
                                                    {isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                                                </div>
                                            </button>

                                            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                }`}>
                                                <div className="px-8 pb-8 text-gray-500 dark:text-gray-400 leading-relaxed">
                                                    {faq.a}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-20 p-12 bg-[var(--foreground)] rounded-[3rem] text-center text-[var(--background)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    <h3 className="text-3xl font-black mb-4 relative z-10">¿Aún tienes dudas?</h3>
                    <p className="text-lg opacity-60 mb-8 relative z-10">
                        Estamos aquí para ayudarte en lo que necesites.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--accent)] text-[var(--background)] rounded-2xl font-black hover:scale-105 transition-all relative z-10"
                    >
                        Contactar Soporte
                    </Link>
                </div>
            </div>
        </main>
    );
}
