"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";
import { useCartStore } from "@/store/cartStore";
import { createOrder } from "@/lib/api";

export default function OrderSummary() {
  const { subtotal, shipping, total, buyer, payment } = useCheckout();
  const { cart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!cart || cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }
    if (!buyer.name || !buyer.email || !buyer.address) {
      alert("Por favor completa los datos de envío");
      return;
    }
    if (!payment) {
      alert("Por favor selecciona un método de pago");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          design_id: item.designId || null,
          product_id: !item.designId ? String(item.id) : null, // Si no es diseño, asumimos producto
          quantity: item.quantity,
          price: item.price
        })),
        shipping_address: buyer,
        payment_method: payment,
        total_amount: total
      };

      const order = await createOrder(orderData);
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (error) {
      console.error("Error al crear la orden:", error);
      alert(error.message || "Hubo un error al procesar tu pedido");
    } finally {
      setLoading(false);
    }
  };

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

      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`mt-6 w-full py-3 rounded transition flex justify-center items-center ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'
          }`}
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        ) : (
          "Confirmar Compra"
        )}
      </button>
    </div>
  );
}
