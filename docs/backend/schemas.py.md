# schemas.py

## Propósito

Define los esquemas de datos Pydantic para validación de entrada/salida en la API.

## Schemas Implementados

### Autenticación

#### `UserRegister`
Datos requeridos para registro.
- `username`: String (3-50 caracteres)
- `email`: String (formato email)
- `password`: String (min 6 caracteres)

#### `UserLogin`
Datos para iniciar sesión.
- `username`: String
- `password`: String

#### `UserResponse`
Datos públicos del usuario (sin password).
- `id`: UUID
- `username`: String
- `email`: String
- `created_at`: DateTime

#### `Token`
Respuesta de login exitoso.
- `access_token`: String (JWT)
- `token_type`: String ("bearer")

### Diseños

#### `DesignCreate`
Datos para crear un diseño.
- `name`: String
- `mug_color`: String (Hex color)
- `elements`: List[JSON] (Canvas elements)
- `thumbnail`: String (opcional)

#### `DesignUpdate`
Datos para actualizar (todos opcionales).
- `name`, `mug_color`, `elements`, `thumbnail`

#### `DesignResponse`
Datos completos del diseño.
- Incluye `id`, `user_id`, `created_at`, `updated_at`.

### Órdenes

#### `OrderItemCreate`
- `design_id`: UUID (opcional)
- `product_id`: String (opcional)
- `quantity`: Integer
- `price`: Float

#### `OrderCreate`
- `items`: List[OrderItemCreate]
- `total_amount`: Float
- `shipping_address`: JSON
- `payment_method`: String ("mercadopago" | "cash")

#### `OrderResponse`
- Incluye `id`, `user_id`, `status`, `checkout_url`, `created_at` y la lista de `items`.
