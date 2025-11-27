"use client";

import { useRef, useEffect, useState, forwardRef } from "react";
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
    }, [isSelected]);

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
function CanvasTextElement({ element, isSelected, onSelect, onChange }: any) {
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
                rotation={element.rotation}
                draggable
                onClick={onSelect}
                onTap={onSelect}
                onDblClick={() => {
                    const newText = prompt("Editar texto:", element.content);
                    if (newText && newText.trim() !== '') {
                        onChange({
                            ...element,
                            content: newText
                        });
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
    const [canvasElements, setCanvasElements] = useState(elements);

    useEffect(() => {
        setCanvasElements(elements);
    }, [elements]);

    const canvasWidth = 600;
    const canvasHeight = 600;

    const designAreaWidth = 400;
    const designAreaHeight = 300;
    const designAreaX = (canvasWidth - designAreaWidth) / 2;
    const designAreaY = (canvasHeight - designAreaHeight) / 2;

    const handleElementChange = (updatedElement: CanvasElement) => {
        const updatedElements = canvasElements.map(el =>
            el.id === updatedElement.id ? updatedElement : el
        );
        setCanvasElements(updatedElements);
        onUpdateElement(updatedElement);
    };

    return (
        <div className="flex items-center justify-center bg-[var(--background)] border-2 border-[var(--border)] rounded-lg p-4">
            <Stage
                width={canvasWidth}
                height={canvasHeight}
                ref={ref || stageRef}
                onMouseDown={(e: any) => {
                    const clickedOnEmpty = e.target === e.target.getStage();
                    if (clickedOnEmpty) {
                        onSelect(null);
                    }
                }}
            >
                <Layer>
                    <Rect x={0} y={0} width={canvasWidth} height={canvasHeight} fill="#F0F0F0" />

                    <Rect
                        x={designAreaX}
                        y={designAreaY}
                        width={designAreaWidth}
                        height={designAreaHeight}
                        fill={mugColor}
                        stroke="#CCCCCC"
                        strokeWidth={2}
                        cornerRadius={10}
                    />

                    <KonvaText
                        x={designAreaX}
                        y={designAreaY - 25}
                        text="Área de diseño"
                        fontSize={14}
                        fill="#666666"
                        fontFamily="Inter"
                    />

                    {canvasElements
                        .sort((a, b) => a.zIndex - b.zIndex)
                        .map((element) => {
                            const isSelected = element.id === selectedId;

                            if (element.type === 'image') {
                                return (
                                    <CanvasImageElement
                                        key={element.id}
                                        element={element}
                                        isSelected={isSelected}
                                        onSelect={() => onSelect(element.id)}
                                        onChange={handleElementChange}
                                    />
                                );
                            } else if (element.type === 'text') {
                                return (
                                    <CanvasTextElement
                                        key={element.id}
                                        element={element}
                                        isSelected={isSelected}
                                        onSelect={() => onSelect(element.id)}
                                        onChange={handleElementChange}
                                    />
                                );
                            }
                            return null;
                        })}

                    {canvasElements.length === 0 && (
                        <KonvaText
                            x={canvasWidth / 2}
                            y={canvasHeight / 2}
                            text="Agregá imágenes o texto para empezar"
                            fontSize={16}
                            fill="#999999"
                            fontFamily="Inter"
                            align="center"
                            offsetX={150}
                        />
                    )}
                </Layer>
            </Stage>
        </div>
    );
});

export default MugCanvas;
