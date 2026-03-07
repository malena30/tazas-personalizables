import os
import mercadopago

MP_ACCESS_TOKEN = os.getenv("MP_ACCESS_TOKEN", "")


def _get_sdk():
    return mercadopago.SDK(MP_ACCESS_TOKEN)


def create_preference(order, order_items) -> str:
    """
    Crea una preferencia de pago en Mercado Pago y devuelve la URL de checkout.
    """
    sdk = _get_sdk()

    items = []
    for item in order_items:
        items.append({
            "title": f"Diseño personalizado" if item.design_id else "Producto",
            "quantity": item.quantity,
            "unit_price": float(item.price),
            "currency_id": "ARS",
        })

    # Si no hay items, agregar uno genérico
    if not items:
        items = [{
            "title": "Pedido tazas personalizadas",
            "quantity": 1,
            "unit_price": float(order.total_amount),
            "currency_id": "ARS",
        }]

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

    preference_data = {
        "items": items,
        "external_reference": str(order.id),
        "back_urls": {
            "success": f"{frontend_url}/orders?status=success",
            "failure": f"{frontend_url}/orders?status=failure",
            "pending": f"{frontend_url}/orders?status=pending",
        },
        "auto_return": "approved",
        "notification_url": os.getenv("MP_WEBHOOK_URL", ""),
    }

    preference_response = sdk.preference().create(preference_data)
    preference = preference_response.get("response", {})

    # Usar sandbox en dev, producción en prod
    if os.getenv("ENV") == "production":
        checkout_url = preference.get("init_point", "")
    else:
        checkout_url = preference.get("sandbox_init_point", preference.get("init_point", ""))

    return checkout_url


def get_payment_info(payment_id: str) -> dict:
    """
    Obtiene información de un pago por su ID.
    """
    sdk = _get_sdk()
    payment_response = sdk.payment().get(payment_id)
    return payment_response.get("response", {})
