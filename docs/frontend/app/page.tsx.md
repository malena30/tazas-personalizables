# page.tsx

## Propósito

Página principal (landing page) de la aplicación de tazas personalizables. Presenta un diseño inspirado en Mercado Libre con un hero banner atractivo, catálogo de productos destacados y sección de beneficios.

## Tabla de Contenidos

- [Importaciones](#importaciones)
- [Componente Principal](#componente-principal)
- [Secciones](#secciones)
- [Estilos y Diseño](#estilos-y-diseño)
- [Navegación](#navegación)

## Importaciones

```typescript
import Image from "next/image";
import Link from "next/link";
```

- **Image**: Componente optimizado de Next.js para imágenes con lazy loading y optimización automática
- **Link**: Enrutamiento del lado del cliente de Next.js para navegación rápida

## Componente Principal

### `Home()`

Componente funcional de React que renderiza la página de inicio.

**Tipo**: Server Component (por defecto en Next.js 13+ App Router)

**Retorno**: JSX con el layout completo de la landing page

## Secciones

### 1. Hero Banner

**Ubicación**: Líneas 8-37

**Diseño**: Banner de ancho completo con gradiente amarillo (inspirado en ML)

**Características**:
- Layout responsive (columna en móvil, fila en desktop)
- Gradiente: `from-[#FFE600] to-[#F2D000]` (amarillo característico de ML)
- CTA principal: "Diseñar ahora" → enlaza a `/customizer`
- Imagen hero: taza de ejemplo desde Pexels

**Estructura**:
```jsx
<section className="w-full bg-gradient-to-r from-[#FFE600] to-[#F2D000]">
  <div className="flex flex-col md:flex-row">
    {/* Texto + CTA */}
    {/* Imagen */}
  </div>
</section>
```

**Call to Action**:
- Botón azul (`#3483FA`) con texto "Diseñar ahora"
- Link a `/customizer` (ruta pendiente de implementación)
- Hover effect: oscurece a `#2968C8`

---

### 2. Catálogo de Productos

**Ubicación**: Líneas 40-120

**Diseño**: Grid responsive de 4 columnas (1 en móvil, 2 en tablet, 4 en desktop)

**Título**: "Basado en tu última visita" (patrón UX de Mercado Libre)

**Productos Mostrados**: 4 cards estáticas (hardcoded)

#### Estructura de Card

Cada tarjeta de producto incluye:

1. **Imagen del producto**:
   - Height fijo: `h-56`
   - Borde inferior: separación visual
   - Hover effect: scale al 105%
   - Padding interno: `p-4`

2. **Información**:
   - Precio grande: `text-2xl` en color `#333`
   - Badge de envío: texto verde (`#00A650`) "Envío gratis" o "Llega mañana"
   - Descripción del producto: `text-sm` truncado a 2 líneas (`line-clamp-2`)

3. **Efectos**:
   - Card: hover shadow de `shadow-sm` a `shadow-lg`
   - Imagen: transform scale en hover del grupo

#### Productos Hardcoded

1. **Taza Minimalista**: $3,500 - Envío gratis
2. **Taza Con Foto**: $4,200 - Llega mañana
3. **Taza Ilustrada**: $3,900 - Cuotas sin interés
4. **Set X2 Tazas**: $7,500 - Envío gratis

**Nota**: ⚠️ Estos productos son datos estáticos. En producción deberían venir de una API o base de datos.

---

### 3. Beneficios

**Ubicación**: Líneas 122-153

**Diseño**: Tarjeta blanca con 3 beneficios en fila horizontal (columna en móvil)

**Beneficios mostrados**:

1. 💳 **Pagá con tarjeta o en efectivo**
   - Link: "Ver medios de pago"
   
2. 📦 **Envío rápido a todo el país**
   - Link: "Ver costos y tiempos"
   
3. 🛡️ **Compra protegida**
   - Link: "Se abren en una nueva pestaña"

**Separadores**: Líneas verticales (`w-px h-12 bg-gray-200`) entre beneficios en vista desktop

## Estilos y Diseño

### Paleta de Colores

Inspirada en Mercado Libre:

| Color | Código | Uso |
|-------|--------|-----|
| Amarillo ML | `#FFE600` / `#F2D000` | Hero banner gradient |
| Azul principal | `#3483FA` | CTAs, links |
| Azul hover | `#2968C8` | Hover states |
| Verde éxito | `#00A650` | Badges de envío |
| Gris fondo | `#EBEBEB` | Background principal |
| Gris texto | `#666` / `#333` | Textos y títulos |

### Tipografía

- **Títulos grandes**: `font-light` para elegancia
- **CTAs**: `font-semibold` para énfasis
- **Precios**: `font-normal` en `text-2xl` o `text-3xl`
- **Descripciones**: `font-light` en `text-sm` o `text-lg`

### Responsive Design

Breakpoints utilizados:
- `md:` (768px): Cambio de columna a fila en hero y beneficios
- `sm:` (640px): Grid de 2 columnas en productos

## Navegación

### Enlaces Internos

| Elemento | Destino | Estado |
|----------|---------|--------|
| "Diseñar ahora" (Hero) | `/customizer` | ⚠️ Ruta no implementada |
| "Ver historial" | `/products` | ✅ Implementada |
| Cards de producto | N/A | ❌ Sin enlace (estáticas) |
| "Ver medios de pago" | `#` | ⚠️ Placeholder |
| "Ver costos y tiempos" | `#` | ⚠️ Placeholder |

## Consideraciones de Mejora

### Funcionalidad Pendiente

- [ ] Implementar ruta `/customizer` para personalización de tazas
- [ ] Conectar productos a base de datos o API
- [ ] Hacer cards de producto clickeables (link a detalle)
- [ ] Implementar carrusel real en hero (actualmente estático)
- [ ] Agregar botones "Agregar al carrito" en las cards
- [ ] Completar enlaces de beneficios con contenido real

### SEO

- ✅ Usa componente `Image` de Next.js (optimización automática)
- ⚠️ Alt texts podrían ser más descriptivos
- ⚠️ Considerar agregar structured data para productos

### Performance

- ✅ Lazy loading de imágenes con Next.js Image
- ✅ Gradientes CSS (performantes)
- ✅ Transiciones CSS puras (no JavaScript)

## Flujo de Usuario

```mermaid
graph TD
    A[Landing Page] --> B{Usuario clickea}
    B -->|Diseñar ahora| C[/customizer]
    B -->|Ver historial| D[/products]
    B -->|Card de producto| E[Sin acción]
    D --> F[Catálogo completo]
    F --> G[Agregar al carrito]
```

## Archivos Relacionados

- [layout.tsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/src/app/layout.tsx) - Layout raíz con Navbar y Footer
- [products/page.tsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/src/app/products/page.tsx) - Catálogo completo de productos
- [Navbar.tsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/src/components/Navbar.tsx) - Barra de navegación
- [Footer.tsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/src/components/Footer.tsx) - Pie de página

## Ejemplo de Uso

Esta es una página de Next.js, se accede automáticamente en la ruta raíz:

```
http://localhost:3000/
```

No requiere props ni configuración adicional.
