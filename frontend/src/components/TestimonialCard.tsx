interface TestimonialCardProps {
    name: string;
    comment: string;
    rating: number;
    avatar?: string;
}

export default function TestimonialCard({ name, comment, rating, avatar }: TestimonialCardProps) {
    return (
        <div className="bg-[var(--accent)] p-6 rounded-2xl border border-[var(--border)] hover:shadow-xl transition-all duration-300">
            {/* Rating Stars */}
            <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <span
                        key={i}
                        className={`text-xl ${i < rating ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"
                            }`}
                    >
                        ★
                    </span>
                ))}
            </div>

            {/* Comment */}
            <p className="text-[var(--foreground)] opacity-80 mb-6 italic">
                "{comment}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    {name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="font-semibold text-[var(--foreground)]">{name}</p>
                    <p className="text-sm text-[var(--foreground)] opacity-60">Cliente verificado</p>
                </div>
            </div>
        </div>
    );
}
