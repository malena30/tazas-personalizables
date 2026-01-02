import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
    name: string;
    price: number;
    image: string;
    description?: string;
}

export default function ProductCard({ name, price, image, description }: ProductCardProps) {
    return (
        <div className="group bg-[var(--accent)] rounded-2xl overflow-hidden border border-[var(--border)] hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            {/* Image Container */}
            <div className="relative h-64 bg-white dark:bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-4">
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                            ☕
                        </div>
                    )}
                </div>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                    {name}
                </h3>
                {description && (
                    <p className="text-sm text-[var(--foreground)] opacity-70 mb-4 line-clamp-2">
                        {description}
                    </p>
                )}
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ${price.toLocaleString('es-AR')}
                    </span>
                    <Link
                        href="/customizer"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                    >
                        Personalizar
                    </Link>
                </div>
            </div>
        </div>
    );
}
