"use client";

import { useRef, useEffect, useState, forwardRef, useImperativeHandle, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Stage, Layer, Rect, Text as KonvaText, TextPath, Image as KonvaImage, Transformer } from "react-konva";
import { CanvasElement } from "@/types/customizer";

interface Mug3DViewerProps {
    elements: CanvasElement[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    onUpdateElement: (element: CanvasElement) => void;
    mugColor: string;
}

// Componente de la taza 3D
function Mug({ mugColor, designTexture }: { mugColor: string; designTexture: THREE.Texture | null }) {
    const color = useMemo(() => new THREE.Color(mugColor), [mugColor]);

    return (
        <group rotation={[0, Math.PI, 0]}>
            {/* Cuerpo principal de la taza (cilindro) */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[1.2, 1, 2.5, 64, 1, true]} />
                <meshStandardMaterial
                    color={color}
                    side={THREE.DoubleSide}
                    roughness={0.15}
                    metalness={0.05}
                />
            </mesh>

            {/* Fondo de la taza */}
            <mesh position={[0, -1.25, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <circleGeometry args={[1, 64]} />
                <meshStandardMaterial color={color} roughness={0.4} />
            </mesh>

            {/* Interior de la taza (más oscuro) */}
            <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[1.1, 0.9, 2.3, 64, 1, true]} />
                <meshStandardMaterial
                    color={color.clone().multiplyScalar(0.7)}
                    side={THREE.BackSide}
                    roughness={0.5}
                />
            </mesh>

            {/* Borde superior de la taza */}
            <mesh position={[0, 1.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.15, 0.08, 16, 64]} />
                <meshStandardMaterial color={color} roughness={0.3} />
            </mesh>

            {/* Asa de la taza */}
            <mesh position={[1.05, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
                <torusGeometry args={[0.6, 0.12, 16, 32, Math.PI]} />
                <meshStandardMaterial color={color} roughness={0.3} />
            </mesh>

            {/* Área del diseño */}
            {designTexture && (
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[1.23, 1.03, 2.5, 64, 1, true, 0, Math.PI * 2]} />
                    <meshStandardMaterial
                        map={designTexture}
                        transparent
                        side={THREE.DoubleSide}
                        roughness={0.4}
                    />
                </mesh>
            )}
        </group>
    );
}

// Componente para renderizar imágenes en el canvas 2D
function CanvasImageElement({ element, isSelected, onSelect, onChange }: any) {
    const imageRef = useRef<any>(null);
    const transformerRef = useRef<any>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new window.Image();
        img.src = element.url;
        img.onload = () => setImage(img);
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
                            position: { x: e.target.x(), y: e.target.y() }
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
                            position: { x: node.x(), y: node.y() },
                            size: {
                                width: Math.max(5, node.width() * scaleX),
                                height: Math.max(5, node.height() * scaleY)
                            },
                            rotation: node.rotation()
                        });
                    }}
                />
            )}
            {isSelected && (
                <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox: any, newBox: any) => {
                        if (newBox.width < 5 || newBox.height < 5) return oldBox;
                        return newBox;
                    }}
                />
            )}
        </>
    );
}

// Componente para renderizar texto en el canvas 2D
function CanvasTextElement({ element, isSelected, onSelect, onChange }: any) {
    const textRef = useRef<any>(null);
    const transformerRef = useRef<any>(null);

    useEffect(() => {
        if (isSelected && transformerRef.current && textRef.current) {
            transformerRef.current.nodes([textRef.current]);
            transformerRef.current.getLayer().batchDraw();
        }
    }, [isSelected, element.curvature]);

    const isCurved = element.curvature && element.curvature !== 0;

    const pathData = (() => {
        if (!isCurved) return "";
        const width = element.content.length * (element.fontSize * 0.6);
        const curve = element.curvature || 0;
        return `M 0,0 Q ${width / 2},${curve * 2} ${width},0`;
    })();

    const commonProps = {
        ref: textRef,
        x: element.position.x,
        y: element.position.y,
        fontSize: element.fontSize,
        fontFamily: element.fontFamily,
        fill: element.color,
        stroke: element.stroke,
        strokeWidth: element.strokeWidth,
        ...(element.shadowColor ? {
            shadowColor: element.shadowColor,
            shadowBlur: element.shadowBlur,
            shadowOffsetX: element.shadowOffsetX,
            shadowOffsetY: element.shadowOffsetY,
            shadowOpacity: element.shadowOpacity
        } : {}),
        rotation: element.rotation,
        draggable: true,
        onClick: onSelect,
        onTap: onSelect,
        onDblClick: () => {
            const newText = prompt('Editar texto:', element.content);
            if (newText !== null && newText.trim() !== '') {
                onChange({
                    ...element,
                    content: newText
                });
            }
        },
        fontStyle: `${element.isBold ? 'bold' : ''} ${element.isItalic ? 'italic' : ''}`,
        onDragEnd: (e: any) => {
            onChange({
                ...element,
                position: { x: e.target.x(), y: e.target.y() }
            });
        },
        onTransformEnd: (e: any) => {
            const node = textRef.current;
            onChange({
                ...element,
                position: { x: node.x(), y: node.y() },
                rotation: node.rotation()
            });
        }
    };

    return (
        <>
            {isCurved ? (
                <TextPath {...commonProps} data={pathData} text={element.content} align="center" />
            ) : (
                <KonvaText {...commonProps} text={element.content} />
            )}
            {isSelected && (
                <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox: any, newBox: any) => {
                        if (newBox.width < 5 || newBox.height < 5) return oldBox;
                        return newBox;
                    }}
                />
            )}
        </>
    );
}

