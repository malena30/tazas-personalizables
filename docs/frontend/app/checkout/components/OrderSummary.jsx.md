# OrderSummary.jsx

## Propósito

Resumen final del pedido en el checkout. Muestra subtotal, costo de envío, total y el botón para confirmar la compra.

## Importaciones

```jsx
"use client";
import { useCheckout } from "@/context/CheckoutContext";
```

## Hooks

```jsx
const { subtotal, shipping, total } = useCheckout();
```

### Valores del Contexto

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `subtotal` | number | Suma de productos del carrito |
| `shipping` | object | `{ method: string, cost: number }` |
| `total` | number | `subtotal + shipping.cost` |

## UI Estructura

### Resumen de Costos

```jsx
<div className="flex flex-col gap-3">
  {/* Subtotal */}
  <div className="flex justify-between">
    <span>Subtotal:</span>
    <span>${subtotal}</span>
  </div>

  {/* Envío */}
  <div className="flex justify-between">
    <span>Envío:</span>
    <span>${shipping.cost}</span>
  </div>

  {/* Total */}
  <div className="flex justify-between font-bold text-lg border-t">
    <span>Total:</span>
    <span>${total}</span>
  </div>
</div>
```

### Botón de Confirmación

```jsx
<button className="mt-6 w-full bg-black text-white py-3 rounded hover:bg-gray-800">
  Confirmar Compra
</button>
```

**Características**:
- Ancho completo (`w-full`)
- Fondo negro
- Hover: Oscurece a gris 800
- Padding vertical: 12px

## Funcionalidad del Botón

⚠️ **Sin implementación**: El botón NO tiene `onClick` handler.

**Implementación sugerida**:

```jsx
const handleConfirm = async () => {
  // 1. Validar datos del formulario
  if (!buyer.name || !buyer.email) {
    alert("Completa todos los campos");
    return;
  }

  // 2. Enviar orden al backend
  const response = await fetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify({
      buyer,
      shipping,
      payment,
      cart,
      total
    })
  });

  // 3. Redirigir a confirmación o pago
  const data = await response.json();
  router.push(`/checkout/success?orderId=${data.id}`);
};

<button onClick={handleConfirm}>
  Confirmar Compra
</button>
```

## Cálculo del Total

Realizado automáticamente en el contexto:

```jsx
// CheckoutContext.jsx
const total = subtotal + shipping.cost;
```

### Ejemplo de Cálculo

```
Productos: $11,200
Envío (Correo): $3,500
---
Total: $14,700
```

## Estilos

- Container: `p-6 border rounded-lg shadow-md`
- Título: `text-xl font-semibold mb-4`
- Items: `flex justify-between`
- Total row: `font-bold text-lg mt-3 pt-3 border-t`
- Botón: `bg-black text-white py-3 rounded hover:bg-gray-800`

## Mejoras Recomendadas

- [ ] Implementar handler de confirmación
- [ ] Agregar loading state al confirmar
- [ ] Mostrar descuento si aplica (efectivo)
- [ ] Validar datos antes de procesar
- [ ] Deshabilitar botón si faltan datos
- [ ] Agregar detalle de productos
- [ ] Implementar términos y condiciones checkbox

## Flujo Recomendado

```mermaid
graph TD
    A[Usuario revisa resumen] --> B{Click Confirmar}
    B --> C{¿Datos completos?}
    C -->|No| D[Mostrar errores]
    C -->|Sí| E[POST /api/orders]
    E --> F{¿Éxito?}
    F -->|Sí| G[/checkout/success]
    F -->|No| H[Mostrar error]
```

## Archivos Relacionados

- [CheckoutContext.jsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/src/context/CheckoutContext.jsx)
- [BuyerForm.jsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/docs/frontend/app/checkout/components/BuyerForm.jsx.md)
- [PaymentMethods.jsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/docs/frontend/app/checkout/components/PaymentMethods.jsx.md)
