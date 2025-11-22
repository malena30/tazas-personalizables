"use client";
import { useState } from "react";
import { useCheckout } from "@/context/CheckoutContext";
import ShippingCalculator from "@/components/ShippingCalculator";

export default function ShippingOptions() {
  const { shipping, setShipping } = useCheckout();
  const [showCalculator, setShowCalculator] = useState(false);

  const handleSelect = (method) => {
    setShipping({
      ...shipping,
      method,
    });
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Método de Envío</h2>

      <div className="flex flex-col gap-3">

        {/* ENVÍO CLÁSICO */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="shipping"
            checked={shipping.method === "correo"}
            onChange={() => {
              handleSelect("correo");
              setShowCalculator(true);
            }}
          />
          <span>Correo Argentino (costo según ciudad)</span>
        </label>

        {/* RETIRO EN DOMICILIO */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="shipping"
            checked={shipping.method === "retiro"}
            onChange={() => {
              handleSelect("retiro");
              setShowCalculator(false);
              setShipping({ method: "retiro", cost: 0 });
            }}
          />
          <span>Retiro por domicilio (Gratis)</span>
        </label>
      </div>

      {/* MOSTRAR CALCULADORA SOLO SI ELIGE CORREO ARGENTINO */}
      {showCalculator && (
        <div className="mt-4">
          <ShippingCalculator />
        </div>
      )}
    </div>
  );
}
