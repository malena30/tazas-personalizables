# globals.css

## Propósito

Archivo de estilos globales de la aplicación. Incluye configuración de Tailwind CSS, variables CSS custom, reset de estilos y clases utilitarias.

## Contenido

### 1. Import de Tailwind

```css
@import "tailwindcss";
```

Importa Tailwind CSS v4 (nuevo formato).

### 2. Reset Global

```css
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
```

Reset universal para consistencia cross-browser.

### 3. Variables CSS

```css
:root {
  --background: #EBEBEB;
  --foreground: #333333;
  --primary-yellow: #FFE600;
  --primary-blue: #3483FA;
  --secondary-blue: #2968C8;
  --white: #FFFFFF;
  --gray-text: #666666;
  
  --font-sans: var(--font-geist-sans, "Inter", system-ui, ...);
  --font-mono: var(--font-geist-mono, "JetBrains Mono", ...);
}
```

#### Colores Definidos

| Variable | Valor | Uso |
|----------|-------|-----|
| `--background` | #EBEBEB | Fondo gris claro |
| `--foreground` | #333333 | Texto principal |
| `--primary-yellow` | #FFE600 | Amarillo ML (navbar) |
| `--primary-blue` | #3483FA | Azul principal (botones) |
| `--secondary-blue` | #2968C8 | Azul hover |
| `--white` | #FFFFFF | Blanco puro |
| `--gray-text` | #666666 | Texto secundario |

#### Fuentes

- **Sans**: Inter (fallback a system-ui)
- **Mono**: JetBrains Mono (fallback a Consolas)

### 4. Dark Mode

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}
```

⚠️ **Nota**: Dark mode definido pero NO implementado en componentes

### 5. Layout HTML/Body

```css
html, body {
  height: 100%;
}

body {
  @apply bg-[var(--background)] text-[var(--foreground)] antialiased;
  font-family: var(--font-sans);
}
```

- Altura completa (para sticky footer)
- Aplica variables de color
- Antialiasing de fuentes
- Fuente sans por defecto

### 6. Clase Utilitaria .input

```css
.input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  transition: 0.2s;
}

.input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 3px rgba(79, 70, 229, 0.4);
}
```

**Uso**: Clase reutilizable para inputs

```jsx
<input className="input" />
```

**Características**:
- Ancho completo
- Padding consistente
- Borde redondeado
- Focus state con borde azul y sombra

## Integración con Tailwind

### Tailwind v4

Este proyecto usa **Tailwind CSS v4** (nuevo formato):

```css
@import "tailwindcss";
```

**Diferencia con v3**:
```css
/* v3 (antiguo) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* v4 (actual) */
@import "tailwindcss";
```

### Directivas @apply

```css
@apply bg-[var(--background)] text-[var(--foreground)] antialiased;
```

Usa Tailwind classes con variables CSS.

## Uso de Variables

En componentes:

```jsx
// Con Tailwind
<div className="bg-[var(--primary-blue)]">

// Con style inline
<div style={{ color: 'var(--gray-text)' }}>
```

## Mejoras Recomendadas

- [ ] Implementar dark mode en componentes
- [ ] Agregar más clases utilitarias (.btn, .card, etc.)
- [ ] Definir breakpoints custom
- [ ] Agregar animaciones globales
- [ ] Configurar typography plugin
- [ ] Agregar variables para spacing

## Archivos Relacionados

- [layout.tsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/src/app/layout.tsx) - Importa este archivo
- [tailwind.config.js](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/tailwind.config.js) - Configuración de Tailwind (si existe)
