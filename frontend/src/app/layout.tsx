import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: {
    default: "Tazas Personalizables | Crea tu diseño único",
    template: "%s | Tazas.shop"
  },
  description: "La mejor plataforma para crear y comprar tazas personalizadas de alta calidad. Tu diseño, tu estilo, tu taza.",
  keywords: ["tazas personalizadas", "regalos personalizados", "diseño de tazas", "tazas de cerámica", "tazas de plástico"],
  authors: [{ name: "Tazas.shop Team" }],
  creator: "Tazas.shop",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://tazas.shop",
    title: "Tazas Personalizables | Crea tu diseño único",
    description: "Diseña tu propia taza en minutos con nuestro editor 3D. Calidad premium y envío a todo el país.",
    siteName: "Tazas.shop",
    images: [
      {
        url: "/og-image.jpg", // Asegúrate de que esta imagen exista en public/
        width: 1200,
        height: 630,
        alt: "Tazas Personalizables",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tazas Personalizables | Crea tu diseño único",
    description: "Diseña tu propia taza en minutos con nuestro editor 3D. Calidad premium y envío a todo el país.",
    images: ["/og-image.jpg"],
    creator: "@tazasshop",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Montserrat:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Pacifico&family=Dancing+Script:wght@400;500;600;700&family=Bebas+Neue&family=Oswald:wght@400;500;600;700&family=Lobster&family=Abril+Fatface&family=Comfortaa:wght@300;400;500;600;700&family=Caveat:wght@400;500;600;700&family=Permanent+Marker&family=Righteous&family=Fredoka+One&family=Cinzel:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full flex flex-col">
        <AuthProvider>
          <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GA_ID || ""} />
          <Navbar />
          <main className="flex-1 pt-20">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
