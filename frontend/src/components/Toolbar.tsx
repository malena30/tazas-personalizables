"use client";

import { useRef } from "react";

interface ToolbarProps {
    onAddImage: (imageUrl: string) => void;
    onAddText: () => void;
    onExport: () => void;
    onDelete: () => void;
    onBringToFront: () => void;
    onSendToBack: () => void;
    mugColor: string;
    onMugColorChange: (color: string) => void;
    textColor: string;
    onTextColorChange: (color: string) => void;
    fontSize: number;
    onFontSizeChange: (size: number) => void;
    hasSelection: boolean;
}

export default function Toolbar({
    onAddImage,
    onAddText,
    onExport,
    onDelete,
    onBringToFront,
    onSendToBack,
    mugColor,
    onMugColorChange,
    textColor,
    onTextColorChange,
    fontSize,
    onFontSizeChange,
    hasSelection
}: ToolbarProps) {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target?.result as string;
                onAddImage(imageUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <aside className="lg:col-span-1 bg-[var(--background)] border border-[var(--border)] rounded-lg p-6 h-fit space-y-6">
            <h2 className="text-xl font-title font-semibold text-[var(--foreground)] mb-4">
                Herramientas
            </h2>

            {/* Botón para subir imagen */}
            <div>
                <h3 className="text-sm font-title font-semibold text-[var(--foreground)] mb-2">
                    Agregar Imagen
                </h3>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-[var(--accent)] text-[var(--foreground)] px-4 py-3 rounded-lg font-text font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                    📷 Subir Imagen
                </button>
            </div>

            {/* Botón para agregar texto */}
            <div>
                <h3 className="text-sm font-title font-semibold text-[var(--foreground)] mb-2">
                    Agregar Texto
                </h3>
                <button
                    onClick={onAddText}
                    className="w-full bg-[var(--accent)] text-[var(--foreground)] px-4 py-3 rounded-lg font-text font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                    ✏️ Agregar Texto
                </button>
            </div>

            <hr className="border-[var(--border)]" />

            {/* Controles del elemento seleccionado */}
            {hasSelection && (
                <>
                    <div>
                        <h3 className="text-sm font-title font-semibold text-[var(--foreground)] mb-2">
                            Elemento Seleccionado
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={onBringToFront}
                                className="px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded font-text text-sm hover:bg-[var(--hover-bg)] transition-colors text-[var(--foreground)]"
                            >
                                ⬆️ Al frente
                            </button>
                            <button
                                onClick={onSendToBack}
                                className="px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded font-text text-sm hover:bg-[var(--hover-bg)] transition-colors text-[var(--foreground)]"
                            >
                                ⬇️ Atrás
                            </button>
                        </div>
                        <button
                            onClick={onDelete}
                            className="w-full mt-2 px-4 py-2 bg-red-600 text-white rounded-lg font-text font-semibold hover:bg-red-700 transition-colors"
                        >
                            🗑️ Eliminar
                        </button>
                    </div>
                    <hr className="border-[var(--border)]" />
                </>
            )}

            {/* Color de la taza */}
            <div>
                <h3 className="text-sm font-title font-semibold text-[var(--foreground)] mb-2">
                    Color de Taza
                </h3>
                <div className="flex gap-2">
                    <input
                        type="color"
                        value={mugColor}
                        onChange={(e) => onMugColorChange(e.target.value)}
                        className="w-12 h-12 rounded border-2 border-[var(--border)] cursor-pointer"
                    />
                    <input
                        type="text"
                        value={mugColor}
                        onChange={(e) => onMugColorChange(e.target.value)}
                        className="flex-1 px-3 py-2 font-mono text-sm bg-[var(--background)] border border-[var(--border)] rounded text-[var(--foreground)]"
                    />
                </div>
            </div>

            {/* Color del texto */}
            <div>
                <h3 className="text-sm font-title font-semibold text-[var(--foreground)] mb-2">
                    Color de Texto
                </h3>
                <div className="flex gap-2">
                    <input
                        type="color"
                        value={textColor}
                        onChange={(e) => onTextColorChange(e.target.value)}
                        className="w-12 h-12 rounded border-2 border-[var(--border)] cursor-pointer"
                    />
                    <input
                        type="text"
                        value={textColor}
                        onChange={(e) => onTextColorChange(e.target.value)}
                        className="flex-1 px-3 py-2 font-mono text-sm bg-[var(--background)] border border-[var(--border)] rounded text-[var(--foreground)]"
                    />
                </div>
            </div>

            {/* Tamaño del texto */}
            <div>
                <h3 className="text-sm font-title font-semibold text-[var(--foreground)] mb-2">
                    Tamaño de Texto
                </h3>
                <input
                    type="range"
                    min="12"
                    max="72"
                    value={fontSize}
                    onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
                    className="w-full"
                />
                <p className="text-sm font-mono text-[var(--foreground)] mt-1">
                    {fontSize}px
                </p>
            </div>

            <hr className="border-[var(--border)]" />

            {/* Botón exportar */}
            <button
                onClick={onExport}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-text font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
                💾 Exportar Diseño
            </button>
        </aside>
    );
}
