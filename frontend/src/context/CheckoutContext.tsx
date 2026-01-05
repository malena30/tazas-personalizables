"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useCartStore } from "@/store/cartStore";

export interface BuyerInfo {
    name: string;
    email: string;
    phone: string;
    dni: string;
    address: string;
    city: string;
    postalCode: string;
}

export interface ShippingInfo {
    method: string;
    cost: number;
}

interface CheckoutContextType {
    buyer: BuyerInfo;
    setBuyer: (buyer: BuyerInfo) => void;
    shipping: ShippingInfo;
    setShipping: (shipping: ShippingInfo) => void;
    payment: string;
    setPayment: (payment: string) => void;
    subtotal: number;
    setSubtotal: (subtotal: number) => void;
    total: number;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
    // 🟦 Traemos el carrito
    const { cart } = useCartStore();

    // 🟦 Datos del comprador
    const [buyer, setBuyer] = useState<BuyerInfo>({
        name: "",
        email: "",
        phone: "",
        dni: "",
        address: "",
        city: "",
        postalCode: "",
    });

    // 🟦 Envío
    const [shipping, setShipping] = useState<ShippingInfo>({
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

        if (savedBuyer) {
            try {
                setBuyer(JSON.parse(savedBuyer));
            } catch (e) {
                console.error("Error parsing saved buyer", e);
            }
        }
        if (savedShipping) {
            try {
                setShipping(JSON.parse(savedShipping));
            } catch (e) {
                console.error("Error parsing saved shipping", e);
            }
        }
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
                setSubtotal,
                total,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
}

export function useCheckout() {
    const context = useContext(CheckoutContext);
    if (context === undefined) {
        throw new Error("useCheckout must be used within a CheckoutProvider");
    }
    return context;
}
