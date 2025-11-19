"use client";
import { useCartStore } from "@/store/cartStore";

export default function Cart() {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  if (cart.length === 0)
    return <p className="mt-6 text-gray-600">Tu carrito está vacío.</p>;

  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Carrito</h2>
      <ul className="space-y-2">
        {cart.map((item, index) => (
          <li
            key={`${item.id}-${index}`} // <--- Key única aunque se repita el mismo producto
            className="flex justify-between items-center border-b pb-2"
          >
            <span>
              {item.name} - ${item.price.toLocaleString("es-AR")}
            </span>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={clearCart}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
      >
        Vaciar carrito
      </button>
    </div>
  );
}
