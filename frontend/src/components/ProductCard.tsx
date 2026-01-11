import Link from "next/link";
import Image from "next/image";
import { FaPalette } from "react-icons/fa";

interface ProductCardProps {
    name: string;
    price: number;
    image: string;
    description?: string;
}

export default function ProductCard({ name, price, image, description }: ProductCardProps) {
    return (
        <div className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-[var(--border)] hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
            {/* Image Container */}
            <div className="relative aspect-square bg-gray-50 dark:bg-zinc-800/50 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-8">
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                    ) : (
                        <div className="text-7xl group-hover:scale-110 transition-transform duration-500">
                            ☕
                        </div>
                    )}
                </div>
                {/* Badge */}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-[var(--border)] rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                        Premium
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2 group-hover:text-blue-600 transition-colors">
                    {name}
                </h3>
                {description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                )}
                <div className="mt-auto flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Precio</span>
                        <span className="text-2xl font-black text-[var(--foreground)]">
                            ${price.toLocaleString('es-AR')}
                        </span>
                    </div>
                    <Link
                        href="/customizer"
                        className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 group-hover:w-32 group-hover:gap-2 overflow-hidden"
                    >
                        <FaPalette className="shrink-0" />
                        <span className="hidden group-hover:block whitespace-nowrap font-bold text-sm">Personalizar</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
