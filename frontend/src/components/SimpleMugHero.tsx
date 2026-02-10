"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, PerspectiveCamera, useTexture, Decal } from "@react-three/drei";
import * as THREE from "three";

function MugModel({ color = "#FFFFFF" }: { color?: string }) {
    const meshRef = useRef<THREE.Group>(null);
    const mugColor = useMemo(() => new THREE.Color(color), [color]);
    const logoTexture = useTexture("/LOGO.png");

    // Generar textura para el texto KYATHOS
    const textTexture = useMemo(() => {
        if (typeof document === 'undefined') return null;
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#2A2A2A';
            ctx.font = '900 80px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('KYATHOS', 256, 64);
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }, []);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;
        }
    });

    return (
        <group ref={meshRef}>
            {/* Cuerpo principal de la taza */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[1.2, 1, 2.5, 64, 1, false]} />
                <meshStandardMaterial
                    color="#FFFFFF"
                    roughness={0.1}
                    metalness={0.1}
                />

                {/* Logo Frontal */}
                <Decal
                    position={[0, -0.2, 1.05]} // Bajado un poco para dar lugar al texto
                    rotation={[0, 0, 0]}
                    scale={[1.1, 1.1, 1]}
                >
                    <meshStandardMaterial
                        map={logoTexture}
                        transparent
                        polygonOffset
                        polygonOffsetFactor={-1}
                        color="black"
                    />
                </Decal>

                {/* Texto KYATHOS Frontal */}
                {textTexture && (
                    <Decal
                        position={[0, 0.65, 1.05]}
                        rotation={[0, 0, 0]}
                        scale={[1.4, 0.35, 1]}
                    >
                        <meshStandardMaterial
                            map={textTexture}
                            transparent
                            polygonOffset
                            polygonOffsetFactor={-1}
                        />
                    </Decal>
                )}

                {/* Logo Trasero */}
                <Decal
                    position={[0, -0.2, -1.05]} // Bajado un poco
                    rotation={[0, Math.PI, 0]}
                    scale={[1.1, 1.1, 1]}
                >
                    <meshStandardMaterial
                        map={logoTexture}
                        transparent
                        polygonOffset
                        polygonOffsetFactor={-1}
                        color="black"
                    />
                </Decal>

                {/* Texto KYATHOS Trasero */}
                {textTexture && (
                    <Decal
                        position={[0, 0.65, -1.05]}
                        rotation={[0, Math.PI, 0]}
                        scale={[1.4, 0.35, 1]}
                    >
                        <meshStandardMaterial
                            map={textTexture}
                            transparent
                            polygonOffset
                            polygonOffsetFactor={-1}
                        />
                    </Decal>
                )}
            </mesh>

            {/* Interior de la taza */}
            <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[1.1, 0.9, 2.3, 64, 1, true]} />
                <meshStandardMaterial
                    color="#F0F0F0"
                    side={THREE.BackSide}
                    roughness={0.5}
                />
            </mesh>

            {/* Borde superior */}
            <mesh position={[0, 1.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.15, 0.08, 16, 64]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
            </mesh>

            {/* Asa */}
            <mesh position={[-1.05, 0, 0]} rotation={[0, Math.PI, -Math.PI / 2]} castShadow>
                <torusGeometry args={[0.6, 0.12, 16, 32, Math.PI]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
            </mesh>
        </group>
    );
}

export default function SimpleMugHero() {
    return (
        <div className="w-full h-[400px] md:h-[500px] cursor-grab active:cursor-grabbing">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
                <ambientLight intensity={0.7} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <MugModel />
                </Float>

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 1.5}
                />
            </Canvas>
        </div>
    );
}
