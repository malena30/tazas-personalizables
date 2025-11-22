"use client";

import { useCheckout } from "@/context/CheckoutContext";

export default function PaymentMethods() {
  const { payment, setPayment } = useCheckout();

  const handleSelect = (method) => {
    setPayment(method);
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Método de Pago</h2>

      <div className="flex flex-col gap-3">

        {/* Pago en Efectivo */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="payment"
            checked={payment === "efectivo"}
            onChange={() => handleSelect("efectivo")}
          />
          <span>Efectivo (10% de descuento)</span>
        </label>

        {/* Transferencia */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="payment"
            checked={payment === "transferencia"}
            onChange={() => handleSelect("transferencia")}
          />
          <span>Transferencia bancaria</span>
        </label>

        {/* Mercado Pago (próximamente) */}
        <label className="flex items-center gap-2 cursor-pointer opacity-50">
          <input
            type="radio"
            name="payment"
            disabled
          />
          <span>Mercado Pago (Próximamente)</span>
        </label>

      </div>
    </div>
  );
}
