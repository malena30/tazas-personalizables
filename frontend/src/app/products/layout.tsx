import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Colecciones de Tazas Autor",
    description: "Explorá nuestras colecciones de tazas: Frases que inspiran y Formas con personalidad. Diseños exclusivos de KYATHOS.",
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
