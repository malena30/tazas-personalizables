"use client";

import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const { cart, increaseQty, decreaseQty, removeFromCart, clearCart } =
    useCartStore();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tu carrito</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-lg">El carrito está vacío.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="px-3 py-1 border rounded"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() => increaseQty(item.id)}
                  className="px-3 py-1 border rounded"
                >
                  +
                </button>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="ml-4 text-red-600"
                >
                  X
                </button>
              </div>
            </div>
          ))}

          <div className="text-right mt-6">
            <p className="text-2xl font-bold">Total: ${total.toFixed(2)}</p>

            <button
              onClick={clearCart}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
            >
              Vaciar carrito
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
