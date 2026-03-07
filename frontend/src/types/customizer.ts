// Tipos para el personalizador de tazas

export interface Position {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export type ElementType = 'image' | 'text' | 'emoji';

export type MugCoverage = 'front' | 'front-back' | 'full';

export interface ImageFilters {
    grayscale?: number;  // 0-100
    sepia?: number;      // 0-100
    brightness?: number; // 0-200
    contrast?: number;   // 0-200
    saturate?: number;   // 0-200
}

export interface BaseElement {
    id: string;
    type: ElementType;
    position: Position;
    rotation: number;
    zIndex: number;
    coverage: MugCoverage;
}

export interface ImageElement extends BaseElement {
    type: 'image';
    url: string;
    size: Size;
    opacity: number;
    filters?: ImageFilters;
}

export interface EmojiElement extends BaseElement {
    type: 'emoji';
    emoji: string;
    fontSize: number;
}

export interface TextElement extends BaseElement {
    type: 'text';
    content: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    isBold: boolean;
    isItalic: boolean;
    // Propiedades avanzadas (opcionales para compatibilidad hacia atrás)
    stroke?: string;
    strokeWidth?: number;
    shadowColor?: string;
    shadowBlur?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    shadowOpacity?: number;
    // Propiedad para texto curvo
    curvature?: number; // -100 a 100
}

export type CanvasElement = ImageElement | TextElement | EmojiElement;

export interface MugDesign {
    id: string;
    elements: CanvasElement[];
    mugColor: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ExportOptions {
    format: 'png' | 'jpg';
    quality: number;
    pixelRatio: number;
}
