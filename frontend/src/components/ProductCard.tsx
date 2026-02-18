import Link from "next/link";
import Image from "next/image";
import { LuPalette, LuShoppingBag } from "react-icons/lu";

interface ProductCardProps {
    id: string | number;
    slug?: string;
    name: string;
    price: number;
    image: string;
    description: string;
    image_fit?: 'contain' | 'cover';
    image_scale?: number;
    onAddToCart: () => void;
}

export default function ProductCard({ id, slug, name, price, image, description, image_fit, image_scale, onAddToCart }: ProductCardProps) {
    const linkHref = slug ? `/products/${slug}` : `/products/${id}`;
    return (
        <div className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-[var(--border)] overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 hover:-translate-y-2 flex flex-col">
            {/* Image Container */}
            <Link href={linkHref} className="relative aspect-square bg-gray-50 dark:bg-zinc-800/50 overflow-hidden block">
                <div className="absolute inset-0 flex items-center justify-center">
                    {image ? (
                        <div
                            className="relative w-full h-full"
                            style={{ transform: image_scale ? `scale(${image_scale})` : undefined }}
                        >
                            <Image
                                src={image}
                                alt={name}
                                fill
                                className={`${image_fit === 'cover' ? 'object-cover' : 'object-contain'} group-hover:scale-110 transition-transform duration-700 ease-out`}
                            />
                        </div>
                    ) : (
                        <div className="text-7xl group-hover:scale-110 transition-transform duration-500">☕</div>
                    )}
                </div>
            </Link>

            {/* Info */}
            <div className="p-8 flex flex-col flex-1">
                <Link href={linkHref}>
                    <h2 className="text-xl font-bold text-[var(--foreground)] mb-2 group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                        {name}
                    </h2>
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed">
                    {description}
                </p>

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-2xl font-black text-[var(--foreground)]">
                        ${price.toLocaleString("es-AR")}
                    </span>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onAddToCart();
                        }}
                        className="p-4 bg-[var(--foreground)] text-[var(--background)] rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-black/10"
                    >
                        <LuShoppingBag size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
