import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mis Favoritos",
    description: "Tu selección personal de tazas KYATHOS. Guardá lo que amás y completá tu colección cuando quieras.",
};

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
