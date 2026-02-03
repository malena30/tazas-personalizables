"use client";

import { useState } from "react";
import { LuMail, LuPhone, LuMapPin, LuInstagram, LuTwitter, LuFacebook, LuSend, LuClock } from "react-icons/lu";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        // Simulación de envío
        setTimeout(() => {
            setStatus("success");
            setFormData({ name: "", email: "", subject: "", message: "" });
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-[var(--background)] py-20 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                        <LuMail />
                        <span>Contacto</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-title font-black text-[var(--foreground)] tracking-tighter mb-6">
                        ¿Hablamos de tu <span className="text-[var(--accent)]">Próxima Taza?</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-xl leading-relaxed max-w-2xl mx-auto">
                        Estamos aquí para ayudarte. Escríbenos y te responderemos lo antes posible.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="p-8 bg-[var(--cream)] dark:bg-zinc-900 rounded-[2.5rem] border border-[var(--border)] shadow-xl shadow-black/5">
                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                    <LuMail size={20} />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Email</h3>
                                <p className="text-lg font-bold text-[var(--foreground)]">hola@kyathos.shop</p>
                            </div>

                            <div className="p-8 bg-[var(--cream)] dark:bg-zinc-900 rounded-[2.5rem] border border-[var(--border)] shadow-xl shadow-black/5">
                                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                                    <LuPhone size={20} />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Teléfono</h3>
                                <p className="text-lg font-bold text-[var(--foreground)]">+54 11 2233-4455</p>
                            </div>

                            <div className="p-8 bg-[var(--cream)] dark:bg-zinc-900 rounded-[2.5rem] border border-[var(--border)] shadow-xl shadow-black/5">
                                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                                    <LuMapPin size={20} />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Ubicación</h3>
                                <p className="text-lg font-bold text-[var(--foreground)]">Buenos Aires, Argentina</p>
                            </div>

                            <div className="p-8 bg-[var(--cream)] dark:bg-zinc-900 rounded-[2.5rem] border border-[var(--border)] shadow-xl shadow-black/5">
                                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                                    <LuClock size={20} />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Horario</h3>
                                <p className="text-lg font-bold text-[var(--foreground)]">Lun - Vie: 9hs a 18hs</p>
                            </div>
                        </div>

                        <div className="p-10 bg-[var(--foreground)] rounded-[3rem] text-[var(--background)]">
                            <h3 className="text-2xl font-black mb-6">Síguenos en redes</h3>
                            <div className="flex gap-4">
                                {[
                                    { icon: <LuInstagram size={24} />, label: "Instagram" },
                                    { icon: <LuTwitter size={24} />, label: "Twitter" },
                                    { icon: <LuFacebook size={24} />, label: "Facebook" }
                                ].map((social, idx) => (
                                    <a
                                        key={idx}
                                        href="#"
                                        className="w-14 h-14 bg-[var(--background)]/10 rounded-2xl flex items-center justify-center hover:bg-[var(--accent)] hover:text-[var(--background)] transition-all"
                                        aria-label={social.label}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-[var(--cream)] dark:bg-zinc-900 p-10 md:p-12 rounded-[3.5rem] border border-[var(--border)] shadow-2xl shadow-black/5">
                        <h2 className="text-3xl font-black text-[var(--foreground)] mb-8 tracking-tight">Envíanos un mensaje</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Nombre</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-800 border border-[var(--border)] rounded-2xl focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10 outline-none transition-all font-bold"
                                        placeholder="Tu nombre"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Email</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-800 border border-[var(--border)] rounded-2xl focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10 outline-none transition-all font-bold"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Asunto</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-800 border border-[var(--border)] rounded-2xl focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10 outline-none transition-all font-bold"
                                    placeholder="¿En qué podemos ayudarte?"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Mensaje</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-800 border border-[var(--border)] rounded-2xl focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10 outline-none transition-all font-bold resize-none"
                                    placeholder="Escribe tu mensaje aquí..."
                                />
                            </div>

                            <button
                                disabled={status === "loading"}
                                type="submit"
                                className="w-full py-5 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black text-lg shadow-xl shadow-black/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {status === "loading" ? (
                                    <div className="w-6 h-6 border-4 border-[var(--background)]/30 border-t-[var(--background)] rounded-full animate-spin"></div>
                                ) : status === "success" ? (
                                    <>¡Mensaje Enviado!</>
                                ) : (
                                    <>
                                        <LuSend size={18} />
                                        Enviar Mensaje
                                    </>
                                )}
                            </button>

                            {status === "success" && (
                                <p className="text-center text-green-600 font-bold animate-in fade-in slide-in-from-top-2">
                                    ¡Gracias! Te responderemos muy pronto.
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
