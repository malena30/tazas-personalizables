"use client";

import { useRef, useEffect, useState, forwardRef } from "react";
import dynamic from "next/dynamic";
import { Stage, Layer, Rect, Text as KonvaText, Image as KonvaImage, Transformer } from "react-konva";
import { CanvasElement } from "@/types/customizer";

interface MugCanvasProps {
    elements: CanvasElement[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    onUpdateElement: (element: CanvasElement) => void;
    mugColor: string;
}

// Componente para renderizar imágenes
function CanvasImageElement({ element, isSelected, onSelect, onChange }: any) {
    const imageRef = useRef<any>(null);
    const transformerRef = useRef<any>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new window.Image();
        img.src = element.url;
        img.onload = () => {
            setImage(img);
        };
    }, [element.url]);

    useEffect(() => {
        if (isSelected && transformerRef.current && imageRef.current) {
            transformerRef.current.nodes([imageRef.current]);
            transformerRef.current.getLayer().batchDraw();
        }
    }, [isSelected, image]);

    return (
        <>
            {image && (
                <KonvaImage
                    ref={imageRef}
                    image={image}
                    x={element.position.x}
                    y={element.position.y}
                    width={element.size.width}
                    height={element.size.height}
                    rotation={element.rotation}
                    opacity={element.opacity}
                    draggable
                    onClick={onSelect}
                    onTap={onSelect}
                    onDragEnd={(e: any) => {
                        onChange({
                            ...element,
                            position: {
                                x: e.target.x(),
                                y: e.target.y()
                            }
                        });
                    }}
                    onTransformEnd={(e: any) => {
                        const node = imageRef.current;
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();

                        node.scaleX(1);
                        node.scaleY(1);

                        onChange({
                            ...element,
                            position: {
                                x: node.x(),
                                y: node.y()
                            },
                            size: {
                                width: Math.max(5, node.width() * scaleX),
                                height: Math.max(5, node.height() * scaleY)
                            },
                            rotation: node.rotation()
                        });
                    }}
                />
            )}
            {isSelected && image && (
                <Transformer
                    ref={transformerRef}
                    enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                    keepRatio={false}
                    rotateEnabled={true}
                    borderStroke="#4A90E2"
                    borderStrokeWidth={2}
                    anchorSize={10}
                    anchorStroke="#4A90E2"
                    anchorFill="#FFFFFF"
                    anchorStrokeWidth={2}
                    boundBoxFunc={(oldBox: any, newBox: any) => {
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </>
    );
}

// Componente para renderizar texto  
function CanvasTextElement({ element, isSelected, onSelect, onChange, onDoubleClick }: any) {
    const textRef = useRef<any>(null);
    const transformerRef = useRef<any>(null);

    useEffect(() => {
        if (isSelected && transformerRef.current && textRef.current) {
            transformerRef.current.nodes([textRef.current]);
            transformerRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <>
            <KonvaText
                ref={textRef}
                text={element.content}
                x={element.position.x}
                y={element.position.y}
                fontSize={element.fontSize}
                fontFamily={element.fontFamily}
                fill={element.color}
                stroke={element.stroke}
                strokeWidth={element.strokeWidth}
                // Solo aplicar sombra si shadowColor está definido
                {...(element.shadowColor ? {
                    shadowColor: element.shadowColor,
                    shadowBlur: element.shadowBlur,
                    shadowOffsetX: element.shadowOffsetX,
                    shadowOffsetY: element.shadowOffsetY,
                    shadowOpacity: element.shadowOpacity
                } : {})}
                rotation={element.rotation}
                draggable
                onClick={onSelect}
                onTap={onSelect}
                onDblClick={() => {
                    if (onDoubleClick) {
                        onDoubleClick(element);
                    }
                }}
                fontStyle={`${element.isBold ? 'bold' : ''} ${element.isItalic ? 'italic' : ''}`}
                onDragEnd={(e: any) => {
                    onChange({
                        ...element,
                        position: {
                            x: e.target.x(),
                            y: e.target.y()
                        }
                    });
                }}
                onTransformEnd={(e: any) => {
                    const node = textRef.current;
                    onChange({
                        ...element,
                        position: {
                            x: node.x(),
                            y: node.y()
                        },
                        rotation: node.rotation()
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox: any, newBox: any) => {
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </>
    );
}

const MugCanvas = forwardRef<any, MugCanvasProps>(function MugCanvas({
    elements,
    selectedId,
    onSelect,
    onUpdateElement,
    mugColor
}, ref) {

    const stageRef = useRef(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasElements, setCanvasElements] = useState(elements);
    const [mugRotation, setMugRotation] = useState(0);
    const [isDraggingMug, setIsDraggingMug] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [editingText, setEditingText] = useState<{
        id: string;
        content: string;
        position: { x: number; y: number };
        fontSize: number;
        fontFamily: string;
        color: string;
    } | null>(null);

    useEffect(() => {
        setCanvasElements(elements);
    }, [elements]);

    const canvasWidth = 600;
    const canvasHeight = 600;

    // Dimensiones del área de diseño (ajustadas para la taza)
    const designAreaWidth = 320;
    const designAreaHeight = 380;
    const designAreaX = (canvasWidth - designAreaWidth) / 2;
    const designAreaY = (canvasHeight - designAreaHeight) / 2;

    const handleElementChange = (updatedElement: CanvasElement) => {
        const updatedElements = canvasElements.map(el =>
            el.id === updatedElement.id ? updatedElement : el
        );
        setCanvasElements(updatedElements);
        onUpdateElement(updatedElement);
    };

    // Handlers para rotación con mouse
    const [isOverKonva, setIsOverKonva] = useState(false);

    const handleMugMouseDown = (e: React.MouseEvent) => {
        // Solo rotar si NO estamos sobre el canvas de Konva
        if (!isOverKonva) {
            setIsDraggingMug(true);
            setDragStartX(e.clientX);
        }
    };

    const handleMugMouseMove = (e: React.MouseEvent) => {
        if (isDraggingMug && !isOverKonva) {
            const deltaX = e.clientX - dragStartX;
            const rotationSpeed = 0.5;
            setMugRotation(prev => prev + deltaX * rotationSpeed);
            setDragStartX(e.clientX);
        }
    };

    const handleMugMouseUp = () => {
        setIsDraggingMug(false);
    };

    const handleMugMouseLeave = () => {
        setIsDraggingMug(false);
    };

    return (
        <div className="flex items-center justify-center bg-[var(--background)] border-2 border-[var(--border)] rounded-lg p-8 overflow-hidden">

            <div className="relative" style={{ width: canvasWidth, height: canvasHeight }}>

                {/* Contenedor de la Taza con Rotación 3D */}
                <div
                    className="absolute inset-0 flex items-center justify-center"
                    onMouseDown={handleMugMouseDown}
                    onMouseMove={handleMugMouseMove}
                    onMouseUp={handleMugMouseUp}
                    onMouseLeave={handleMugMouseLeave}
                    style={{
                        transform: `rotateY(${mugRotation}deg)`,
                        transformStyle: 'preserve-3d',
                        transition: isDraggingMug ? 'none' : 'transform 0.2s ease-out',
                        cursor: isDraggingMug ? 'grabbing' : 'grab',
                        userSelect: 'none'
                    }}
                >
                    {/* ASA DE LA TAZA (Lado Derecho) */}
                    <div
                        style={{
                            position: 'absolute',
                            right: '100px',
                            top: '50%',
                            width: '140px',
                            height: '200px',
                            transform: 'translateY(-50%) translateZ(-40px) rotateY(15deg)',
                            border: `25px solid ${mugColor}`,
                            borderRadius: '0 80px 80px 0',
                            zIndex: -1,
                            boxShadow: 'inset 5px 0 15px rgba(0,0,0,0.1)'
                        }}
                    />

                    {/* CUERPO DE LA TAZA (Canvas + Máscara) */}
                    <div
                        className="relative bg-white shadow-2xl"
                        style={{
                            width: designAreaWidth,
                            height: designAreaHeight,
                            // Forma de taza realista usando border-radius complejo
                            borderRadius: '10px 10px 140px 140px / 20px 20px 60px 60px',
                            overflow: 'hidden',
                            transform: 'translateZ(1px)', // Traer al frente
                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)'
                        }}
                    >
                        {/* Capa de Color de la Taza */}
                        <div
                            className="absolute inset-0 z-0"
                            style={{ backgroundColor: mugColor }}
                        />

                        {/* Canvas de Konva */}
                        <div
                            className="absolute inset-0 z-10"
                            onMouseEnter={() => setIsOverKonva(true)}
                            onMouseLeave={() => setIsOverKonva(false)}
                        >
                            <Stage
                                width={designAreaWidth}
                                height={designAreaHeight}
                                ref={ref || stageRef}
                                onMouseDown={(e: any) => {
                                    const clickedOnEmpty = e.target === e.target.getStage();
                                    if (clickedOnEmpty) {
                                        onSelect(null);
                                    }
                                }}
                            >
                                <Layer>
                                    {/* Grid o guía visual opcional */}

                                    {canvasElements
                                        .sort((a, b) => a.zIndex - b.zIndex)
                                        .map((element) => {
                                            const isSelected = element.id === selectedId;

                                            // Ajustar posición relativa al nuevo canvas más pequeño
                                            // Esto es un truco visual, idealmente remapearíamos coordenadas
                                            const adjustedElement = {
                                                ...element,
                                                position: {
                                                    x: element.position.x - designAreaX,
                                                    y: element.position.y - designAreaY
                                                }
                                            };

                                            if (element.type === 'image') {
                                                return (
                                                    <CanvasImageElement
                                                        key={element.id}
                                                        element={adjustedElement} // Usar ajustado
                                                        isSelected={isSelected}
                                                        onSelect={() => onSelect(element.id)}
                                                        onChange={(newEl: any) => {
                                                            // Restaurar coordenadas globales al guardar
                                                            handleElementChange({
                                                                ...newEl,
                                                                position: {
                                                                    x: newEl.position.x + designAreaX,
                                                                    y: newEl.position.y + designAreaY
                                                                }
                                                            });
                                                        }}
                                                    />
                                                );
                                            } else if (element.type === 'text') {
                                                return (
                                                    <CanvasTextElement
                                                        key={element.id}
                                                        element={adjustedElement} // Usar ajustado
                                                        isSelected={isSelected}
                                                        onSelect={() => onSelect(element.id)}
                                                        onDoubleClick={(el: any) => {
                                                            // Iniciar edición inline
                                                            setEditingText({
                                                                id: element.id,
                                                                content: element.content,
                                                                position: element.position,
                                                                fontSize: element.fontSize,
                                                                fontFamily: element.fontFamily || 'Inter',
                                                                color: element.color
                                                            });
                                                        }}
                                                        onChange={(newEl: any) => {
                                                            handleElementChange({
                                                                ...newEl,
                                                                position: {
                                                                    x: newEl.position.x + designAreaX,
                                                                    y: newEl.position.y + designAreaY
                                                                }
                                                            });
                                                        }}
                                                    />
                                                );
                                            }
                                            return null;
                                        })}

                                    {canvasElements.length === 0 && (
                                        <KonvaText
                                            x={designAreaWidth / 2}
                                            y={designAreaHeight / 2}
                                            text="Diseñá acá"
                                            fontSize={20}
                                            fill="#CCCCCC"
                                            fontFamily="Inter"
                                            align="center"
                                            offsetX={50}
                                            offsetY={10}
                                        />
                                    )}
                                </Layer>
                            </Stage>
                        </div>

                        {/* Overlay de Iluminación Realista (Cilíndrico) */}
                        <div
                            className="absolute inset-0 z-20 pointer-events-none"
                            style={{
                                background: `
                                    linear-gradient(90deg, 
                                        rgba(0,0,0,0.15) 0%, 
                                        rgba(0,0,0,0.05) 15%, 
                                        rgba(255,255,255,0) 40%, 
                                        rgba(255,255,255,0.3) 50%, 
                                        rgba(255,255,255,0) 60%, 
                                        rgba(0,0,0,0.05) 85%, 
                                        rgba(0,0,0,0.2) 100%
                                    )
                                `
                            }}
                        />

                        {/* Borde Superior (Rim) */}
                        <div
                            className="absolute top-0 left-0 right-0 h-4 z-30 pointer-events-none"
                            style={{
                                background: 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0))',
                                borderBottom: '1px solid rgba(0,0,0,0.05)'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Editor de Texto Inline */}
            {editingText && (
                <div
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1000,
                        pointerEvents: 'auto'
                    }}
                >
                    <input
                        type="text"
                        value={editingText.content}
                        onChange={(e) => {
                            setEditingText({
                                ...editingText,
                                content: e.target.value
                            });
                        }}
                        onBlur={() => {
                            // Guardar cambios
                            if (editingText.content.trim() !== '') {
                                const element = canvasElements.find(el => el.id === editingText.id);
                                if (element && element.type === 'text') {
                                    handleElementChange({
                                        ...element,
                                        content: editingText.content
                                    });
                                }
                            }
                            setEditingText(null);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                // Guardar con Enter
                                if (editingText.content.trim() !== '') {
                                    const element = canvasElements.find(el => el.id === editingText.id);
                                    if (element && element.type === 'text') {
                                        handleElementChange({
                                            ...element,
                                            content: editingText.content
                                        });
                                    }
                                }
                                setEditingText(null);
                            } else if (e.key === 'Escape') {
                                // Cancelar con Escape
                                setEditingText(null);
                            }
                        }}
                        autoFocus
                        style={{
                            fontSize: `${editingText.fontSize}px`,
                            fontFamily: editingText.fontFamily,
                            color: editingText.color,
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '2px solid #4A90E2',
                            outline: 'none',
                            padding: '4px 8px',
                            minWidth: '100px',
                            borderRadius: '4px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}
                    />
                </div>
            )}
        </div>
    );
});

export default MugCanvas;
