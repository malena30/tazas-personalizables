"use client";

import { useCheckout } from "@/context/CheckoutContext";

export default function OrderSummary() {
  const { subtotal, shipping, total } = useCheckout();

  return (
    <div className="p-6 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Envío:</span>
          <span>${shipping.cost}</span>
        </div>

        <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t">
          <span>Total:</span>
          <span>${total}</span>
        </div>
      </div>

      <button className="mt-6 w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition">
        Confirmar Compra
      </button>
    </div>
  );
}
