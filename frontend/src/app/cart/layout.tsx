import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tu Carrito",
    description: "Estás a un paso de tener tus tazas KYATHOS. Revisá tu pedido y procedé al pago seguro.",
    robots: {
        index: false,
        follow: true,
    }
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
