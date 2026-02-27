import { Metadata } from "next";
import { getProductBySlug } from "@/lib/api";
import ProductDetailView from "@/components/ProductDetailView";
import Link from "next/link";

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const product = await getProductBySlug(params.slug);

        return {
            title: product.name,
            description: product.description || "Taza de autor diseñada por KYATHOS. Calidad premium y estilo único.",
            openGraph: {
                title: `${product.name} | KYATHOS`,
                description: product.description || "Explorá esta pieza exclusiva en nuestra tienda.",
                images: product.image_url ? [{ url: product.image_url }] : [],
            },
        };
    } catch (error) {
        return {
            title: "Producto | KYATHOS",
            description: "Calidad premium y estilo único.",
        };
    }
}

export default async function Page({ params }: Props) {
    try {
        const product = await getProductBySlug(params.slug);

        if (!product) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center px-6">
                    <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
                    <Link
                        href="/products"
                        className="px-6 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-xl font-bold"
                    >
                        Volver a la tienda
                    </Link>
                </div>
            );
        }

        return <ProductDetailView product={product} />;
    } catch (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
                <h1 className="text-2xl font-bold mb-4">Error al cargar el producto</h1>
                <p className="text-gray-500 mb-8">Hubo un problema de conexión. Por favor intentá de nuevo más tarde.</p>
                <Link
                    href="/products"
                    className="px-6 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-xl font-bold"
                >
                    Volver a la tienda
                </Link>
            </div>
        );
    }
}
