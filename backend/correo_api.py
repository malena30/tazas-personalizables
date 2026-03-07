"""
Módulo de integración con la API MiCorreo de Correo Argentino.
Documentación: https://api.correoargentino.com.ar/micorreo/v1

Para activar la integración real, configurar en .env:
  CORREO_USER=tu_usuario
  CORREO_PASSWORD=tu_contraseña
  CORREO_ORIGIN_POSTAL_CODE=tu_cp_de_origen

Sin credenciales, el módulo devuelve precios estimados como fallback.
"""

import os
import httpx
from datetime import datetime, timedelta

BASE_URL = os.getenv("CORREO_BASE_URL", "https://api.correoargentino.com.ar/micorreo/v1")
CORREO_USER = os.getenv("CORREO_USER", "")
CORREO_PASSWORD = os.getenv("CORREO_PASSWORD", "")
ORIGIN_CP = os.getenv("CORREO_ORIGIN_POSTAL_CODE", "1000")

# Cache simple del token (evita pedir un token nuevo en cada cotización)
_token_cache: dict = {"token": None, "expires": None}


def _has_credentials() -> bool:
    return bool(CORREO_USER and CORREO_PASSWORD)


async def _get_token() -> str | None:
    """Obtiene un JWT token de MiCorreo via HTTP Basic Auth y lo cachea."""
    if not _has_credentials():
        return None

    # Reusar token si todavía no venció
    if _token_cache["token"] and _token_cache["expires"]:
        if datetime.utcnow() < _token_cache["expires"]:
            return _token_cache["token"]

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(
                f"{BASE_URL}/token",
                auth=(CORREO_USER, CORREO_PASSWORD),
            )
            if response.status_code == 200:
                data = response.json()
                token = data.get("token")
                # Guardar con 2 horas de vigencia (el token de MiCorreo dura ~2.5h)
                _token_cache["token"] = token
                _token_cache["expires"] = datetime.utcnow() + timedelta(hours=2)
                return token
    except Exception as e:
        print(f"[correo_api] Error al obtener token: {e}")

    return None


async def get_shipping_rate(
    dest_postal_code: str,
    weight_kg: float = 0.5,
    length_cm: float = 20,
    width_cm: float = 15,
    height_cm: float = 12,
) -> dict:
    """
    Cotiza un envío estándar desde el CP de origen al CP de destino.

    Retorna:
        {
            "success": bool,
            "mode": "api" | "fallback",
            "estandar": float,   # precio en ARS
            "prioritario": float # precio en ARS (estimado)
        }
    """

    # --- MODO REAL: con credenciales ---
    if _has_credentials():
        token = await _get_token()
        if token:
            try:
                payload = {
                    "productType": "CP",
                    "deliveryType": "D",
                    "origin": {
                        "postalCode": ORIGIN_CP,
                    },
                    "destination": {
                        "postalCode": dest_postal_code,
                    },
                    "package": {
                        "weight": weight_kg,
                        "length": length_cm,
                        "width": width_cm,
                        "height": height_cm,
                    },
                }
                async with httpx.AsyncClient(timeout=10) as client:
                    response = await client.post(
                        f"{BASE_URL}/rates",
                        json=payload,
                        headers={"Authorization": f"Bearer {token}"},
                    )
                    if response.status_code == 200:
                        data = response.json()
                        # La API devuelve una lista de opciones/servicios
                        price = float(data.get("totalPrice", data.get("price", 0)))
                        return {
                            "success": True,
                            "mode": "api",
                            "estandar": price,
                            "prioritario": round(price * 1.4, 2),  # Prioritario ~40% más
                        }
            except Exception as e:
                print(f"[correo_api] Error al cotizar: {e}")

    # --- MODO FALLBACK: precios estimados por zona ---
    cp = dest_postal_code.strip()
    zona = _get_zone(cp)
    prices = _ZONE_PRICES.get(zona, _ZONE_PRICES["resto"])
    return {
        "success": True,
        "mode": "fallback",
        "estandar": prices["estandar"],
        "prioritario": prices["prioritario"],
    }


def _get_zone(cp: str) -> str:
    """
    Estimación de zona por prefijo de código postal (GBA/CABA/Interior)
    """
    try:
        cp_num = int(cp[:4])
    except (ValueError, IndexError):
        return "resto"

    if 1000 <= cp_num <= 1499:
        return "caba"
    elif 1600 <= cp_num <= 1999:
        return "gba"
    elif 2000 <= cp_num <= 2999:
        return "litoral"
    elif 3000 <= cp_num <= 3999:
        return "litoral"
    elif 4000 <= cp_num <= 4999:
        return "noa"
    elif 5000 <= cp_num <= 5999:
        return "cuyo"
    elif 6000 <= cp_num <= 6999:
        return "buenos_aires"
    elif 7000 <= cp_num <= 7999:
        return "buenos_aires"
    elif 8000 <= cp_num <= 8999:
        return "patagonia"
    elif 9000 <= cp_num <= 9499:
        return "patagonia"
    elif cp_num >= 9400:
        return "tierra_del_fuego"
    return "resto"


# Precios estimados por zona (actualizados a 2025, en ARS)
_ZONE_PRICES = {
    "caba":           {"estandar": 4_500,  "prioritario": 6_300},
    "gba":            {"estandar": 5_500,  "prioritario": 7_700},
    "buenos_aires":   {"estandar": 7_000,  "prioritario": 9_800},
    "litoral":        {"estandar": 8_500,  "prioritario": 11_900},
    "cuyo":           {"estandar": 9_500,  "prioritario": 13_300},
    "noa":            {"estandar": 10_000, "prioritario": 14_000},
    "patagonia":      {"estandar": 12_000, "prioritario": 16_800},
    "tierra_del_fuego": {"estandar": 16_000, "prioritario": 22_400},
    "resto":          {"estandar": 8_000,  "prioritario": 11_200},
}
