"use client";


import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture, Decal } from "@react-three/drei";
import * as THREE from "three";
import { Stage, Layer, Rect, Text as KonvaText, TextPath, Image as KonvaImage, Transformer } from "react-konva";
import { CanvasElement, MugCoverage } from "@/types/customizer";

interface Mug3DViewerProps {
    elements: CanvasElement[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    onUpdateElement: (element: CanvasElement) => void;
    mugColor: string;
    isExpanded?: boolean;
    showCanvas?: boolean;
    onToggleExpand?: () => void;
}

// Componente de la taza 3D
function Mug({ mugColor, frontTexture, frontBackTexture, fullTexture }: {
    mugColor: string;
    frontTexture: THREE.Texture | null;
    frontBackTexture: THREE.Texture | null;
    fullTexture: THREE.Texture | null;
}) {
    const color = useMemo(() => new THREE.Color(mugColor), [mugColor]);


    return (
        <group rotation={[0, 0, 0]}>
            {/* Cuerpo principal de la taza (cilindro) */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[1.2, 1, 2.5, 64, 1, true]} />
                <meshStandardMaterial
                    color="#FFFFFF"
                    side={THREE.DoubleSide}
                    roughness={0.15}
                    metalness={0.05}
                />


            </mesh>

            {/* Fondo de la taza */}
            <mesh position={[0, -1.25, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <circleGeometry args={[1, 64]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
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

            {/* Asa de la taza - En X- (Izquierda) para coincidir con el hueco del diseño */}
            <mesh position={[-1.05, 0, 0]} rotation={[0, Math.PI, -Math.PI / 2]} castShadow>
                <torusGeometry args={[0.6, 0.12, 16, 32, Math.PI]} />
                <meshStandardMaterial color={color} roughness={0.3} />
            </mesh>

            {/* Área del diseño - Capa Front */}
            {frontTexture && (
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[1.24, 1.04, 2.5, 64, 1, true, -Math.PI / 3, (Math.PI * 2) / 3]} />
                    <meshStandardMaterial
                        map={frontTexture}
                        transparent
                        side={THREE.DoubleSide}
                        roughness={0.4}
                    />
                </mesh>
            )}

            {/* Área del diseño - Capa Front-Back */}
            {frontBackTexture && (
                <group>
                    {/* Frente */}
                    <mesh position={[0, 0, 0]}>
                        <cylinderGeometry args={[1.24, 1.04, 2.5, 64, 1, true, -Math.PI / 3, (Math.PI * 2) / 3]} />
                        <meshStandardMaterial
                            map={frontBackTexture}
                            transparent
                            side={THREE.DoubleSide}
                            roughness={0.4}
                        />
                    </mesh>
                    {/* Atrás */}
                    <mesh position={[0, 0, 0]}>
                        <cylinderGeometry args={[1.24, 1.04, 2.5, 64, 1, true, Math.PI - Math.PI / 3, (Math.PI * 2) / 3]} />
                        <meshStandardMaterial
                            map={frontBackTexture}
                            transparent
                            side={THREE.DoubleSide}
                            roughness={0.4}
                        />
                    </mesh>
                </group>
            )}

            {/* Área del diseño - Capa Full */}
            {fullTexture && (
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[1.22, 1.02, 2.5, 64, 1, true, -Math.PI / 3, 5 * Math.PI / 3]} />
                    <meshStandardMaterial
                        map={fullTexture}
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
                    id={element.id} // ID para búsqueda
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
        id: element.id, // ID para búsqueda
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

// Componente para renderizar emojis en el canvas 2D
function CanvasEmojiElement({ element, isSelected, onSelect, onChange }: any) {
    const emojiRef = useRef<any>(null);
    const transformerRef = useRef<any>(null);

    useEffect(() => {
        if (isSelected && transformerRef.current && emojiRef.current) {
            transformerRef.current.nodes([emojiRef.current]);
            transformerRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <>
            <KonvaText
                ref={emojiRef}
                id={element.id} // ID para búsqueda
                text={element.emoji}
                x={element.position.x}
                y={element.position.y}
                fontSize={element.fontSize}
                rotation={element.rotation}
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
                    const node = emojiRef.current;
                    const scaleX = node.scaleX();
                    node.scaleX(1);
                    node.scaleY(1);
                    onChange({
                        ...element,
                        position: { x: node.x(), y: node.y() },
                        fontSize: Math.max(5, node.fontSize() * scaleX),
                        rotation: node.rotation()
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={transformerRef}
                    enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                    keepRatio={true}
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
    { elements, selectedId, onSelect, onUpdateElement, mugColor, isExpanded = false, showCanvas = true, onToggleExpand }: Mug3DViewerProps,
    ref: any
) {
    const konvaStageRef = useRef<any>(null);
    const [textures, setTextures] = useState<{
        front: THREE.Texture | null;
        frontBack: THREE.Texture | null;
        full: THREE.Texture | null;
    }>({ front: null, frontBack: null, full: null });

    const designWidth = 350;
    const designHeight = 400;

    // Actualizar texturas cuando cambian los elementos
    useEffect(() => {
        let isMounted = true;
        const updateTextures = async () => {
            try {
                if (!konvaStageRef.current || !isMounted) return;

                const stage = konvaStageRef.current;
                const layer = stage.getLayers()[0];
                const children = layer.getChildren();
                const bgRect = children[0];
                if (!bgRect) return;

                const captureTexture = (filterFn: (el: CanvasElement) => boolean) => {
                    const originalBgVisible = bgRect.visible();
                    bgRect.visible(false);

                    elements.forEach((el) => {
                        const node = children.find((c: any) => c.id() === el.id);
                        if (node) node.visible(filterFn(el));
                    });

                    stage.batchDraw();
                    const canvas = stage.toCanvas({ pixelRatio: 1 }); // Optimizado para rendimiento
                    const texture = new THREE.CanvasTexture(canvas);
                    texture.flipY = true;
                    texture.minFilter = THREE.LinearFilter;
                    texture.generateMipmaps = false;
                    texture.needsUpdate = true;
                    texture.colorSpace = THREE.SRGBColorSpace;

                    bgRect.visible(originalBgVisible);
                    return texture;
                };

                const hasFront = elements.some(e => e.coverage === 'front' || !e.coverage);
                const hasFrontBack = elements.some(e => e.coverage === 'front-back');
                const hasFull = elements.some(e => e.coverage === 'full');

                const newTextures = {
                    front: hasFront ? captureTexture(e => e.coverage === 'front' || !e.coverage) : null,
                    frontBack: hasFrontBack ? captureTexture(e => e.coverage === 'front-back') : null,
                    full: hasFull ? captureTexture(e => e.coverage === 'full') : null
                };

                if (isMounted) {
                    setTextures(newTextures);
                    // Restaurar visibilidad de todos los nodos
                    elements.forEach((el) => {
                        const node = children.find((c: any) => c.id() === el.id);
                        if (node) node.visible(true);
                    });
                    stage.batchDraw();
                }
            } catch (err) {
                console.error("Error updating mug textures:", err);
            }
        };

        const timeout = setTimeout(updateTextures, 32); // ~30fps throttle
        return () => {
            isMounted = false;
            clearTimeout(timeout);
        };
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
        <div className={`flex flex-col ${isExpanded ? 'h-full w-full' : 'lg:flex-row lg:gap-8 h-full'} gap-3 items-center justify-center w-full max-w-full p-4 lg:p-8`}>

            {/* Canvas 2D para el diseño */}
            {showCanvas && (
                <div
                    className={`bg-white rounded-lg shadow-lg border-2 border-dashed border-gray-300 relative flex-shrink-0 transition-all duration-300 group/viewer`}
                    style={{
                        width: isExpanded ? Math.min(500, typeof window !== 'undefined' ? window.innerWidth * 0.4 : 500) : Math.min(designWidth, typeof window !== 'undefined' ? window.innerWidth - 100 : designWidth),
                        height: isExpanded ? '100%' : '100%',
                        maxHeight: isExpanded ? 'none' : '650px'
                    }}
                >

                    <div className="absolute top-2 left-2 text-xs text-gray-500 font-semibold z-20">
                        ✏️ Área de diseño
                    </div>

                    <Stage
                        width={isExpanded ? Math.min(500, typeof window !== 'undefined' ? window.innerWidth * 0.4 : 500) : designWidth}
                        height={isExpanded ? 600 : 540} // Aumentado para llenar más espacio
                        ref={konvaStageRef}
                        onMouseDown={(e: any) => {
                            if (e.target === e.target.getStage()) {
                                onSelect(null);
                            }
                        }}
                    >
                        <Layer>
                            <Rect x={0} y={0} width={isExpanded ? 500 : designWidth} height={isExpanded ? 600 : designHeight} fill="white" />

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
                                    } else if (element.type === 'emoji') {
                                        return (
                                            <CanvasEmojiElement
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
            )}

            {/* Canvas 3D de la taza */}
            <div
                className={`bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-inner flex-shrink-0 transition-all duration-300 relative group/3dviewer ${!showCanvas ? 'w-full h-full rounded-none' : ''}`}
                style={showCanvas ? {
                    width: isExpanded ? Math.min(600, typeof window !== 'undefined' ? window.innerWidth * 0.5 : 600) : Math.min(500, typeof window !== 'undefined' ? window.innerWidth - 100 : 500),
                    height: '100%',
                    maxHeight: '650px',
                    minHeight: '400px'
                } : { width: '100%', height: '100%', minHeight: '500px' }}
            >

                {/* Botón de Expandir/Contraer (dentro del visor 3D) */}
                {onToggleExpand && (
                    <button
                        onClick={onToggleExpand}
                        className={`absolute top-2 right-2 z-[110] p-1.5 rounded shadow-sm transition-all ${isExpanded
                            ? 'bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-[var(--border)] hover:bg-white dark:hover:bg-zinc-800'
                            : 'bg-white/90 border border-gray-200 hover:bg-white opacity-0 group-hover/3dviewer:opacity-100'
                            } group`}
                        title={isExpanded ? "Contraer vista" : "Expandir vista"}
                    >
                        <div className={`font-mono font-bold ${isExpanded ? 'text-lg text-[var(--foreground)]' : 'text-sm text-gray-700'}`}>
                            <span className="group-hover:scale-110 transition-transform inline-block">{isExpanded ? '][' : '[ ]'}</span>
                        </div>
                    </button>
                )}


                <React.Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                            <p className="text-gray-600 font-semibold">Inicializando Canvas 3D...</p>
                        </div>
                    </div>
                }>
                    <Canvas
                        shadows
                        className="w-full h-full"
                        camera={{ position: [0, 1, 6], fov: 60 }}
                        gl={{ preserveDrawingBuffer: true }}
                        onCreated={() => console.log('✅ Canvas 3D inicializado correctamente')}
                    >
                        {/* Luces ... */}
                        <ambientLight intensity={1.5} />
                        <directionalLight
                            position={[5, 5, 5]}
                            intensity={1.8}
                            castShadow
                            shadow-mapSize-width={1024}
                            shadow-mapSize-height={1024}
                        />
                        <pointLight position={[-5, 5, -5]} intensity={1.2} />
                        <pointLight position={[0, -2, 3]} intensity={1} />
                        <hemisphereLight intensity={0.6} />

                        <Mug
                            mugColor={mugColor}
                            frontTexture={textures.front}
                            frontBackTexture={textures.frontBack}
                            fullTexture={textures.full}
                        />

                        <OrbitControls
                            enablePan={false}
                            minDistance={4}
                            maxDistance={10}
                            minPolarAngle={Math.PI / 4}
                            maxPolarAngle={Math.PI / 1.5}
                        />

                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
                            <planeGeometry args={[10, 10]} />
                            <meshStandardMaterial color="#ffffff" roughness={0.8} />
                        </mesh>
                    </Canvas>
                </React.Suspense>
            </div>
        </div>
    );
});

export default Mug3DViewer;
