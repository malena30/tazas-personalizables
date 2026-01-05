"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useCheckout } from "@/context/CheckoutContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import BuyerForm from './components/BuyerForm';
import ShippingOptions from './components/ShippingOptions';
import PaymentMethods from './components/PaymentMethods';
import OrderSummary from './components/OrderSummary';

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Main Content - Steps */}
                    <div className="flex-1 space-y-8">
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">Finalizar Compra</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Completá tus datos para procesar el pedido.</p>
                        </header>

                        <div className="space-y-6">
                            <section className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
                                <div className="p-6 sm:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">1</span>
                                        <h2 className="text-xl font-semibold text-[var(--foreground)]">Datos Personales</h2>
                                    </div>
                                    <BuyerForm />
                                </div>
                            </section>

                            <section className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
                                <div className="p-6 sm:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">2</span>
                                        <h2 className="text-xl font-semibold text-[var(--foreground)]">Envío</h2>
                                    </div>
                                    <ShippingOptions />
                                </div>
                            </section>

                            <section className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
                                <div className="p-6 sm:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">3</span>
                                        <h2 className="text-xl font-semibold text-[var(--foreground)]">Pago</h2>
                                    </div>
                                    <PaymentMethods />
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Sidebar - Summary */}
                    <aside className="lg:w-96">
                        <div className="sticky top-24">
                            <OrderSummary />
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
}
