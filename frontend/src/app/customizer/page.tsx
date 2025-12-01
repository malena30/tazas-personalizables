"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { CanvasElement, ImageElement, TextElement } from "@/types/customizer";
import Toolbar from "@/components/Toolbar";
import { useCartStore } from "@/store/cartStore";

// Importación dinámica de MugCanvas para evitar errores de SSR con Konva
const MugCanvas = dynamic(() => import("@/components/MugCanvas"), {
    ssr: false,
    loading: () => <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">Cargando diseñador...</div>
});

export default function CustomizerPage() {
    const [elements, setElements] = useState<CanvasElement[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [mugColor, setMugColor] = useState("#FFFFFF");
    const [textColor, setTextColor] = useState("#000000");
    const [fontSize, setFontSize] = useState(24);
    const [fontFamily, setFontFamily] = useState("Inter");
    const [showTooltip, setShowTooltip] = useState(false);
    const canvasRef = useRef<any>(null);
    const addToCart = useCartStore((state) => state.addToCart);

    // Generar ID único
    const generateId = () => `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Agregar imagen
    const handleAddImage = (imageUrl: string) => {
        const newImage: ImageElement = {
            id: generateId(),
            type: 'image',
            url: imageUrl,
            position: { x: 100, y: 100 },
            size: { width: 150, height: 150 },
            rotation: 0,
            zIndex: elements.length,
            opacity: 1
        };
        setElements([...elements, newImage]);
        setSelectedId(newImage.id);
    };

    // Agregar texto
    const handleAddText = () => {
        const newText: TextElement = {
            id: generateId(),
            type: 'text',
            content: 'Texto nuevo',
            position: { x: 150, y: 150 },
            fontSize: fontSize,
            fontFamily: 'Inter',
            color: textColor,
            rotation: 0,
            zIndex: elements.length,
            isBold: false,
            isItalic: false
        };
        setElements([...elements, newText]);
        setSelectedId(newText.id);
    };

    // Eliminar elemento seleccionado
    const handleDeleteElement = () => {
        if (selectedId) {
            setElements(elements.filter(el => el.id !== selectedId));
            setSelectedId(null);
        }
    };

    // Traer al frente
    const handleBringToFront = () => {
        if (!selectedId) return;
        const maxZIndex = Math.max(...elements.map(el => el.zIndex), 0);
        setElements(elements.map(el =>
            el.id === selectedId ? { ...el, zIndex: maxZIndex + 1 } : el
        ));
    };

    // Enviar atrás
    const handleSendToBack = () => {
        if (!selectedId) return;
        const minZIndex = Math.min(...elements.map(el => el.zIndex), 0);
        setElements(elements.map(el =>
            el.id === selectedId ? { ...el, zIndex: minZIndex - 1 } : el
        ));
    };

    // Actualizar elemento (cuando se modifica en el canvas)
    const handleUpdateElement = (updatedElement: CanvasElement) => {
        setElements(elements.map(el =>
            el.id === updatedElement.id ? updatedElement : el
        ));
    };

    // Sincronizar color de texto cuando cambia y hay un texto seleccionado
    useEffect(() => {
        if (selectedId) {
            const selectedElement = elements.find(el => el.id === selectedId);
            if (selectedElement && selectedElement.type === 'text') {
                setElements(elements.map(el =>
                    el.id === selectedId ? { ...el, color: textColor } : el
                ));
            }
        }
    }, [textColor]);

    // Sincronizar tamaño de fuente cuando cambia y hay un texto seleccionado
    useEffect(() => {
        if (selectedId) {
            const selectedElement = elements.find(el => el.id === selectedId);
            if (selectedElement && selectedElement.type === 'text') {
                setElements(elements.map(el =>
                    el.id === selectedId ? { ...el, fontSize: fontSize } : el
                ));
            }
        }
    }, [fontSize]);

    // Sincronizar fuente cuando cambia y hay un texto seleccionado
    useEffect(() => {
        if (selectedId) {
            const selectedElement = elements.find(el => el.id === selectedId);
            if (selectedElement && selectedElement.type === 'text') {
                setElements(elements.map(el =>
                    el.id === selectedId ? { ...el, fontFamily: fontFamily } : el
                ));
            }
        }
    }, [fontFamily]);



    // Agregar al carrito
    const handleAddToCart = () => {
        if (canvasRef.current) {
            // Exportar diseño como imagen
            const uri = canvasRef.current.toDataURL({
                pixelRatio: 3,
                mimeType: 'image/png',
            });

            // Agregar al carrito
            addToCart({
                id: Date.now(), // ID único basado en timestamp
                name: "Taza Personalizada",
                price: 3500, // Precio de la taza personalizada
                image: uri, // Imagen del diseño
                description: `Taza personalizada con ${elements.length} elemento(s)`
            });

            // Mostrar tooltip de confirmación
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 3000);
        }
    };

    return (
        <main className="w-full min-h-screen bg-[var(--background)] py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-title font-bold text-[var(--foreground)] mb-8">
                    Diseñá tu Taza Personalizada
                </h1>

                <div className="flex gap-6">

                    {/* Panel de herramientas - Izquierda (ancho flexible) */}
                    <Toolbar
                        onAddImage={handleAddImage}
                        onAddText={handleAddText}
                        onExport={handleAddToCart}
                        onDelete={handleDeleteElement}
                        onBringToFront={handleBringToFront}
                        onSendToBack={handleSendToBack}
                        mugColor={mugColor}
                        onMugColorChange={setMugColor}
                        textColor={textColor}
                        onTextColorChange={setTextColor}
                        fontSize={fontSize}
                        onFontSizeChange={setFontSize}
                        fontFamily={fontFamily}
                        onFontFamilyChange={setFontFamily}
                        hasSelection={selectedId !== null}
                        hasElements={elements.length > 0}
                    />

                    {/* Canvas principal - Centro */}
                    <div className="flex-1 max-w-4xl">
                        <MugCanvas
                            ref={canvasRef}
                            elements={elements}
                            selectedId={selectedId}
                            onSelect={setSelectedId}
                            onUpdateElement={handleUpdateElement}
                            mugColor={mugColor}
                        />

                        {/* Información del diseño */}
                        <div className="mt-4 p-4 bg-[var(--background)] border border-[var(--border)] rounded-lg">
                            <p className="text-sm font-text text-[var(--foreground)]">
                                <span className="font-semibold">Elementos:</span> {elements.length} |
                                <span className="font-semibold ml-2">Seleccionado:</span> {selectedId || 'Ninguno'}
                            </p>
                            {selectedId && (
                                <p className="text-xs text-[var(--foreground)] opacity-70 mt-2 font-text">
                                    💡 Tip: Arrastrá para mover, usa los controles de las esquinas para redimensionar
                                </p>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer fijo - Botón Agregar al Carrito */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--border)] shadow-lg z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🛒</span>
                            <div>
                                <p className="text-lg font-title font-bold text-[var(--foreground)]">$3.500</p>
                                <p className="text-xs text-[var(--foreground)] opacity-60">Taza personalizada</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={elements.length === 0}
                        className={`px-8 py-3 rounded-lg font-text font-semibold transition-all text-base ${elements.length > 0
                                ? 'bg-[var(--accent)] text-[var(--foreground)] hover:opacity-90 cursor-pointer shadow-md hover:shadow-lg'
                                : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60'
                            }`}
                    >
                        Añadir al carrito
                    </button>
                </div>
            </div>

            {/* Tooltip de confirmación */}
            {showTooltip && (
                <div className="fixed bottom-24 right-8 bg-[var(--accent)] text-[var(--foreground)] px-6 py-4 rounded-lg shadow-lg font-text font-semibold animate-slide-up flex items-center gap-3 z-50">
                    <div className="bg-white rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--accent)]" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    ¡Taza agregada al carrito! ($3.500)
                </div>
            )}
        </main>
    );
}
