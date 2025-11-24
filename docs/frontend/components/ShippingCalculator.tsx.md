# ShippingCalculator.tsx

## Propósito

Calculadora de opciones de envío utilizada en el checkout. Permite al usuario seleccionar entre diferentes tarifas de Correo Argentino o retiro en persona.

## Importaciones

```typescript
"use client";
import { useCheckout } from "@/context/CheckoutContext";
```

## Hooks

```typescript
const { shipping, setShipping } = useCheckout();
```

- **shipping**: `{ method: string, cost: number }`
- **setShipping**: Actualiza método y costo en el contexto

## Funciones

### `handleSelect(method, cost)`

```typescript
const handleSelect = (method: string, cost: number) => {
  setShipping({ method, cost });
};
```

**Parámetros**:
- `method`: Identificador del método de envío
- `cost`: Costo en pesos argentinos

**Efecto**: Actualiza el contexto con ambos valores

## Opciones Disponibles

### 1. Correo Argentino - Estándar

- **Method**: `"correo-estandar"`
- **Costo**: AR$ 3,500
- **Entrega**: Estándar (5-7 días hábiles)

```tsx
<input
  type="radio"
  checked={shipping.method === "correo-estandar"}
  onChange={() => handleSelect("correo-estandar", 3500)}
/>
```

### 2. Correo Argentino - Prioritario

- **Method**: `"correo-prioritario"`
- **Costo**: AR$ 5,200
- **Entrega**: Express (2-3 días hábiles)

```tsx
<input
  type="radio"
  checked={shipping.method === "correo-prioritario"}
  onChange={() => handleSelect("correo-prioritario", 5200)}
/>
```

### 3. Retiro en Persona

- **Method**: `"retiro"`
- **Costo**: AR$ 0 (Gratis)
- **Recolección**: En domicilio del vendedor

```tsx
<input
  type="radio"
  checked={shipping.method === "retiro"}
  onChange={() => handleSelect("retiro", 0)}
/>
```

## UI Estructura

```tsx
<div className="p-6 border rounded-lg shadow-sm">
  <h2 className="text-xl font-semibold mb-4">Opciones de Envío</h2>
  
  <div className="flex flex-col gap-3">
    {/* 3 opciones de radio */}
  </div>
</div>
```

**Estilo de cada opción**:
```tsx
<label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
  <input type="radio" />
  <span className="font-medium">{descripción}</span>
</label>
```

## Integración

### Uso en ShippingOptions

```jsx
import ShippingCalculator from "@/components/ShippingCalculator";

{showCalculator && (
  <div className="mt-4">
    <ShippingCalculator />
  </div>
)}
```

Renderizado condicionalmente cuando el usuario elige "Correo Argentino".

### Actualización del Contexto

Cuando el usuario selecciona una opción:

1. `handleSelect` es llamado
2. `setShipping` actualiza el contexto
3. `OrderSummary` se re-renderiza con nuevo costo
4. Total se recalcula automáticamente

## Costos

| Método | Costo | Tiempo Estimado |
|--------|-------|-----------------|
| Estándar | $3,500 | 5-7 días |
| Prioritario | $5,200 | 2-3 días |
| Retiro | $0 | Inmediato |

⚠️ **Valores hardcoded**: Los costos son fijos, no calculan según destino real.

**Mejora sugerida**: Integración con API de Correo Argentino para tarifas dinámicas según código postal.

## Mejoras Recomendadas

- [ ] Calcular costos según código postal
- [ ] Integrar API de Correo Argentino
- [ ] Mostrar tiempo estimado de entrega
- [ ] Agregar más carriers (OCA, Andreani)
- [ ] Mostrar tracking information
- [ ] Validar disponibilidad por zona

## Archivos Relacionados

- [CheckoutContext.jsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/src/context/CheckoutContext.jsx)
- [ShippingOptions.jsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/docs/frontend/app/checkout/components/ShippingOptions.jsx.md)
- [OrderSummary.jsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/docs/frontend/app/checkout/components/OrderSummary.jsx.md)
