import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Diseñá tu Propia Taza",
    description: "Usá nuestro editor 3D interactivo para crear tazas personalizadas únicas. Agregá fotos, textos, stickers y dale vida a tu diseño.",
};

export default function CustomizerLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
