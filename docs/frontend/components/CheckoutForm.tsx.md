# CheckoutForm.tsx

## Estado Actual

⚠️ **Archivo vacío - Pendiente de implementación**

Este archivo está destinado a contener un componente de formulario  de checkout unificado (alternativa a los componentes separados actuales).

## Propósito Esperado

Formulario todo-en-uno para el checkout que combinaría BuyerForm, ShippingOptions y PaymentMethods en un solo componente con múltiples pasos.

## Implementación Sugerida

```tsx
"use client";

import { useState } from "react";
import { useCheckout } from "@/context/CheckoutContext";

export default function CheckoutForm() {
  const [step, setStep] = useState(1);
  const { buyer, setBuyer, shipping, setShipping, payment, setPayment } = useCheckout();

  return (
    <div>
      {/* Progress stepper */}
      <div className="flex justify-between mb-8">
        <Step number={1} active={step === 1} label="Datos" />
        <Step number={2} active={step === 2} label="Envío" />
        <Step number={3} active={step === 3} label="Pago" />
      </div>

      {/* Forms por paso */}
      {step === 1 && <BuyerFormStep />}
      {step === 2 && <ShippingStep />}
      {step === 3 && <PaymentStep />}

      {/* Navegación */}
      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)}>Anterior</button>
        )}
        {step < 3 ? (
          <button onClick={() => setStep(step + 1)}>Siguiente</button>
        ) : (
          <button onClick={handleSubmit}>Confirmar</button>
        )}
      </div>
    </div>
  );
}
```

## Ventajas del Enfoque Multi-Paso

1. **UX mejorada**: Usuario se enfoca en una tarea a la vez
2. **Validación progresiva**: Valida cada paso antes de avanzar
3. **Indicador de progreso**: Usuario sabe dónde está
4. **Fácil de abandonar/retomar**: Puede volver a pasos anteriores

## Comparación con Enfoque Actual

| Aspecto | Actual (componentes separados) | CheckoutForm (stepper) |
|---------|--------------------------------|------------------------|
| Complejidad | ✅ Simple, modular | ⚠️ Más complejo |
| UX | ⚠️ Todo visible a la vez | ✅ Guiado paso a paso |
| Validación | ❌ Sin validación por paso | ✅ Valida antes de avanzar |
| Código | ✅ Separado, reusable | ⚠️ Monolítico |

## Implementación Necesaria

Si se decide usar este archivo:

1. **Elegir enfoque**: ¿Stepper o formulario largo?
2. **Migrar lógica**: Desde BuyerForm, ShippingOptions, PaymentMethods
3. **Agregar validación**: Por cada paso
4. **Progress indicator**: Barra o pasos numerados
5. **Navegación**: Botones Anterior/Siguiente

## Alternativa: Mantener Componentes Separados

Podría NO implementarse este archivo y mantener el enfoque actual de componentes separados en `/checkout/page.jsx`.

## Archivos Relacionados

- [checkout/page.jsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/src/app/checkout/page.jsx) - Enfoque actual
- [BuyerForm.jsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/docs/frontend/app/checkout/components/BuyerForm.jsx.md)
- [ShippingOptions.jsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/docs/frontend/app/checkout/components/ShippingOptions.jsx.md)
- [PaymentMethods.jsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/docs/frontend/app/checkout/components/PaymentMethods.jsx.md)
