interface TestimonialCardProps {
    name: string;
    comment: string;
    rating: number;
    avatar?: string;
}

export default function TestimonialCard({ name, comment, rating, avatar }: TestimonialCardProps) {
    return (
        <div className="p-8 rounded-[2rem] border hover:shadow-2xl transition-all duration-300 group shadow-sm hover:shadow-xl" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(212,163,115,0.15)' }}>
            {/* Rating Stars */}
            <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                    <span
                        key={i}
                        className={`text-xl ${i < rating ? "text-yellow-500" : "text-gray-300"
                            }`}
                    >
                        ★
                    </span>
                ))}
            </div>

            {/* Comment */}
            <p className="text-zinc-700 dark:text-white/90 mb-8 italic text-lg leading-relaxed font-medium" style={{ color: '#3f3f46' }}>
                "{comment}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#D4A373' }}>
                    {name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="font-black text-zinc-900 dark:text-white text-lg" style={{ color: '#18181b' }}>{name}</p>
                    <p className="text-sm text-gray-500 dark:text-white/40 uppercase tracking-widest font-bold" style={{ color: '#71717a' }}>Cliente verificado</p>
                </div>
            </div>
        </div>
    );
}
