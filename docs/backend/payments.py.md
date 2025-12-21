# payments.py

## Propósito

Encapsula la lógica de integración con el SDK de Mercado Pago para la creación de preferencias de pago y consulta de estados.

## Funciones

### `create_preference(order, items)`
Genera una preferencia de pago en Mercado Pago.

- **Parámetros**:
  - `order`: Objeto `Order` de la base de datos.
  - `items`: Lista de objetos `OrderItem`.
- **Lógica**:
  - Mapea los items de la orden al formato de Mercado Pago.
  - Configura `back_urls` (success, failure, pending).
  - Configura `notification_url` para recibir webhooks.
  - Establece `external_reference` con el ID de la orden.
- **Retorno**: `init_point` (URL de checkout).

### `get_payment_info(payment_id)`
Consulta los detalles de un pago específico.

- **Parámetros**:
  - `payment_id`: ID del pago enviado por el webhook.
- **Retorno**: Diccionario con `status`, `external_reference` y `status_detail`.

## Configuración
Requiere la variable de entorno `MP_ACCESS_TOKEN`.
