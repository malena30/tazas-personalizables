"use client";

import { useCheckout } from "@/context/CheckoutContext";

export default function ShippingCalculator() {
  const { shipping, setShipping } = useCheckout();

  const handleSelect = (method: string, cost: number) => {
    setShipping({ method, cost });
  };

  return (
    <div className="p-6 border border-[var(--border)] rounded-lg shadow-sm bg-[var(--background)]">
      <h2 className="text-xl font-title font-semibold text-[var(--foreground)] mb-4">Opciones de Envío</h2>

      <div className="flex flex-col gap-3">

        {/* Opción 1 - Correo Argentino estándar */}
        <label
          className="flex items-center gap-3 p-3 border border-[var(--border)] rounded cursor-pointer hover:bg-[var(--accent)] hover:bg-opacity-10 transition-colors"
        >
          <input
            type="radio"
            name="shipping"
            checked={shipping.method === "correo-estandar"}
            onChange={() => handleSelect("correo-estandar", 3500)}
          />
          <span className="font-text font-medium text-[var(--foreground)]">
            Correo Argentino - Estándar (<span className="font-mono">AR$ 3500</span>)
          </span>
        </label>

        {/* Opción 2 - Correo Argentino prioritario */}
        <label
          className="flex items-center gap-3 p-3 border border-[var(--border)] rounded cursor-pointer hover:bg-[var(--accent)] hover:bg-opacity-10 transition-colors"
        >
          <input
            type="radio"
            name="shipping"
            checked={shipping.method === "correo-prioritario"}
            onChange={() => handleSelect("correo-prioritario", 5200)}
          />
          <span className="font-text font-medium text-[var(--foreground)]">
            Correo Argentino - Prioritario (<span className="font-mono">AR$ 5200</span>)
          </span>
        </label>

        {/* Opción 3 - Retiro en persona */}
        <label
          className="flex items-center gap-3 p-3 border border-[var(--border)] rounded cursor-pointer hover:bg-[var(--accent)] hover:bg-opacity-10 transition-colors"
        >
          <input
            type="radio"
            name="shipping"
            checked={shipping.method === "retiro"}
            onChange={() => handleSelect("retiro", 0)}
          />
          <span className="font-text font-medium text-[var(--foreground)]">
            Retiro en persona (<span className="font-mono">Gratis</span>)
          </span>
        </label>
      </div>
    </div>
  );
}

