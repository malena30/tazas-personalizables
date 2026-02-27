import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contacto",
    description: "Estamos para ayudarte. Ponete en contacto con KYATHOS por dudas sobre tus pedidos o diseños personalizados.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
