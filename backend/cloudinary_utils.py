import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

# Configuración de Cloudinary
# Se puede configurar vía CLOUDINARY_URL en el .env
# Ejemplo: CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
cloudinary.config(
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key = os.getenv("CLOUDINARY_API_KEY"),
    api_secret = os.getenv("CLOUDINARY_API_SECRET"),
    secure = True
)

def upload_base64_image(base64_string, folder="tazas_designs"):
    """
    Sube una imagen en formato Base64 a Cloudinary y retorna la URL segura.
    """
    if not base64_string or not base64_string.startswith("data:image"):
        return base64_string # Si no es base64, lo devolvemos tal cual (podría ser ya una URL)

    try:
        upload_result = cloudinary.uploader.upload(
            base64_string,
            folder = folder,
            resource_type = "image"
        )
        return upload_result.get("secure_url")
    except Exception:
        # En caso de error, devolvemos el base64 original para no romper la funcionalidad
        # aunque la DB crezca, el sistema sigue funcionando.
        return base64_string
