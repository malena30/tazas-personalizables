# eslint.config.mjs

## Propósito

Configuración de ESLint para el proyecto Next.js. Define reglas de linting y archivos a ignorar.

## Código Completo

```javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
```

## Importaciones

### ESLint Core

```javascript
import { defineConfig, globalIgnores } from "eslint/config";
```

- **defineConfig**: Helper para crear configuración
- **globalIgnores**: Define archivos/carpetas a ignorar globalmente

### Configuraciones de Next.js

```javascript
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
```

#### `eslint-config-next/core-web-vitals`

Reglas de **Core Web Vitals**:
- Cumplimiento de Web Vitals de Google
- Optimización de performance
- Mejores prácticas de Next.js

**Incluye reglas como**:
- No usar `<img>` (usar `<Image>`)
- Evitar `<a>` sin `<Link>`
- Prevenir layout shifts

#### `eslint-config-next/typescript`

Reglas específicas para **TypeScript**:
- Type safety
- Consistencia de tipos
- Best practices de TS

## Configuración

```javascript
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([...])
]);
```

**Spread operator** (`...`): Combina múltiples configs.

## Archivos Ignorados

```javascript
globalIgnores([
  ".next/**",         // Build output de Next.js
  "out/**",           // Export estático
  "build/**",         // Build personalizado
  "next-env.d.ts",    // Tipos autogenerados
])
```

**Estos archivos NO son linteados** (generados automáticamente).

## Ejecución

```bash
# Lint todo el proyecto
npm run lint

# Lint archivo específico
npx eslint src/app/page.tsx

# Fix automático
npm run lint -- --fix
```

## Reglas Activas (de next/core-web-vitals)

Algunas reglas importantes:

### @next/next/no-img-element

```jsx
// ❌ Error
<img src="/foto.jpg" alt="Foto" />

// ✅ Correcto
<Image src="/foto.jpg" alt="Foto" width={500} height={300} />
```

### @next/next/no-html-link-for-pages

```jsx
// ❌ Error
<a href="/about">About</a>

// ✅ Correcto
<Link href="/about">About</Link>
```

### @next/next/no-sync-scripts

```jsx
// ❌ Error
<script src="https://example.com/script.js"></script>

// ✅ Correcto
<Script src="https://example.com/script.js" strategy="lazyOnload" />
```

## Personalización

### Deshabilitar una regla

```javascript
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@next/next/no-img-element": "off",
    }
  },
  globalIgnores([...])
]);
```

### Agregar reglas custom

```javascript
{
  rules: {
    "no-console": "warn",
    "prefer-const": "error",
  }
}
```

## Integración IDE

### VS Code

`.vscode/settings.json`:
```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Archivos Relacionados

- [package.json](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/docs/frontend/config/package.json.md) - Script `npm run lint`
- [tsconfig.json](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/docs/frontend/config/tsconfig.json.md) - Configuración TypeScript

## Referencias

- [Next.js ESLint](https://nextjs.org/docs/app/building-your-application/configuring/eslint)
- [Core Web Vitals Config](https://nextjs.org/docs/app/api-reference/cli/next-lint#core-web-vitals)
