# tsconfig.json

##  Propósito

Configuración de TypeScript para el proyecto Next.js. Define opciones del compilador, paths, y archivos a incluir/excluir.

## Código Completo

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    "**/*.js",
    "**/*.jsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

## Compiler Options

### `target: "ES2017"`

Versión de JavaScript del output compilado.

**ES2017 incluye**:
- async/await
- Object.values/entries
- String padding

### `lib`

Definiciones de tipos disponibles:

- `"dom"`: APIs del navegador (document, window)
- `"dom.iterable"`: NodeList, HTMLCollection iterables
- `"esnext"`: Últimas features de JavaScript

### `allowJs: true`

**Permite archivos .js y .jsx** además de TypeScript.

Útil para migración gradual o incluir librerías JS.

### `skipLibCheck: true`

Omite type-checking de archivos `.d.ts` en `node_modules`.

**Ventaja**: Build más rápido

**Desventaja**: No detecta errores en dependencias

### `strict: true`

Activa **modo strict** de TypeScript.

Incluye:
- `noImplicitAny`
- `strictNullChecks`
- `strictFunctionTypes`
- `strictBindCallApply`
- Y más...

**Recomendado** para proyectos nuevos.

### `noEmit: true`

TypeScript **NO emite archivos** .js compilados.

**Por qué**: Next.js usa su propio compilador (SWC), no tsc.

TypeScript solo se usa para type-checking.

### `esModuleInterop: true`

Permite imports de CommonJS más limpios:

```typescript
// Con esModuleInterop
import React from 'react';

// Sin esModuleInterop
import * as React from 'react';
```

### `module: "esnext"`

Sistema de módulos: ES Modules (import/export)

### `moduleResolution: "bundler"`

**Nuevo en TS 5.0+**

Resolución optimizada para bundlers modernos (Webpack, Vite, Next.js).

### `resolveJsonModule: true`

Permite importar archivos JSON:

```typescript
import data from './data.json';
```

### `isolatedModules: true`

Cada archivo debe ser compilable independientemente.

**Requerido** para SWC (compilador de Next.js).

### `jsx: "react-jsx"`

Usa la nueva JSX transform de React 17+:

```tsx
// No requiere: import React from 'react'
function Component() {
  return <div>Hello</div>;
}
```

### `incremental: true`

Comprobación incremental: solo revisa archivos cambiados.

**Beneficio**: Builds más rápidos en desarrollo.

### `plugins`

```json
"plugins": [{ "name": "next" }]
```

Plugin de TypeScript de Next.js para mejor integración.

### `paths`

```json
"paths": {
  "@/*": ["./src/*"]
}
```

**Alias de importación**: `@/` apunta a `src/`

**Uso**:
```typescript
// En lugar de:
import { Navbar } from '../../components/Navbar';

// Usa:
import { Navbar } from '@/components/Navbar';
```

## Include

```json
"include": [
  "next-env.d.ts",
  "**/*.ts",
  "**/*.tsx",
  "**/*.js",
  "**/*.jsx",
  ".next/types/**/*.ts",
  ".next/dev/types/**/*.ts",
  "**/*.mts"
]
```

Archivos que TypeScript debe procesar:

- `next-env.d.ts`: Tipos de Next.js
- `**/*.ts`, `**/*.tsx`: Archivos TypeScript
- `**/*.js`, `**/*.jsx`: Archivos JavaScript
- `.next/types/**`: Tipos generados por Next.js
- ` **/*.mts`: TypeScript modules

## Exclude

```json
"exclude": ["node_modules"]
```

Ignora `node_modules` (miles de archivos).

## Mejoras Opcionales

### Más Strict

```json
"compilerOptions": {
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true
}
```

### Paths Adicionales

```json
"paths": {
  "@/*": ["./src/*"],
  "@components/*": ["./src/components/*"],
  "@utils/*": ["./src/utils/*"]
}
```

## Archivos Relacionados

- [next-env.d.ts](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/next-env.d.ts) - Tipos de Next.js
- [package.json](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/docs/frontend/config/package.json.md) - Incluye TypeScript 5.9.3

## Verificación

```bash
# Type-check manual
npx tsc --noEmit

# Watch mode
npx tsc --noEmit --watch
```

## Referencias

- [TypeScript tsconfig Reference](https://www.typescriptlang.org/tsconfig)
- [Next.js TypeScript](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
