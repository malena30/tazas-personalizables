# postcss.config.js

## Propósito

Configuración de PostCSS, el procesador de CSS utilizado por Next.js y Tailwind CSS.

## Código Completo

```javascript
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
```

## Plugins

### 1. @tailwindcss/postcss

Plugin de PostCSS para **Tailwind CSS v4**.

```javascript
"@tailwindcss/postcss": {}
```

**Funcionalidad**:
- Procesa la directiva `@import "tailwindcss"`
- Genera clases utilitarias
- Aplica transformaciones de Tailwind

**Diferencia con v3**:
```javascript
// v3 (antiguo)
plugins: {
  tailwindcss: {},
}

// v4 (actual)
plugins: {
  "@tailwindcss/postcss": {},
}
```

### 2. autoprefixer

Agrega prefijos de vendor automáticamente.

```javascript
autoprefixer: {}
```

**Ejemplo**:
```css
/* Input */
.element {
  display: flex;
 }

/* Output (si es necesario) */
.element {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
```

**Basado en** browserslist (en package.json).

## Orden de Plugins

El orden **importa**:

1. **Primero Tailwind**: Genera CSS
2. **Luego Autoprefixer**: Agrega prefijos al CSS generado

## Integración con Next.js

Next.js usa PostCSS automáticamente para:
- `globals.css`
- `modules.css`
- Archivos CSS importados

**No requiere configuración adicional** en Next.js.

## Browserslist

Autoprefixer usa targeting de browsers.

**Agregar a package.json** (opcional):

```json
"browserslist": [
  ">0.2%",
  "not dead",
  "not op_mini all"
]
```

O archivo `.browserslistrc`:
```
> 0.2%
not dead
not ie 11
```

## Plugins Adicionales Comunes

### cssnano (minificación)

```javascript
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
  },
};
```

### postcss-import

Para `@import` en CSS:

```javascript
plugins: {
  "postcss-import": {},
  "@tailwindcss/postcss": {},
  autoprefixer: {},
}
```

## Debugging

Ver CSS procesado:

```bash
# En development
npm run dev
# Inspecciona .next/static/css/
```

##Referencias

- [PostCSS](https://postcss.org/)
- [Autoprefixer](https://github.com/postcss/autoprefixer)
- [Tailwind CSS v4 PostCSS](https://tailwindcss.com/docs/installation/postcss)

## Archivos Relacionados

- [globals.css](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/docs/frontend/app/globals.css.md) - Importa Tailwind
- [package.json](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/docs/frontend/config/package.json.md) - Dependencias PostCSS
