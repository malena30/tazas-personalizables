# Documentación: `frontend/src/components/MugCanvas.tsx`

## 📋 Propósito

`MugCanvas` es el componente encargado de la visualización y manipulación gráfica. Combina **Konva.js** (para la edición 2D de imágenes y texto) con **CSS 3D Transforms** y técnicas de enmascaramiento para simular una taza tridimensional realista.

## 📦 Dependencias

- `react-konva`: Bindings de React para Konva.js.
- `konva`: Librería de canvas 2D.
- `use-image`: Hook para cargar imágenes en Konva.

## 🧩 Arquitectura Visual

El componente utiliza una estructura de capas ("sandwich") para lograr el efecto 3D:

1. **Contenedor 3D**: `div` con `perspective` y `rotateY` controlado por `mugRotation`.
2. **Asa (Handle)**: `div` posicionado absolutamente con `transform-style: preserve-3d` y sombras para simular volumen.
3. **Cuerpo de la Taza**:
   - **Forma**: Definida por `border-radius` complejo (`10px 10px 140px 140px / ...`) para simular la curvatura inferior y el borde recto superior.
   - **Capa de Color**: `div` de fondo con el color seleccionado.
   - **Canvas (Stage)**: Área interactiva de Konva donde viven los elementos del usuario.
   - **Overlay de Iluminación**: `div` superior con `pointer-events-none` y un `linear-gradient` complejo para simular brillos especulares y sombras cilíndricas.
   - **Borde (Rim)**: `div` superior para el brillo del borde de la taza.

## 🛠️ Funcionalidades

### Renderizado de Elementos
Itera sobre el array `elements` y renderiza:
- **`CanvasImageElement`**: Wrapper de `Konva.Image` con `Transformer` para redimensionar/rotar.
- **`CanvasTextElement`**: Wrapper de `Konva.Text` con soporte para edición y transformación.

### Edición Inline de Texto
Reemplaza el `prompt()` nativo con una experiencia mejorada:
- Al hacer **doble clic** en un texto, se activa el estado `editingText`.
- Renderiza un `<input>` HTML nativo superpuesto y centrado en la pantalla (`position: fixed`).
- El input hereda los estilos (fuente, color) del texto original.
- Guarda cambios al perder foco (`onBlur`) o presionar `Enter`.

### Transformación
- Utiliza el componente `Transformer` de Konva.
- Configurado para mantener proporción en imágenes (`keepRatio: true`) pero no en texto.
- Anclas personalizadas para mejor UX.

## 💾 Props

```typescript
interface MugCanvasProps {
    elements: CanvasElement[];        // Elementos a renderizar
    selectedId: string | null;        // ID seleccionado
    onSelect: (id: string | null) => void; // Handler de selección
    onUpdateElement: (el: CanvasElement) => void; // Handler de actualización
    mugColor: string;                 // Color de fondo
    mugRotation: number;              // Rotación visual (grados)
}
```

## ⚠️ Detalles de Implementación

- **Mapeo de Coordenadas**: El área de diseño (`designArea`) es más pequeña que el canvas total. Los elementos se renderizan con un offset (`designAreaX`, `designAreaY`) para centrarse en la taza, pero sus coordenadas se guardan relativas al canvas global.
- **Z-Index**: Los elementos se ordenan visualmente según su propiedad `zIndex`.
- **Performance**: El uso de sombras y gradientes complejos en CSS junto con Canvas puede ser intensivo. Se recomienda probar en dispositivos de gama baja.
