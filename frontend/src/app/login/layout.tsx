import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mi Cuenta",
    description: "Iniciá sesión o registrate en KYATHOS para guardar tus diseños, ver tus favoritos y gestionar tus pedidos.",
    robots: {
        index: false,
        follow: true,
    }
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
