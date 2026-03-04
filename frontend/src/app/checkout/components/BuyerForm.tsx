"use client";

import { useEffect } from "react";
import { useCheckout, BuyerInfo } from "@/context/CheckoutContext";
import { useAuth } from "@/context/AuthContext";

export default function BuyerForm() {
    const { buyer, setBuyer } = useCheckout();
    const { user } = useAuth();

    // Autocompletar con datos del usuario si están disponibles
    useEffect(() => {
        if (user && !buyer.name && !buyer.email) {
            setBuyer({
                ...buyer,
                name: user.username || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.addresses?.[0]?.street || "",
                city: user.addresses?.[0]?.city || "",
                postalCode: user.addresses?.[0]?.postal_code || "",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBuyer({
            ...buyer,
            [e.target.name]: e.target.value,
        });
    };

    const inputClasses = "w-full px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-2xl focus:ring-4 focus:ring-[var(--accent)]/10 focus:border-[var(--accent)] outline-none transition-all text-[var(--foreground)] placeholder:text-[var(--foreground)]/30 font-medium";
    const labelClasses = "block text-xs font-black text-[var(--foreground)]/40 mb-2 ml-1 uppercase tracking-widest";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="md:col-span-2">
                <label className={labelClasses}>Nombre Completo</label>
                <input
                    type="text"
                    name="name"
                    placeholder="Ej: Juan Pérez"
                    value={buyer.name}
                    onChange={handleChange}
                    className={inputClasses}
                />
            </div>

            <div>
                <label className={labelClasses}>Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="juan@ejemplo.com"
                    value={buyer.email}
                    onChange={handleChange}
                    className={inputClasses}
                />
            </div>

            <div>
                <label className={labelClasses}>Teléfono</label>
                <input
                    type="text"
                    name="phone"
                    placeholder="11 1234 5678"
                    value={buyer.phone}
                    onChange={handleChange}
                    className={inputClasses}
                />
            </div>

            <div>
                <label className={labelClasses}>DNI / CUIL</label>
                <input
                    type="text"
                    name="dni"
                    placeholder="20-12345678-9"
                    value={buyer.dni}
                    onChange={handleChange}
                    className={inputClasses}
                />
            </div>

            <div>
                <label className={labelClasses}>Dirección</label>
                <input
                    type="text"
                    name="address"
                    placeholder="Av. Siempre Viva 742"
                    value={buyer.address}
                    onChange={handleChange}
                    className={inputClasses}
                />
            </div>

            <div>
                <label className={labelClasses}>Ciudad</label>
                <input
                    type="text"
                    name="city"
                    placeholder="CABA"
                    value={buyer.city}
                    onChange={handleChange}
                    className={inputClasses}
                />
            </div>

            <div>
                <label className={labelClasses}>Código Postal</label>
                <input
                    type="text"
                    name="postalCode"
                    placeholder="1425"
                    value={buyer.postalCode}
                    onChange={handleChange}
                    className={inputClasses}
                />
            </div>

        </div>
    );
}
