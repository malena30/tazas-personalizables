"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (product: Product & { quantity?: number }) => void;
  removeFromCart: (id: number) => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) =>
        set((state) => {
          const existingProduct = state.cart.find((item) => item.id === product.id);

          if (existingProduct) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + (product.quantity || 1) }
                  : item
              ),
            };
          } else {
            return { cart: [...state.cart, { ...product, quantity: product.quantity || 1 }] };
          }
        }),

      removeFromCart: (id) =>
        set({
          cart: get().cart.filter((item) => item.id !== id),
        }),

      increaseQty: (id) =>
        set({
          cart: get().cart.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        }),

      decreaseQty: (id) =>
        set({
          cart: get().cart
            .map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0),
        }),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-storage",
    }
  )
);


