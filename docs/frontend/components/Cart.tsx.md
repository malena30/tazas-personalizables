# Cart.tsx

## Propósito

Componente genérico para mostrar el carrito de compras. Permite visualizar items, eliminarlos individualmente o vaciar todo el carrito.

## Importaciones

```typescript
"use client";
import { useCartStore } from "@/store/cartStore";
```

## Hooks

```typescript
const cart = useCartStore((state) => state.cart);
const removeFromCart = useCartStore((state) => state.removeFromCart);
const clearCart = useCartStore((state) => state.clearCart);
```

## Renderizado Condicional

### Carrito Vacío

```tsx
if (cart.length === 0)
  return <p className="mt-6 text-gray-600">Tu carrito está vacío.</p>;
```

Muestra mensaje simple si no hay productos.

### Carrito con Productos

```tsx
<div className="mt-6 p-4 bg-gray-100 rounded-lg">
  <h2>Carrito</h2>
  <ul>{/* Lista de productos */}</ul>
  <button onClick={clearCart}>Vaciar carrito</button>
</div>
```

## Lista de Productos

### Key única

```tsx
key={`${item.id}-${index}`}
```

Usa composición de `id + index` para evitar colisiones si el mismo producto se repite.

### Estructura del Item

```tsx
<li className="flex justify-between items-center border-b pb-2">
  <span>
    {item.name} - ${item.price.toLocaleString("es-AR")}
  </span>
  <button onClick={() => removeFromCart(item.id)}>
    Eliminar
  </button>
</li>
```

**Características**:
- Formato de precio: `toLocaleString("es-AR")` → separador de miles
- Botón eliminar individual
- Borde inferior para separación

## Funciones

### `removeFromCart(id)`

Elimina un producto específico del carrito.

```typescript
onClick={() => removeFromCart(item.id)}
```

### `clearCart()`

Vacía completamente el carrito.

```typescript
onClick={clearCart}
```

## Estilos

- Container: `mt-6 p-4 bg-gray-100 rounded-lg`
- Lista: `space-y-2` (gap vertical)
- Items: `flex justify-between items-center border-b pb-2`
- Botón eliminar: `text-red-500 hover:text-red-700`
- Botón vaciar: `bg-red-500 text-white hover:bg-red-600`

## Diferencia con cart/page.tsx

Este componente es más **simple** que `cart/page.tsx`:

| Característica | Cart.tsx | cart/page.tsx |
|----------------|----------|---------------|
| Modificar cantidad | ❌ No | ✅ Sí (+/-) |
| Cálculo de envío | ❌ No | ✅ Sí |
| Botón comprar | ❌ No | ✅ Sí |
| Layout completo | ❌ No | ✅ Sí (página) |

**Uso recomendado**:
- **Cart.tsx**: Widget reutilizable en sidebar/modal
- **cart/page.tsx**: Página completa del carrito

## Uso

Este componente puede usarse como widget:

```tsx
// En un sidebar o modal
import Cart from "@/components/Cart";

<aside>
  <Cart />
</aside>
```

O podría reemplazarse completamente por `cart/page.tsx` si no se necesita un widget.

## Mejoras Recomendadas

- [ ] Agregar controles de cantidad
- [ ] Mostrar imagen del producto
- [ ] Calcular subtotal
- [ ] Agregar animaciones al eliminar
- [ ] Implementar confirmación antes de vaciar

## Archivos Relacionados

- [cartStore.ts](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/src/store/cartStore.ts)
- [cart/page.tsx](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/frontend/src/app/cart/page.tsx) - Versión completa