// Componente principal
const Mug3DViewer = forwardRef(function Mug3DViewer(
    { elements, selectedId, onSelect, onUpdateElement, mugColor }: Mug3DViewerProps,
    ref: any
) {
    const konvaStageRef = useRef<any>(null);
    const [designTexture, setDesignTexture] = useState<THREE.Texture | null>(null);

    const designWidth = 350;
    const designHeight = 400;

    // Actualizar textura cuando cambian los elementos
    useEffect(() => {
        const updateTexture = () => {
            if (konvaStageRef.current) {
                try {
                    const stage = konvaStageRef.current;
                    stage.batchDraw();

                    const canvas = stage.toCanvas({ pixelRatio: 2 });

                    const texture = new THREE.CanvasTexture(canvas);
                    texture.flipY = true;
                    texture.needsUpdate = true;
                    texture.colorSpace = THREE.SRGBColorSpace;

                    setDesignTexture(texture);
                } catch (error) {
                    console.error('Error updating texture:', error);
                }
            }
        };

        const frame = requestAnimationFrame(() => {
            setTimeout(updateTexture, 50);
        });

        return () => cancelAnimationFrame(frame);
    }, [elements, selectedId]);

    useImperativeHandle(ref, () => ({
        toDataURL: (options: any) => {
            return konvaStageRef.current?.toDataURL(options);
        }
    }));

    const canvasElements = elements.map(el => ({
        ...el,
        zIndex: el.zIndex ?? 0
    }));

    return (
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 items-center justify-center w-full max-w-full">
            {/* Canvas 2D para el diseño */}
            <div
                className="bg-white rounded-lg shadow-lg border-2 border-dashed border-gray-300 relative flex-shrink-0"
                style={{ width: Math.min(designWidth, typeof window !== 'undefined' ? window.innerWidth - 100 : designWidth), height: designHeight }}
            >
                <div className="absolute top-2 left-2 text-xs text-gray-500 font-semibold z-20">
                    ✏️ Área de diseño
                </div>
                <Stage
                    width={designWidth}
                    height={designHeight}
                    ref={konvaStageRef}
                    onMouseDown={(e: any) => {
                        if (e.target === e.target.getStage()) {
                            onSelect(null);
                        }
                    }}
                >
                    <Layer>
                        <Rect x={0} y={0} width={designWidth} height={designHeight} fill="white" />

                        {canvasElements
                            .sort((a, b) => a.zIndex - b.zIndex)
                            .map((element) => {
                                if (element.type === 'image') {
                                    return (
                                        <CanvasImageElement
                                            key={element.id}
                                            element={element}
                                            isSelected={element.id === selectedId}
                                            onSelect={() => onSelect(element.id)}
                                            onChange={onUpdateElement}
                                        />
                                    );
                                } else if (element.type === 'text') {
                                    return (
                                        <CanvasTextElement
                                            key={element.id}
                                            element={element}
                                            isSelected={element.id === selectedId}
                                            onSelect={() => onSelect(element.id)}
                                            onChange={onUpdateElement}
                                        />
                                    );
                                }
                                return null;
                            })}
                    </Layer>
                </Stage>
            </div>

            {/* Canvas 3D de la taza */}
            <div
                className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-inner flex-shrink-0"
                style={{ width: Math.min(500, typeof window !== 'undefined' ? window.innerWidth - 100 : 500), height: 400 }}
            >
                <Canvas
                    shadows
                    camera={{ position: [0, 1, 6], fov: 60 }}
                    gl={{ preserveDrawingBuffer: true }}
                >
                    <ambientLight intensity={1.2} />
                    <directionalLight
                        position={[5, 5, 5]}
                        intensity={1.5}
                        castShadow
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                    />
                    <pointLight position={[-5, 5, -5]} intensity={1} />
                    <pointLight position={[0, -2, 3]} intensity={0.8} /> {/* Luz de relleno */}
                    <hemisphereLight intensity={0.5} /> {/* Luz hemisférica para brillo uniforme */}

                    <Mug mugColor={mugColor} designTexture={designTexture} />

                    <OrbitControls
                        enablePan={false}
                        minDistance={4}
                        maxDistance={10}
                        minPolarAngle={Math.PI / 4}
                        maxPolarAngle={Math.PI / 1.5}
                    />

                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
                        <planeGeometry args={[10, 10]} />
                        <meshStandardMaterial color="#ffff" roughness={0.8} />
                    </mesh>
                </Canvas>
            </div>
        </div>
    );
});

export default Mug3DViewer;
