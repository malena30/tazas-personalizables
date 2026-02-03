interface TestimonialCardProps {
    name: string;
    comment: string;
    rating: number;
    avatar?: string;
}

export default function TestimonialCard({ name, comment, rating, avatar }: TestimonialCardProps) {
    return (
        <div className="bg-zinc-800 p-8 rounded-[2rem] border border-white/5 hover:border-[var(--accent)]/30 hover:shadow-2xl transition-all duration-300 group">
            {/* Rating Stars */}
            <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                    <span
                        key={i}
                        className={`text-xl ${i < rating ? "text-yellow-500" : "text-white/20"
                            }`}
                    >
                        ★
                    </span>
                ))}
            </div>

            {/* Comment */}
            <p className="text-white/90 mb-8 italic text-lg leading-relaxed">
                "{comment}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent)]/50 flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="font-black text-white text-lg">{name}</p>
                    <p className="text-sm text-white/40 uppercase tracking-widest font-bold">Cliente verificado</p>
                </div>
            </div>
        </div>
    );
}
