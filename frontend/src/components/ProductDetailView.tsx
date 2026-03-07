"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/context/AuthContext";
import { useFavoriteStore } from "@/store/favoriteStore";
import { LuPlus, LuMinus, LuShoppingBag, LuCircleCheck, LuArrowLeft, LuShieldCheck, LuInfo, LuHeart } from "react-icons/lu";
import Image from "next/image";

interface ProductDetailViewProps {
    product: Product;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
    const router = useRouter();
    const addToCart = useCartStore((state) => state.addToCart);
    const { token } = useAuth();
    const { favorites, toggleFavorite } = useFavoriteStore();

    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [activeImage, setActiveImage] = useState<string | null>(product.image_url || null);

    const handleAddToCart = () => {
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

                            {/* Favorite Button */}
                            <button
                                onClick={async (e) => {
                                    e.preventDefault();
                                    if (!token) {
                                        alert("Iniciá sesión para guardar tus favoritos");
                                        return;
                                    }
                                    await toggleFavorite(product.id, token);
                                }}
                                className={`absolute top-8 right-8 p-5 rounded-[1.5rem] backdrop-blur-md transition-all duration-300 z-10 ${favorites.includes(product.id)
                                    ? 'bg-red-500 text-white shadow-xl shadow-red-500/20 scale-110'
                                    : 'bg-black/10 text-white hover:bg-black/20 hover:scale-110'
                                    }`}
                            >
                                <LuHeart className={favorites.includes(product.id) ? 'fill-current' : ''} size={24} />
                            </button>
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
