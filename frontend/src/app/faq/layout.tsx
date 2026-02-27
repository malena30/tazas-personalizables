import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Preguntas Frecuentes",
    description: "¿Tenés dudas sobre envíos, materiales o el editor 3D? Encontrá acá todas las respuestas para tu compra en KYATHOS.",
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
