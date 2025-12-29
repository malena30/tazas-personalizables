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
            <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                        ☕
                    </div>
                </div>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                    {name}
                </h3>
                {description && (
                    <p className="text-sm text-[var(--foreground)] opacity-70 mb-4">
                        {description}
                    </p>
                )}
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${price.toFixed(2)}
                    </span>
                    <Link
                        href="/customizer"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                    >
                        Personalizar
                    </Link>
                </div>
            </div>
        </div>
    );
}
