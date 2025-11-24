# Navbar.tsx

## Propósito

Barra de navegación superior fija con diseño inspirado en Mercado Libre. Incluye logo, menú de navegación, contador de carrito y versión responsive.

## Tabla de Contenidos

- [Importaciones](#importaciones)
- [Estado](#estado)
- [Contador de Carrito](#contador-de-carrito)
- [UI Desktop](#ui-desktop)
- [UI Móvil](#ui-móvil)

## Importaciones

```typescript
"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
```

## Estado

### Estado Local

```typescript
const [open, setOpen] = useState(false);
```

- Controla apertura/cierre del menú móvil

### Estado Global

```typescript
const cart = useCartStore((state) => state.cart);
const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
```

- **cart**: Array de productos del carrito
- **totalItems**: Suma total de cantidades (para badge)

## Contador de Carrito

```typescript
const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
```

**Lógica**:
- Suma las cantidades de todos los items
- Default a 1 si quantity no está definido
- Usado para mostrar badge rojo con el número

## UI Desktop

### Estructura

```jsx
<nav className="bg-[#FFE600] fixed top-0">
  <div className="max-w-7xl mx-auto">
    <Link href="/">Tazas.shop</Link>
    
    <div className="hidden md:flex">
      <Link href="/">Inicio</Link>
      <Link href="/products">Productos</Link>
      <Link href="/customizer">Personalizar</Link>
      
      {/* Carrito con badge */}
      <Link href="/cart">
        🛒
        {totalItems > 0 && <span>{totalItems}</span>}
      </Link>
    </div>
  </div>
</nav>
```

### Logo

- Texto: "Tazas.shop"
- Color: `#2D3277` (azul oscuro)
- Font: `text-3xl font-extrabold`
- Link a: `/`

### Enlaces de Navegación

| Texto | Ruta | Estado |
|-------|------|--------|
| Inicio | `/` | ✅ Implementado |
| Productos | `/products` | ✅ Implementado |
| Personalizar | `/customizer` | ⚠️ Ruta no implementada |

**Hover**: `hover:text-[#3483FA]` (azul ML)

### Carrito Badge

Condicional: solo si `totalItems > 0`

```jsx
<span className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full">
  {totalItems}
</span>
```

**Características**:
- Posición absoluta (top-right del ícono)
- Fondo rojo
- Texto blanco
- Circular (`rounded-full`)
- Tamaño: 20x20px

## UI Móvil

### Botón Hamburguesa

```jsx
<button onClick={() => setOpen(!open)} className="md:hidden">
  {open ? "✖" : "☰"}
</button>
```

- Visible: Solo móvil (`md:hidden`)
- Ícono: ☰ (menú) / ✖ (cerrar)
- Toggle: cambia `open` state

### Menú Desplegable

Renderizado condicional: `{open && (<div>...)}`

```jsx
<div className="md:hidden bg-white">
  <Link onClick={() => setOpen(false)}>Inicio</Link>
  <Link onClick={() => setOpen(false)}>Productos</Link>
  <Link onClick={() => setOpen(false)}>Personalizar</Link>
  <Link onClick={() => setOpen(false)}>
    Carrito ({totalItems})
  </Link>
</div>
```

**Características**:
- `onClick={() => setOpen(false)}`: Cierra menú al navegar
- Muestra contador en texto: "(3)"
- Fondo blanco
- Borde superior: `border-t`

## Estilos

### Navbar Container

- Background: `#FFE600` (amarillo ML)
- Posición: `fixed top-0 left-0 z-50`
- Width: `w-full`
- Sombra: `shadow-sm`

⚠️ **Importante**: El `pt-20` en layout.tsx compensa la altura fija de este navbar.

### Colores del Tema

| Elemento | Color | Código |
|----------|-------|--------|
| Fondo navbar | Amarillo ML | `#FFE600` |
| Logo | Azul oscuro | `#2D3277` |
| Links | Gris | `#333` |
| Links hover | Azul ML | `#3483FA` |
| Badge carrito | Rojo | `red-600` |

## Responsive Breakpoints

- **< 768px**: Muestra menú hamburguesa
- **≥ 768px**: Muestra menú horizontal inline

## Funcionamiento del Carrito

### Actualización Automática

El navbar se re-renderiza automáticamente cuando:
1. Se agrega un producto (`addToCart`)
2. Se elimina un producto (`removeFromCart`)
3. Se cambia cantidad (`updateQuantity`)

Esto gracias a Zustand:
```typescript
const cart = useCartStore((state) => state.cart);
```

## Mejoras Recomendadas

- [ ] Implementar ruta `/customizer`
- [ ] Agregar animación al menú móvil
- [ ] Agregar dropdown de cuenta/usuario
- [ ] Hacer sticky con scroll (cambiar estilos)
- [ ] Agregar búsqueda de productos
- [ ] Mejorar accesibilidad (ARIA labels)

## Archivos Relacionados

- [layout.tsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/src/app/layout.tsx) - Renderiza este navbar globalmente
- [cartStore.ts](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/src/store/cartStore.ts) - Store de Zustand del carrito
- [cart/page.tsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/src/app/cart/page.tsx) - Página del carrito

## Uso

Renderizado automáticamente en todas las páginas a través del RootLayout:

```tsx
// En layout.tsx
<Navbar />
```

No requiere props.
