# Footer.tsx

## Propósito

Pie de página con diseño inspirado en Mercado Libre. Incluye enlaces organizados por categorías, redes sociales y información legal.

## Tipo de Componente

**Server Component** (sin `"use client"`)
- No requiere interactividad
- Renderizado en el servidor
- Mejor SEO y performance

## Estructura

Grid responsive de 4 columnas con información organizada:

```jsx
<footer className="bg-white border-t mt-20">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    {/* 4 columnas */}
  </div>
  <div className="border-t">
    {/* Copyright y dirección */}
  </div>
</footer>
```

## Columnas de Enlaces

### 1. Acerca de

- Tazas.shop
- Tendencias
- Sustentabilidad

### 2. Ayuda

- Comprar
- Vender
-Resolución de problemas

### 3. Redes Sociales

- Instagram
- Twitter
- Facebook

### 4. Mi Cuenta

- Resumen
- Favoritos
- Mis compras

## Sección de Copyright

```jsx
<div className="border-t pt-6 text-xs text-gray-400">
  <p>© {new Date().getFullYear()} Tazas.shop S.R.L.</p>
  <p>Av. Siempreviva 742, Piso 4, CP 1234, Buenos Aires, Argentina</p>
</div>
```

**Características**:
- Año dinámico: `new Date().getFullYear()`
- Información de contacto mockup
- Texto en gris claro (`text-gray-400`)

## Estilos

- Background: Blanco (`bg-white`)
- Borde superior: `border-t border-gray-200`
- Margin top: `mt-20` (separación del contenido)
- Grid: 1 columna móvil, 4 Desktop (`grid-cols-1 md:grid-cols-4`)
- Enlaces: `text-sm text-gray-500 hover:underline`

## Responsive

- **Móvil**: Columnas apiladas verticalmente
- **Desktop** (`md:`): Grid de 4 columnas

## Estado Actual

⚠️ **Enlaces placeholder**: Todos apuntan a `#` (sin funcionamiento)

**Implementación sugerida**:
```jsx
<a href="/about">Tazas.shop</a>
<a href="/trends">Tendencias</a>
<a href="/sustainability">Sustentabilidad</a>
```

O usar `<Link>` de Next.js para navegación interna.

## Mejoras Recomendadas

- [ ] Convertir enlaces `<a>` a `<Link>` de Next.js
- [ ] Implementar las páginas destino
- [ ] Agregar enlaces reales a redes sociales
- [ ] Add newsletter signup
- [ ] Agregar mapa del sitio
- [ ] Incluir logos de certificaciones

## Archivos Relacionados

- [layout.tsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/src/app/layout.tsx) - Renderiza este footer globalmente
