// Tipos para el personalizador de tazas

export interface Position {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export type ElementType = 'image' | 'text';

export interface BaseElement {
    id: string;
    type: ElementType;
    position: Position;
    rotation: number;
    zIndex: number;
}

export interface ImageElement extends BaseElement {
    type: 'image';
    url: string;
    size: Size;
    opacity: number;
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
}

export type CanvasElement = ImageElement | TextElement;

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
