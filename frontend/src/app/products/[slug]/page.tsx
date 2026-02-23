"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductBySlug, Product } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import { LuPlus, LuMinus, LuShoppingBag, LuPalette, LuCircleCheck, LuArrowLeft, LuShieldCheck, LuTruck, LuRotateCcw, LuInfo } from "react-icons/lu";
import Image from "next/image";
import ProductSkeleton from "@/components/ProductSkeleton";

export default function ProductDetailPage() {
    const { slug } = useParams();
    const router = useRouter();
    const addToCart = useCartStore((state) => state.addToCart);

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [activeImage, setActiveImage] = useState<string | null>(null);

    useEffect(() => {
        if (slug) {
            loadProduct();
        }
    }, [slug]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const data = await getProductBySlug(slug as string);
            setProduct(data);
            setActiveImage(data.image_url || null);
        } catch (error) {
            console.error("Error loading product:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        addToCart({
            id: product.id,
            name: product.name,
            description: product.description || "",
            price: product.price,
            image: product.image_url || "",
            quantity: quantity
        });

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12">
                <ProductSkeleton />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6">
                <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
                <button
                    onClick={() => router.push("/products")}
                    className="px-6 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-xl font-bold"
                >
                    Volver a la tienda
                </button>
            </div>
        );
    }

    const gallery = product.gallery_urls && product.gallery_urls.length > 0
        ? [product.image_url, ...product.gallery_urls].filter(Boolean) as string[]
        : [product.image_url].filter(Boolean) as string[];

    return (
        <main className="min-h-screen bg-[var(--background)] pt-12 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[var(--accent)] transition-colors mb-4"
                >
                    <LuArrowLeft size={12} />
                    Volver
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Gallery */}
                    <div className="space-y-6">
                        <div className="aspect-square bg-white dark:bg-zinc-900 rounded-[3rem] border border-[var(--border)] overflow-hidden flex items-center justify-center shadow-sm relative">
                            {activeImage ? (
                                <div className="relative w-full h-full">
                                    <div
                                        className="relative w-full h-full"
                                        style={{ transform: product.image_scale ? `scale(${product.image_scale})` : undefined }}
                                    >
                                        <Image
                                            src={activeImage}
                                            alt={product.name}
                                            fill
                                            className={`${product.image_fit === 'cover' ? 'object-cover' : 'object-contain'} animate-in fade-in duration-500`}
                                            priority
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-9xl">☕</div>
                            )}
                        </div>

                        {gallery.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {gallery.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(img)}
                                        className={`aspect-square bg-white dark:bg-zinc-900 rounded-2xl border transition-all overflow-hidden relative ${activeImage === img ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/20' : 'border-[var(--border)] opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                                <LuShieldCheck size={10} />
                                <span>Calidad Premium</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-title font-black text-[var(--foreground)] tracking-tighter mb-4">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-black text-[var(--foreground)]">
                                    ${product.price.toLocaleString("es-AR")}
                                </span>
                                <span className="text-green-500 dark:text-green-400 text-xs font-black uppercase tracking-widest">
                                    En Stock
                                </span>
                            </div>
                        </div>

                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-10">
                            {product.description || "Esta pieza única combina diseño contemporáneo con la calidez de lo cotidianos. Ideal para quienes buscan un objeto con intención en cada detalle."}
                        </p>

                        {/* Technical Details */}
                        <div className="space-y-6 mb-12">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--foreground)] flex items-center gap-2">
                                <LuInfo className="text-[var(--accent)]" />
                                Detalles Técnicos
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-[var(--border)]">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Material</p>
                                    <p className="font-bold text-white">{product.material || "Cerámica Premium"}</p>
                                </div>
                                <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-[var(--border)]">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Capacidad</p>
                                    <p className="font-bold text-white">{product.capacity || "325ml / 11oz"}</p>
                                </div>
                                <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-[var(--border)]">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Acabado</p>
                                    <p className="font-bold text-white">{product.finish || "Esmaltado Brillante"}</p>
                                </div>
                                <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-[var(--border)]">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Cuidados</p>
                                    <p className="font-bold text-white text-sm">{product.care_instructions || "Apto Microondas y Lavavajillas"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 mt-auto">
                            <div className="flex gap-4">
                                <div className="flex items-center bg-white dark:bg-zinc-900 rounded-2xl p-1 border border-[var(--border)]">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-[var(--accent)] transition-colors"
                                    >
                                        <LuMinus size={12} />
                                    </button>
                                    <span className="w-12 text-center font-black text-lg text-white">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-[var(--accent)] transition-colors"
                                    >
                                        <LuPlus size={12} />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className={`flex-1 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl ${added
                                        ? "bg-green-500 text-white shadow-green-500/20"
                                        : "bg-[var(--foreground)] text-[var(--background)] hover:scale-[1.02] active:scale-[0.98] shadow-black/10"
                                        }`}
                                >
                                    {added ? (
                                        <>
                                            <LuCircleCheck size={20} />
                                            ¡Agregado!
                                        </>
                                    ) : (
                                        <>
                                            <LuShoppingBag size={20} />
                                            Agregar al carrito
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
