import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieBanner from "@/components/CookieBanner";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kyathos.shop'),
  title: {
    default: "KYATHOS | Tazas de Autor y Diseño 3D",
    template: "%s | KYATHOS"
  },
  description: "Diseñá tazas únicas con nuestro editor 3D o elegí de nuestras colecciones exclusivas. Cerámica premium, envíos a todo el país y lo cotidiano con intención.",
  keywords: ["tazas personalizadas", "regalos originales", "diseño 3D", "tazas de cerámica", "tazas con frases", "KYATHOS", "tazas autor"],
  authors: [{ name: "KYATHOS" }],
  creator: "KYATHOS",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://kyathos.shop",
    title: "KYATHOS | Tazas de Autor y Diseño 3D",
    description: "Creá tu propia taza en 3D o explorá nuestros diseños exclusivos. ¡Regalá algo único con alma!",
    siteName: "KYATHOS",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KYATHOS - Tazas con Intención",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KYATHOS | Tazas de Autor y Diseño 3D",
    description: "Diseñá tu propia taza en minutos con nuestro editor 3D. Calidad premium y envío a todo el país.",
    images: ["/og-image.jpg"],
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
    <html lang="es" className={`h-full ${cormorant.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body className="h-full flex flex-col antialiased">
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
