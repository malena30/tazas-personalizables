# Documentación: `frontend/src/components/Toolbar.tsx`

## 📋 Propósito

El componente `Toolbar` proporciona la interfaz de usuario para que el usuario interactúe con el personalizador. Contiene controles para agregar elementos, manipular capas, cambiar estilos (color, fuente, tamaño) y controlar la vista 3D de la taza.

## 📦 Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `onAddImage` | `(url: string) => void` | Callback al subir una imagen |
| `onAddText` | `() => void` | Callback para agregar texto |
| `onExport` | `() => void` | Callback para "Agregar al Carrito" |
| `onDelete` | `() => void` | Callback para eliminar selección |
| `onBringToFront` | `() => void` | Callback para subir capa |
| `onSendToBack` | `() => void` | Callback para bajar capa |
| `mugColor` | `string` | Color actual de la taza |
| `onMugColorChange` | `(color: string) => void` | Setter del color de taza |
| `textColor` | `string` | Color del texto seleccionado |
| `onTextColorChange` | `(color: string) => void` | Setter del color de texto |
| `fontSize` | `number` | Tamaño de fuente |
| `onFontSizeChange` | `(size: number) => void` | Setter de tamaño |
| `fontFamily` | `string` | Fuente seleccionada |
| `onFontFamilyChange` | `(font: string) => void` | Setter de fuente |
| `hasSelection` | `boolean` | Si hay un elemento seleccionado (habilita controles) |
| `hasElements` | `boolean` | Si hay elementos en el canvas (habilita exportar) |
| `mugRotation` | `number` | Ángulo actual de la taza |
| `onRotateMug` | `(dir: 'left' \| 'right') => void` | Callback de rotación |

## 🧩 Secciones del Toolbar

### 1. Agregar Elementos
- **Botón Imagen**: Abre un input file oculto para subir imágenes locales.
- **Botón Texto**: Agrega un texto por defecto al canvas.

### 2. Edición (Condicional `hasSelection`)
- **Capas**: Botones para traer al frente o enviar al fondo.
- **Eliminar**: Botón rojo para borrar el elemento.

### 3. Personalización de Taza
- **Color**: Selector de color nativo (`input type="color"`) para cambiar el color base de la taza.

### 4. Estilo de Texto
- **Color**: Selector de color para el texto.
- **Tamaño**: Slider (`input type="range"`) de 12px a 72px.
- **Tipografía**: Dropdown (`select`) con fuentes de Google Fonts.
  - Opciones: Inter, Roboto, Montserrat, Playfair Display, Pacifico, Dancing Script, Bebas Neue, Oswald.

### 5. Vista 3D
- **Rotación**: Botones Izquierda/Derecha para girar la taza en incrementos de 90 grados. Muestra el ángulo actual.

### 6. Acciones Finales
- **Agregar al Carrito**: Botón principal (Accent color). Deshabilitado si no hay elementos (`!hasElements`).

## 🎨 Estilos

Utiliza el sistema de diseño global con variables CSS:
- Fondos: `bg-[var(--background)]`
- Bordes: `border-[var(--border)]`
- Textos: `text-[var(--foreground)]`
- Acentos: `bg-[var(--accent)]` para el botón principal.

## ⚠️ Consideraciones

- El input de archivo (`fileInputRef`) se reinicia (`value = ''`) después de cada selección para permitir subir el mismo archivo consecutivamente.
- Los controles de texto se deshabilitan visualmente (`opacity-50`) cuando no hay una selección activa.
