# package.json

## Propósito

Archivo de configuración del proyecto Node.js. Define metadata, dependencias, scripts de desarrollo y build.

## Metadata

```json
{
  "name": "frontend",
  "version": "1.0.0",
  "main": "index.js"
}
```

- **name**: Nombre del proyecto
- **version**: Versión actual
- **main**: Entry point (no usado en Next.js)

## Dependencias de Producción

```json
"dependencies": {
  "next": "^16.0.3",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-icons": "^5.5.0",
  "zustand": "^5.0.8"
}
```

### Next.js 16.0.3
- Framework principal
- App Router (nuevo sistema de routing)
- Server Components por defecto

### React 19.2.0
- ⚠️ **Versión muy nueva** (React 19 RC)
- Puede tener breaking changes
- Considera usar React 18.x para estabilidad

### react-icons 5.5.0
- Biblioteca de íconos
- Usado en: `react-icons/fa` (Font Awesome)

### zustand 5.0.8
- Gestión de estado
- Más simple que Redux
- Usado para cartStore

## Dependencias de Desarrollo

```json
"devDependencies": {
  "@tailwindcss/postcss": "^4.1.17",
  "@types/node": "24.10.1",
  "autoprefixer": "^10.4.22",
  "postcss": "^8.5.6",
  "tailwindcss": "^4.1.17",
  "typescript": "5.9.3"
}
```

### Tailwind CSS 4.1.17
- **‼️ Tailwind v4 (Beta)**
- Nueva arquitectura
- Puede tener bugs

### TypeScript 5.9.3
- Tipado estático
- Configurado en `tsconfig.json`

### @types/node 24.10.1
- Tipos de Node.js para TypeScript

### PostCSS & Autoprefixer
- Procesamiento de CSS
- Autoprefixing para compatibilidad

## Scripts

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

### `npm run dev`
Inicia servidor de desarrollo:
- Puerto: 3000 (default)
- Hot reload automático
- Error overlay

### `npm run build`
Genera build de producción:
- Optimización de bundles
- Static generation donde aplique
- Output: `.next/` directory

### `npm run start`
Inicia servidor de producción:
- Requiere `npm run build` primero
- Sirve la aplicación optimizada

### `npm run lint`
Ejecuta ESLint:
- Revisa código según `eslint.config.mjs`
- Busca errores y warnings

## Notas de Versiones

### React 19

⚠️ **Consideración**: React 19 está en RC (Release Candidate)

**Riesgos**:
- Posibles breaking changes
- Algunas librerías pueden no ser compatibles
- Documentación limitada

**Recomendación**: Downgrade a React 18.x para estabilidad:
```json
"react": "^18.3.1",
"react-dom": "^18.3.1"
```

### Tailwind v4

⚠️ **Beta**: Tailwind CSS v4 está en beta

**Nueva sintaxis**:
```css
/* v4 */
@import "tailwindcss";

/* v3 */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Instalación

```bash
# Instalar dependencias
npm install

# O con yarn
yarn install
```

## Actualizar Dependencias

```bash
# Ver outdated
npm outdated

# Actualizar todo (cuidado)
npm update

# Actualizar una específica
npm install next@latest
```

## Vulnerabilidades

Revisar vulnerabilities periódicamente:
```bash
npm audit

#Fix automático
npm audit fix
```

## Archivos Relacionados

- [next.config.ts](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/next.config.ts) - Configuración de Next.js
- [tsconfig.json](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/tsconfig.json) - Configuración de TypeScript
- [postcss.config.js](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/postcss.config.js) - Configuración de PostCSS
