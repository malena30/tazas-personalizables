# Documentación: `frontend/src/app/customizer/page.tsx`

## 📋 Propósito

La página `/customizer` es el núcleo de la experiencia de personalización de tazas. Actúa como el orquestador principal que integra el canvas de diseño 3D (`MugCanvas`), la barra de herramientas (`Toolbar`) y la gestión del estado del diseño. Permite a los usuarios agregar imágenes y texto, manipularlos, visualizar el resultado en un modelo 3D rotable y agregar el producto final al carrito.

## 🧩 Tabla de Contenidos

1. [Importaciones](#importaciones)
2. [Estado](#estado)
3. [Funciones Principales](#funciones-principales)
4. [Estructura del Componente](#estructura-del-componente)
5. [Integración](#integración)

## 📦 Importaciones

```typescript
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic"; // Para carga dinámica de componentes client-side
import { CanvasElement, ImageElement, TextElement } from "@/types/customizer";
import Toolbar from "@/components/Toolbar";
import { useCartStore } from "@/store/cartStore";
```

> **Nota**: `MugCanvas` se importa dinámicamente con `ssr: false` porque utiliza la librería `Konva`, que depende del objeto `window` y no funciona en el servidor.

## 💾 Estado

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `elements` | `CanvasElement[]` | Lista de elementos (texto/imagen) en el diseño |
| `selectedId` | `string \| null` | ID del elemento actualmente seleccionado |
| `mugColor` | `string` | Color base de la taza (hex) |
| `textColor` | `string` | Color actual para nuevos textos o selección |
| `fontSize` | `number` | Tamaño de fuente actual |
| `fontFamily` | `string` | Tipografía seleccionada (Google Fonts) |
| `showTooltip` | `boolean` | Controla la visibilidad del toast de "Agregado al carrito" |
| `mugRotation` | `number` | Ángulo de rotación de la taza (0, 90, 180, 270) |

## 🛠️ Funciones Principales

### Gestión de Elementos

- **`handleAddImage(url)`**: Crea un nuevo elemento de imagen y lo agrega al centro del canvas.
- **`handleAddText()`**: Crea un nuevo elemento de texto con propiedades por defecto.
- **`handleUpdateElement(updatedElement)`**: Actualiza las propiedades (posición, escala, rotación) de un elemento existente.
- **`handleDeleteElement()`**: Elimina el elemento seleccionado actualmente.

### Control de Capas

- **`handleBringToFront()`**: Mueve el elemento seleccionado al frente (mayor z-index).
- **`handleSendToBack()`**: Envía el elemento seleccionado al fondo (menor z-index).

### Sincronización

- **`useEffect` (Color/Fuente/Tamaño)**: Observan cambios en los controles del toolbar y actualizan el elemento de texto seleccionado en tiempo real.

### Guardado y Restauración

- **`handleSaveDesign()`**:
  1. Si el usuario no está logueado:
     - Guarda el diseño actual en `localStorage` (`pending_design`).
     - Redirige a `/login?redirect=/customizer`.
  2. Si está logueado:
     - Abre el modal de guardado.

- **`useEffect` (Restauración)**:
  - Al cargar la página, verifica si existe un `pending_design` en `localStorage`.
  - Si existe y el usuario está logueado, restaura el diseño y abre el modal de guardado automáticamente.

### Carrito

- **`handleAddToCart()`**: 
  1. Captura una imagen del diseño actual usando `canvasRef`.
  2. Crea un objeto `Product` con la imagen generada y el `designId` si el diseño ya fue guardado.
  3. Usa `cartStore.addToCart` para agregarlo al estado global.
  4. Muestra un tooltip de confirmación.

## 🏗️ Estructura del Componente

```jsx
<main>
  <div className="grid">
    {/* Columna Izquierda: Toolbar */}
    <Toolbar 
       // Props de control y callbacks
    />

    {/* Columna Derecha: Canvas 3D */}
    <div className="bg-white rounded-2xl shadow-sm">
       <MugCanvas 
          elements={elements}
          mugRotation={mugRotation}
          // ... otras props
       />
    </div>
  </div>

  {/* Feedback Visual */}
  {showTooltip && <Tooltip />}
</main>
```

## 🔗 Integración

- **Entrada**: Interacciones del usuario en Toolbar y Canvas.
- **Salida**: 
  - Actualización visual en `MugCanvas`.
  - Nuevo item en `cartStore` al finalizar.

## ⚠️ Consideraciones

- **Persistencia**: El diseño se guarda temporalmente en `localStorage` durante el flujo de login para evitar pérdida de trabajo.
- **Cloudinary**: Las miniaturas generadas se suben a Cloudinary al guardar el diseño en el backend.
- **Performance**: La generación de la imagen para el carrito (`toDataURL`) puede ser costosa en dispositivos móviles.
- **SSR**: Es crítico mantener la importación dinámica de `MugCanvas` para evitar errores de hidratación.
