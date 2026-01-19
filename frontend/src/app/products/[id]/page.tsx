"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProduct, Product } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import { FaPlus, FaMinus, FaShoppingBag, FaPalette, FaCheckCircle, FaArrowLeft, FaShieldAlt, FaTruck, FaUndo } from "react-icons/fa";
import Image from "next/image";
import ProductSkeleton from "@/components/ProductSkeleton";

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const addToCart = useCartStore((state) => state.addToCart);

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (id) {
            loadProduct();
        }
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const data = await getProduct(id as string);
            setProduct(data);
        } catch (error) {
            // Error handled by showing "Producto no encontrado"
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        addToCart({
            id: Number(product.id) || 1,
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
            <div className="max-w-7xl mx-auto px-6 py-32">
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

    return (
        <main className="min-h-screen bg-[var(--background)] pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[var(--accent)] transition-colors mb-12"
                >
                    <FaArrowLeft size={12} />
                    Volver
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Gallery */}
                    <div className="space-y-6">
                        <div className="aspect-square bg-white dark:bg-zinc-900 rounded-[3rem] border border-[var(--border)] overflow-hidden flex items-center justify-center p-12 shadow-sm">
                            {product.image_url ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            ) : (
                                <div className="text-9xl">☕</div>
                            )}
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square bg-white dark:bg-zinc-900 rounded-2xl border border-[var(--border)] opacity-50 hover:opacity-100 transition-opacity cursor-pointer"></div>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <h1 className="text-4xl md:text-5xl font-title font-black text-[var(--foreground)] tracking-tighter mb-4">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-black text-[var(--foreground)]">
                                    ${product.price.toLocaleString("es-AR")}
                                </span>
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-black uppercase tracking-widest rounded-full">
                                    En Stock
                                </span>
                            </div>
                        </div>

                        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-10">
                            {product.description || "Esta taza premium es perfecta para tu café de la mañana o como un regalo especial. Fabricada con los mejores materiales para garantizar durabilidad y un acabado excepcional."}
                        </p>

                        {/* Technical Details */}
                        <div className="grid grid-cols-2 gap-6 mb-12">
                            <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-[var(--border)]">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Material</p>
                                <p className="font-bold text-[var(--foreground)]">Cerámica Premium</p>
                            </div>
                            <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-[var(--border)]">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Capacidad</p>
                                <p className="font-bold text-[var(--foreground)]">325ml / 11oz</p>
                            </div>
                            <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-[var(--border)]">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Apto para</p>
                                <p className="font-bold text-[var(--foreground)]">Microondas y Lavavajillas</p>
                            </div>
                            <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-[var(--border)]">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Acabado</p>
                                <p className="font-bold text-[var(--foreground)]">Brillante / Mate</p>
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
                                        <FaMinus size={12} />
                                    </button>
                                    <span className="w-12 text-center font-black text-lg text-[var(--foreground)]">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-[var(--accent)] transition-colors"
                                    >
                                        <FaPlus size={12} />
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
                                            <FaCheckCircle size={20} />
                                            ¡Agregado!
                                        </>
                                    ) : (
                                        <>
                                            <FaShoppingBag size={20} />
                                            Agregar al carrito
                                        </>
                                    )}
                                </button>
                            </div>

                            <button
                                onClick={() => router.push("/customizer")}
                                className="w-full py-4 bg-white dark:bg-zinc-900 text-[var(--foreground)] border-2 border-[var(--foreground)] rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all"
                            >
                                <FaPalette size={20} />
                                Personalizar este diseño
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-[var(--border)]">
                            <div className="flex flex-col items-center text-center">
                                <FaTruck className="text-[var(--accent)] mb-2" size={20} />
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Envío Rápido</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <FaShieldAlt className="text-[var(--accent)] mb-2" size={20} />
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Pago Seguro</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <FaUndo className="text-[var(--accent)] mb-2" size={20} />
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Garantía 100%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
