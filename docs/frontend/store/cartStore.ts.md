# cartStore.ts

## Propósito

Store de Zustand para gestión global del estado del carrito de compras con persistencia en localStorage.

## Importaciones

```typescript
"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
```

- **create**: Función principal de Zustand para crear stores
- **persist**: Middleware para persistencia en localStorage

## Tipos TypeScript

### `Product`

```typescript
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;  // Opcional
}
```

Representa un producto básico sin cantidad.

### `CartItem`

```typescript
export interface CartItem extends Product {
  quantity: number;
}
```

Producto en el carrito, extiende `Product` agregando cantidad.

### `CartState`

```typescript
interface CartState {
  cart: CartItem[];
  shippingCost: number;
  addToCart: (product: Product & { quantity?: number }) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  setShippingCost: (cost: number) => void;
}
```

Define el shape completo del store.

## Creación del Store

```typescript
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Estado y acciones
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        cart: state.cart,
        shippingCost: state.shippingCost,
      }),
    }
  )
);
```

## Estado Inicial

```typescript
cart: [],
shippingCost: 0,
```

## Acciones

### `addToCart(product)`

Agrega un producto al carrito o incrementa su cantidad si ya existe.

```typescript
addToCart: (product) =>
  set((state) => {
    const existing = state.cart.find((item) => item.id === product.id);

    if (existing) {
      // Incrementa cantidad del existente
      return {
        cart: state.cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        ),
      };
    }

    // Agrega nuevo producto
    return {
      cart: [
        ...state.cart,
        { ...product, quantity: product.quantity || 1 },
      ],
    };
  }),
```

**Lógica**:
1. Busca si el producto ya existe por `id`
2. Si existe: suma la cantidad (o 1 si no se especifica)
3. Si no existe: agrega al array con cantidad (default 1)

**Parámetro**:
- `product: Product & { quantity?: number }`
- Acepta producto con cantidad opcional

**Ejemplos**:
```typescript
// Agregar 1 unidad
addToCart({ id: 1, name: "Taza", price: 3500, image: "..." });

// Agregar 3 unidades
addToCart({ id: 2, name: "Set", price: 7500, image: "...", quantity: 3 });
```

---

### `removeFromCart(id)`

Elimina un producto completamente del carrito.

```typescript
removeFromCart: (id) =>
  set((state) => ({
    cart: state.cart.filter((item) => item.id !== id),
  })),
```

**Uso**:
```typescript
removeFromCart(1);  // Elimina producto con id=1
```

---

### `updateQuantity(id, quantity)`

Actualiza la cantidad de un producto existente.

```typescript
updateQuantity: (id, quantity) =>
  set((state) => ({
    cart: state.cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    ),
  })),
```

**Uso**:
```typescript
updateQuantity(1, 5);  // Cambia cantidad del producto 1 a 5
```

⚠️ **Sin validación**: No verifica mínimo (podría ser 0 o negativo)

---

### `clearCart()`

Vacía completamente el carrito.

```typescript
clearCart: () => set({ cart: [] }),
```

**Uso**:
```typescript
clearCart();  // cart = []
```

---

### `setShippingCost(cost)`

Establece el costo de envío.

```typescript
setShippingCost: (cost) => set({ shippingCost: cost }),
```

**Uso**:
```typescript
setShippingCost(3500);  // Actualiza costo de envío
```

## Persistencia

### Configuración

```typescript
{
  name: "cart-storage",  // Key en localStorage
  partialize: (state) => ({
    cart: state.cart,
    shippingCost: state.shippingCost,
  }),
}
```

**`name`**: Nombre de la key en localStorage

**`partialize`**: Solo persiste `cart` y `shippingCost` (no las funciones)

### localStorage

Los datos se guardan automáticamente en:
```
localStorage.getItem("cart-storage")
```

**Formato JSON**:
```json
{
  "state": {
    "cart": [
      { "id": 1, "name": "Taza", "price": 3500, "quantity": 2 }
    ],
    "shippingCost": 3500
  },
  "version": 0
}
```

## Uso en Componentes

### Acceder al store completo

```typescript
const cartStore = useCartStore();
```

### Selectores específicos

```typescript
// Solo el cart
const cart = useCartStore((state) => state.cart);

// Solo acciones
const addToCart = useCartStore((state) => state.addToCart);

// Múltiples valores
const { cart, shippingCost, clearCart } = useCartStore();
```

**Ventaja de selectores**: Re-renderiza solo si cambia el valor seleccionado.

## Cálculos Derivados

El store NO incluye cálculos como subtotal o total. Estos se hacen donde se necesitan:

```typescript
// En un componente
const cart = useCartStore((state) => state.cart);
const shippingCost = useCartStore((state) => state.shippingCost);

const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
const total = subtotal + shippingCost;
```

## Ventajas de Zustand

1. **Simple**: Menos boilerplate que Redux
2. **TypeScript**: Soporte nativo
3. **Persistencia**: Middleware incluido
4. **Performance**: Selectores optimizados
5. **DevTools**: Compatibilidad con Redux DevTools

## Mejoras Recomendadas

- [ ] Validar cantidad mínima en `updateQuantity`
- [ ] Agregar límite máximo por producto (stock)
- [ ] Calcular subtotal/total en el store
- [ ] Agregar timestamp de última actualización
- [ ] Implementar undo/redo
- [ ] Migración de versiones del store

## Archivos Relacionados

- [products/page.tsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/docs/frontend/app/products/page.tsx.md) - Usa `addToCart`
- [cart/page.tsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/docs/frontend/app/cart/page.tsx.md) - Usa todas las acciones
- [Navbar.tsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/docs/frontend/components/Navbar.tsx.md) - Lee cart para contador
