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
                postalCode: user.addresses?.[0]?.postalCode || "",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBuyer({
            ...buyer,
            [e.target.name]: e.target.value,
        });
    };

    const inputClasses = "w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-[var(--foreground)] placeholder:text-gray-400";
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

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
