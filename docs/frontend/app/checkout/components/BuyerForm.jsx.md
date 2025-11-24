# BuyerForm.jsx

## Propósito

Formulario para recolectar datos personales y de contacto del comprador durante el checkout. Componente controlado que gestiona localmente el estado del formulario.

## Importaciones

```jsx
"use client";
import { useState } from "react";
```

- **"use client"**: Client Component (requiere estado)
- **useState**: Gestión de estado del formulario

## Estado Local

```jsx
const [buyer, setBuyer] = useState({
  name: "",
  surname: "",
  email: "",
  phone: "",
  dni: "",
  address: "",
  city: "",
  postalCode: "",
});
```

### Campos del Estado

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `name` | string | Nombre del comprador |
| `surname` | string | Apellido |
| `email` | string | Correo electrónico |
| `phone` | string | Número de teléfono |
| `dni` | string | Documento Nacional de Identidad |
| `address` | string | Dirección de entrega |
| `city` | string | Ciudad |
| `postalCode` | string | Código postal |

## Funciones

### `handleChange(e)`

Handler genérico para actualizar cualquier campo del formulario.

**Parámetros**:
- `e: React.ChangeEvent<HTMLInputElement>` - Evento del input

**Implementación**:
```jsx
const handleChange = (e) => {
  setBuyer({
    ...buyer,
    [e.target.name]: e.target.value,
  });
};
```

**Funcionamiento**:
- Usa computed property names: `[e.target.name]`
- Mantiene otros campos intactos con spread operator
- Un solo handler para todos los inputs

## UI Estructura

### Container

```jsx
<div className="p-6 border rounded-lg shadow-md">
  <h2 className="text-xl font-semibold mb-4">Datos del comprador</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Inputs */}
  </div>
</div>
```

**Layout**:
- Grid responsive: 1 columna móvil, 2 columnas desktop
- Gap de 4 unidades (1rem)
- Border y sombra para card effect

### FormInputs

Todos los inputs siguen el mismo patrón:

```jsx
<input
  type="text|email"
  name="fieldName"
  placeholder="Label"
  value={buyer.fieldName}
  onChange={handleChange}
  className="border p-2 rounded"
/>
```

**Lista de inputs**:

1. **Nombre** (`name`)
   - Type: text
   - Placeholder: "Nombre"

2. **Apellido** (`surname`)
   - Type: text
   - Placeholder: "Apellido"

3. **Email** (`email`)
   - Type: email
   - Placeholder: "Email"

4. **Teléfono** (`phone`)
   - Type: text
   - Placeholder: "Teléfono"

5. **DNI** (`dni`)
   - Type: text
   - Placeholder: "DNI"

6. **Dirección** (`address`)
   - Type: text
   - Placeholder: "Dirección"

7. **Ciudad** (`city`)
   - Type: text
   - Placeholder: "Ciudad"

8. **Código Postal** (`postalCode`)
   - Type: text
   - Placeholder: "Código Postal"

## Consideraciones

### Estado NO Persistido

⚠️ **Importante**: Este componente **NO** guarda los datos en el contexto de checkout.

**Problema actual**:
- Los datos solo existen en estado local
- No se comparten con `OrderSummary` o el proceso de compra
- Se pierden si el usuario navega a  otra página

**Solución recomendada**:

```jsx
import { useCheckout } from "@/context/CheckoutContext";

export default function BuyerForm() {
  const { buyer, setBuyer } = useCheckout();
  
  const handleChange = (e) => {
    setBuyer({
      ...buyer,
      [e.target.name]: e.target.value,
    });
  };
  // ...
}
```

### Validaciones Faltantes

❌ **Sin validación**:
- No valida formato de email
- No valida longitud de DNI
- No valida que campos estén completos
- No muestra errores

**Implementación sugerida**:

```jsx
const [errors, setErrors] = useState({});

const validate = () => {
  const newErrors = {};
  
  if (!buyer.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    newErrors.email = "Email inválido";
  }
  
  if (buyer.dni.length !== 8) {
    newErrors.dni = "DNI debe tener 8 dígitos";
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### Tipos de Input

Todos usan `type="text"` excepto email.

**Mejoras**:
- `phone` podría ser `type="tel"`
- `dni` podría limitar solo números
- `postalCode` podría  ser numérico

## Responsive Design

- **Móvil**: Inputs apilados verticalmente (1 columna)
- **Desktop** (`md:`): Grid de 2 columnas
- Todos los inputs ocupan ancho completo

## Estilos

**Clases aplicadas**:
- Container: `p-6 border rounded-lg shadow-md`
- Título: `text-xl font-semibold mb-4`
- Grid: `grid grid-cols-1 md:grid-cols-2 gap-4`
- Inputs: `border p-2 rounded`

## Mejoras Recomendadas

- [ ] Integrar con `CheckoutContext`
- [ ] Agregar validación de campos
- [ ] Mostrar mensajes de error
- [ ] Agregar campos requeridos (asteriscos)
- [ ] Implementar auto-completado
- [ ] Formatear DNI y teléfono automáticamente
- [ ] Agregar tooltips de ayuda

## Archivos Relacionados

- [CheckoutContext.jsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/src/context/CheckoutContext.jsx) - Contexto que debería usar
- [page.jsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/src/app/checkout/page.jsx) - Página que renderiza este componente

## Ejemplo de Uso

```jsx
import BuyerForm from './components/BuyerForm';

<BuyerForm />
```

No requiere props. Gestiona su propio estado internally.
