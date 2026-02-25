"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useFavoriteStore } from "@/store/favoriteStore";
import { getApiUrl } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { LuHeart, LuArrowLeft, LuShoppingBag } from "react-icons/lu";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
    const { token, user } = useAuth();
    const { favorites } = useFavoriteStore();
    const addToCart = useCartStore((state) => state.addToCart);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.push("/login?redirect=/favorites");
            return;
        }
        loadFavoriteProducts();
    }, [token, favorites]);

    const loadFavoriteProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${getApiUrl()}/api/favorites`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Error loading favorite products:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--accent)]/20 rounded-full"></div>
                    <p className="text-[var(--accent)] font-bold animate-bounce text-xs uppercase tracking-widest">Cargando tus favoritos...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--cream)] pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-16">
                    <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[var(--accent)] transition-colors mb-6">
                        <LuArrowLeft size={14} />
                        Volver a la tienda
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-5xl md:text-7xl font-title font-black text-[var(--foreground)] tracking-tighter mb-4">
                                Mis <span className="text-[var(--accent)]">Favoritos</span>
                            </h1>
                            <p className="text-gray-500 font-medium max-w-lg">
                                Guardá tus diseños preferidos para verlos más tarde o comprarlos cuando quieras.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-zinc-900 rounded-2xl border border-[var(--border)] shadow-sm self-start">
                            <LuHeart className="text-red-500 fill-red-500" size={20} />
                            <span className="font-black text-xl text-[var(--foreground)]">{products.length}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Items</span>
                        </div>
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-[var(--border)] p-20 text-center flex flex-col items-center">
                        <div className="w-24 h-24 bg-[var(--cream)] rounded-3xl flex items-center justify-center text-[var(--accent)] mb-8 shadow-inner">
                            <LuHeart size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tight mb-4">
                            Tu lista está vacía
                        </h2>
                        <p className="text-gray-500 max-w-sm mb-10 leading-relaxed font-medium">
                            ¿Aún no encontraste tu taza ideal? Explorá nuestras colecciones y marcá con un ❤️ lo que más te guste.
                        </p>
                        <Link
                            href="/products"
                            className="px-10 py-5 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-black/10"
                        >
                            <LuShoppingBag size={20} />
                            Explorar Tienda
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                slug={product.slug}
                                name={product.name}
                                price={product.price}
                                image={product.image_url}
                                description={product.description || ""}
                                image_fit={product.image_fit}
                                image_scale={product.image_scale}
                                onAddToCart={() => addToCart({
                                    id: product.id,
                                    name: product.name,
                                    description: product.description || "",
                                    price: product.price,
                                    image: product.image_url || "",
                                    quantity: 1
                                })}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
