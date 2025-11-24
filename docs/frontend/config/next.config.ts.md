# next.config.ts

## Propósito

Archivo de configuración de Next.js. Define opciones de comportamiento del framework, optimizaciones y configuración de módulos.

## Código Completo

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
};

export default nextConfig;
```

## Configuración

### `reactStrictMode: true`

Activa el **Strict Mode** de React.

**Beneficios**:
- Detecta componentes con side effects
- Advierte sobre APIs deprecated
- Double-invoca funciones en desarrollo para encontrar bugs

**Comportamiento en desarrollo**:
```jsx
// Componentes se renderizan 2 veces
useEffect(() => {
  console.log("Esto se ejecuta 2 veces en dev");
}, []);
```

⚠️ Es normal y solo ocurre en development mode.

---

### `images.remotePatterns`

Configuración del componente `next/image` para dominios remotos.

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.pexels.com',
    },
  ],
}
```

**Permite** imágenes desde `https://images.pexels.com/*`

**Uso en la app**:
```jsx
<Image
  src="https://images.pexels.com/photos/1415550/pexels-photo-1415550.jpeg"
  alt="Taza"
  fill
/>
```

### Seguridad

Next.js requiere especificar dominios externos por seguridad.

**Sin esta config**: Error
```
Invalid src prop (https://images.pexels.com/...) on `next/image`
```

### Agregar Más Dominios

Para imágenes de otros sitios:

```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.pexels.com' },
    { protocol: 'https', hostname: 'cdn.cloudinary.com' },
    { protocol: 'https', hostname: 's3.amazonaws.com' },
  ],
}
```

O con wildcard de subdominio:

```typescript
{
  protocol: 'https',
  hostname: '**.cloudinary.com',  // Cualquier subdominio
}
```

## Configuraciones Adicionales Comunes

### Output (Standalone)

Para deployments optimizados:
```typescript
output: 'standalone',
```

### Redirects

Redireccionamientos:
```typescript
async redirects() {
  return [
    {
      source: '/old-page',
      destination: '/new-page',
      permanent: true,
    },
  ]
}
```

### Environment Variables

Variables públicas:
```typescript
env: {
  CUSTOM_VAR: process.env.CUSTOM_VAR,
}
```

### Webpack Custom

Modificar configuración de webpack:
```typescript
webpack: (config) => {
  // Modificaciones
  return config;
}
```

## TypeScript Type

```typescript
/** @type {import('next').NextConfig} */
```

Proporciona autocompletado en IDEs.

## Export

```typescript
export default nextConfig;
```

ES Module export (TypeScript).

**Alternativa JS**:
```javascript
module.exports = nextConfig;
```

## Mejoras Recomendadas

- [ ] Agregar más optimizaciones de imágenes
- [ ] Configurar rewrites si hay API proxy
- [ ] Agregar headers de seguridad
- [ ] Configurar i18n si hay múltiples idiomas
- [ ] Agregar experimental features si es necesario

## Archivos Relacionados

- [package.json](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/docs/frontend/config/package.json.md) - Dependencias del proyecto
- [tsconfig.json](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/docs/frontend/config/tsconfig.json.md) - Configuración de TypeScript

## Referencias

- [Next.js Configuration](https://nextjs.org/docs/app/api-reference/next-config-js)
- [next/image Remote Patterns](https://nextjs.org/docs/app/api-reference/components/image#remotepatterns)
