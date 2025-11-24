# useCheckout.js

## Propósito

Hook personalizado simple que re-exporta el hook `useCheckout` desde `CheckoutContext`.

## Código

```javascript
import { useContext } from 'react'
import { CheckoutContext } from '../../context/CheckoutContext'

export function useCheckout() {
  return useContext(CheckoutContext)
}
```

## Estado Actual

⚠️ **Duplicado innecesario**

Este archivo es **redundante** porque `CheckoutContext.jsx` ya exporta el mismo hook:

```jsx
// En CheckoutContext.jsx
export function useCheckout() {
  return useContext(CheckoutContext);
}
```

## Problema de Importación

El import usa **path relativo**:
```javascript
import { CheckoutContext } from '../../context/CheckoutContext'
```

Debería usar el alias `@/`:
```javascript
import { CheckoutContext } from '@/context/CheckoutContext'
```

## Uso Actual

Los componentes importan desde ambos lugares indistintamente:

```javascript
// Opción 1: Desde contexto (recomendado)
import { useCheckout } from "@/context/CheckoutContext";

// Opción 2: Desde hooks (este archivo)
import { useCheckout } from "@/hooks/useCheckout";
```

Ambos funcionan pero causan confusión.

## Recomendación

**Eliminar este archivo** y usar solo la exportación desde `CheckoutContext.jsx`:

```javascript
// En todos los componentes
import { useCheckout } from "@/context/CheckoutContext";
```

## Alternativa: Hook Mejorado

Si se mantiene, podría agregar validación:

```javascript
import { useContext } from 'react';
import { CheckoutContext } from '@/context/CheckoutContext';

export function useCheckout() {
  const context = useContext(CheckoutContext);
  
  if (!context) {
    throw new Error('useCheckout must be used within CheckoutProvider');
  }
  
  return context;
}
```

Esto previene uso fuera del provider.

## Archivos Relacionados

- [CheckoutContext.jsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/src/context/CheckoutContext.jsx) - Exporta el mismo hook
