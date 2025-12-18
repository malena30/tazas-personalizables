"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useCheckout } from "@/context/CheckoutContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import BuyerForm from './components/BuyerForm'
import ShippingOptions from './components/ShippingOptions'
import PaymentMethods from './components/PaymentMethods'
import OrderSummary from './components/OrderSummary'

export default function CheckoutPage() {
  const { cart } = useCartStore();
  const { setSubtotal } = useCheckout();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/checkout");
    }
  }, [user, loading, router]);
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
