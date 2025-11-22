"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useCheckout } from "@/context/CheckoutContext";

import BuyerForm from './components/BuyerForm'
import ShippingOptions from './components/ShippingOptions'
import PaymentMethods from './components/PaymentMethods'
import OrderSummary from './components/OrderSummary'

export default function CheckoutPage() {
  const { cart } = useCartStore();
  const { setSubtotal } = useCheckout();

  useEffect(() => {
    if (!cart) return;

    const newSubtotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    setSubtotal(newSubtotal);
  }, [cart, setSubtotal]);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <BuyerForm />
      <ShippingOptions />
      <PaymentMethods />
      <OrderSummary />
    </div>
  )
}
