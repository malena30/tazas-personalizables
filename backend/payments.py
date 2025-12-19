import mercadopago
import os

# En producción, esto debería estar en una variable de entorno
# Por ahora usamos un token de prueba (Sandbox)
# NOTA: Este es un token de prueba genérico para desarrollo
MP_ACCESS_TOKEN = os.getenv("MP_ACCESS_TOKEN", "APP_USR-6317423111705644-042414-47f8b97a34015183f3a9f85319a0e10d-415944059")

sdk = mercadopago.SDK(MP_ACCESS_TOKEN)

def create_preference(order, items):
    """
    Crea una preferencia de pago en Mercado Pago para una orden.
    """
    # Preparar los items para Mercado Pago
    mp_items = []
    for item in items:
        # Si es un diseño personalizado, usamos su nombre, si no, un genérico
        title = "Taza Personalizada"
        if item.design:
            title = f"Taza: {item.design.name}"
        
        mp_items.append({
            "id": str(item.id),
            "title": title,
            "quantity": int(item.quantity),
            "unit_price": float(item.price),
            "currency_id": "ARS"
        })

    # Configurar la preferencia
    preference_data = {
        "items": mp_items,
        "back_urls": {
            "success": "http://localhost:3000/checkout/success",
            "failure": "http://localhost:3000/checkout/failure",
            "pending": "http://localhost:3000/checkout/success"
        },
        "auto_return": "approved",
        "external_reference": str(order.id),
        "notification_url": "https://your-webhook-url.com/api/payments/webhook", # Necesitarás ngrok para probar esto localmente
    }

    preference_response = sdk.preference().create(preference_data)
    preference = preference_response["response"]
    
    return preference.get("init_point") # URL para el checkout de Mercado Pago

def get_payment_info(payment_id):
    """
    Obtiene los detalles de un pago desde Mercado Pago.
    """
    payment_response = sdk.payment().get(payment_id)
    payment = payment_response["response"]
    
    return {
        "status": payment.get("status"),
        "external_reference": payment.get("external_reference"),
        "status_detail": payment.get("status_detail")
    }
