import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: {
    default: "KYATHOS tazas | Crea tu diseño único en 3D",
    template: "%s | KYATHOS tazas"
  },
  description: "Diseña y compra tazas personalizadas de alta calidad con nuestro editor 3D. Lo cotidiano, con intención. Cerámica premium y envío a toda Argentina.",
  keywords: ["tazas personalizadas", "regalos personalizados", "diseño de tazas", "tazas de cerámica", "tazas 3D", "tazas con foto"],
  authors: [{ name: "KYATHOS Team" }],
  creator: "KYATHOS tazas",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://kyathos.shop",
    title: "KYATHOS tazas | Crea tu diseño único en 3D",
    description: "Diseña tu propia taza en minutos con nuestro editor 3D. Calidad premium y envío a todo el país. ¡Regalá algo único!",
    siteName: "KYATHOS tazas",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tazas Personalizables - Tazas.shop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KYATHOS tazas | Crea tu diseño único en 3D",
    description: "Diseña tu propia taza en minutos con nuestro editor 3D. Calidad premium y envío a todo el país.",
    images: ["/og-image.jpg"],
    creator: "@kyathostazas",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/LOGO.png",
    shortcut: "/LOGO.png",
    apple: "/LOGO.png",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="h-full flex flex-col">
        <AuthProvider>
          <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GA_ID || ""} />
          <Navbar />
          <main className="flex-1 pt-20">
            {children}
          </main>
          <Footer />
          <CookieBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
