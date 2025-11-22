"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
  // 🟦 Traemos el carrito
  const { cart } = useCartStore();

  // 🟦 Datos del comprador
  const [buyer, setBuyer] = useState({
    name: "",
    email: "",
    phone: "",
    dni: "",
    address: "",
    city: "",
    postalCode: "",
  });

  // 🟦 Envío
  const [shipping, setShipping] = useState({
    method: "",
    cost: 0,
  });

  // 🟦 Pago
  const [payment, setPayment] = useState("");

  // 🟦 Subtotal dinámico
  const [subtotal, setSubtotal] = useState(0);

  const total = subtotal + shipping.cost;

  // 🟩 1) Cargar datos desde localStorage cuando se abre la página
  useEffect(() => {
    const savedBuyer = localStorage.getItem("checkout_buyer");
    const savedShipping = localStorage.getItem("checkout_shipping");
    const savedPayment = localStorage.getItem("checkout_payment");

    if (savedBuyer) setBuyer(JSON.parse(savedBuyer));
    if (savedShipping) setShipping(JSON.parse(savedShipping));
    if (savedPayment) setPayment(savedPayment);
  }, []);

  // 🟩 2) Guardar buyer en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem("checkout_buyer", JSON.stringify(buyer));
  }, [buyer]);

  // 🟩 3) Guardar envío en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem("checkout_shipping", JSON.stringify(shipping));
  }, [shipping]);

  // 🟩 4) Guardar método de pago en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem("checkout_payment", payment);
  }, [payment]);

  // 🟩 5) actualizar subtotal cuando cambia el carrito
  useEffect(() => {
    if (!cart) return;
    const newSubtotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSubtotal(newSubtotal);
  }, [cart]);

  return (
    <CheckoutContext.Provider
      value={{
        buyer,
        setBuyer,
        shipping,
        setShipping,
        payment,
        setPayment,
        subtotal,
        setSubtotal,   // ✅ AGREGADO — ESTO FALTABA
        total,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  return useContext(CheckoutContext);
}
