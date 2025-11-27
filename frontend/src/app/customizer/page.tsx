"use client";

"use client";

import { useState, useRef, useEffect } from "react";
import { CanvasElement, ImageElement, TextElement } from "@/types/customizer";
import MugCanvas from "@/components/MugCanvas";
import Toolbar from "@/components/Toolbar";

export default function CustomizerPage() {
    const [elements, setElements] = useState<CanvasElement[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [mugColor, setMugColor] = useState("#FFFFFF");
    const [textColor, setTextColor] = useState("#000000");
    const [fontSize, setFontSize] = useState(24);
    const canvasRef = useRef<any>(null);

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

    // Exportar diseño
    const handleExport = () => {
        if (canvasRef.current) {
            const uri = canvasRef.current.toDataURL({
                pixelRatio: 3, // Alta calidad
                mimeType: 'image/png',
            });

            // Crear link de descarga
            const link = document.createElement('a');
            link.download = `taza-personalizada-${Date.now()}.png`;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <main className="w-full min-h-screen bg-[var(--background)] py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-title font-bold text-[var(--foreground)] mb-8">
                    Diseñá tu Taza Personalizada
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* Panel de herramientas - Izquierda */}
                    <Toolbar
                        onAddImage={handleAddImage}
                        onAddText={handleAddText}
                        onExport={handleExport}
                        onDelete={handleDeleteElement}
                        onBringToFront={handleBringToFront}
                        onSendToBack={handleSendToBack}
                        mugColor={mugColor}
                        onMugColorChange={setMugColor}
                        textColor={textColor}
                        onTextColorChange={setTextColor}
                        fontSize={fontSize}
                        onFontSizeChange={setFontSize}
                        hasSelection={selectedId !== null}
                    />

                    {/* Canvas principal - Centro */}
                    <div className="lg:col-span-3">
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
        </main>
    );
}
