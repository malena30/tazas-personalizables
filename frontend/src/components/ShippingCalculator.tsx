"use client";

import { useCheckout } from "@/context/CheckoutContext";

export default function ShippingCalculator() {
  const { shipping, setShipping } = useCheckout();

  const handleSelect = (method: string, cost: number) => {
    setShipping({ method, cost });
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Opciones de Envío</h2>

      <div className="flex flex-col gap-3">

        {/* Opción 1 - Correo Argentino estándar */}
        <label
          className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50"
        >
          <input
            type="radio"
            name="shipping"
            checked={shipping.method === "correo-estandar"}
            onChange={() => handleSelect("correo-estandar", 3500)}
          />
          <span className="font-medium">
            Correo Argentino - Estándar (AR$ 3500)
          </span>
        </label>

        {/* Opción 2 - Correo Argentino prioritario */}
        <label
          className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50"
        >
          <input
            type="radio"
            name="shipping"
            checked={shipping.method === "correo-prioritario"}
            onChange={() => handleSelect("correo-prioritario", 5200)}
          />
          <span className="font-medium">
            Correo Argentino - Prioritario (AR$ 5200)
          </span>
        </label>

        {/* Opción 3 - Retiro en persona */}
        <label
          className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50"
        >
          <input
            type="radio"
            name="shipping"
            checked={shipping.method === "retiro"}
            onChange={() => handleSelect("retiro", 0)}
          />
          <span className="font-medium">
            Retiro en persona (Gratis)
          </span>
        </label>
      </div>
    </div>
  );
}

