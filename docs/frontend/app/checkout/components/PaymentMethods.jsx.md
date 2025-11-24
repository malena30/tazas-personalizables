# PaymentMethods.jsx

## Propósito

Componente para seleccionar el método de pago durante el checkout. Ofrece opciones de efectivo, transferencia bancaria y Mercado Pago (próximamente).

## Importaciones

```jsx
"use client";
import { useCheckout } from "@/context/CheckoutContext";
```

## Hooks

```jsx
const { payment, setPayment } = useCheckout();
```

- **payment**: String con el método seleccionado
- **setPayment**: Función para actualizar el método

## Funciones

### `handleSelect(method)`

```jsx
const handleSelect = (method) => {
  setPayment(method);
};
```

Actualiza el método de pago en el contexto global.

## Métodos de Pago

### 1. Efectivo

- **Value**: `"efectivo"`
- **Características**: 10% de descuento
- **Text**: "Efectivo (10% de descuento)"
- **Estado**: ✅ Habilitado

```jsx
<input
  type="radio"
  name="payment"
  checked={payment === "efectivo"}
  onChange={() => handleSelect("efectivo")}
/>
```

### 2. Transferencia Bancaria

- **Value**: `"transferencia"`
- **Text**: "Transferencia bancaria"
- **Estado**: ✅ Habilitado

```jsx
<input
  type="radio"
  name="payment"
  checked={payment === "transferencia"}
  onChange={() => handleSelect("transferencia")}
/>
```

### 3. Mercado Pago

- **Estado**: ⚠️ Deshabilitado (próximamente)
- **Text**: "Mercado Pago (Próximamente)"
- **Opacity**: 50% para indicar no disponible

```jsx
<label className="opacity-50">
  <input
    type="radio"
    name="payment"
    disabled
  />
  <span>Mercado Pago (Próximamente)</span>
</label>
```

## UI Estructura

```jsx
<div className="p-6 border rounded-lg shadow-sm flex flex-col gap-4">
  <h2 className="text-2xl font-semibold">Método de Pago</h2>
  
  <div className="flex flex-col gap-3">
    {/* Radio buttons para payment methods */}
  </div>
</div>
```

## Integración con Contexto

**Valor guardado**: String simple

```javascript
payment: "efectivo" | "transferencia" | ""
```

**Persistencia**: Guardado en localStorage a través del CheckoutContext

## Descuentos

### Lógica de Descuento (Faltante)

⚠️ El componente muestra "10% de descuento" pero NO lo aplica.

**Implementación sugerida** en `OrderSummary`:

```jsx
const { payment, subtotal } = useCheckout();

const discount = payment === "efectivo" ? subtotal * 0.10 : 0;
const finalTotal = subtotal + shipping.cost - discount;
```

## Mejoras Recomendadas

- [ ] Implementar lógica de descuento real
- [ ] Agregar más métodos (tarjeta, débito)
- [ ] Integrar Mercado Pago SDK
- [  ] Mostrar logos de payment methods
- [ ] Agregar información de cada método

## Archivos Relacionados

- [CheckoutContext.jsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/src/context/CheckoutContext.jsx)
- [OrderSummary.jsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/src/app/checkout/components/OrderSummary.jsx.md)
