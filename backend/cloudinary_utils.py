import os
import cloudinary
import cloudinary.uploader
import base64

# Configurar Cloudinary con variables de entorno
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME", ""),
    api_key=os.getenv("CLOUDINARY_API_KEY", ""),
    api_secret=os.getenv("CLOUDINARY_API_SECRET", ""),
    secure=True
)


def upload_base64_image(base64_data: str, folder: str = "tazas_designs") -> str:
    """
    Sube una imagen en base64 a Cloudinary y devuelve la URL.
    Acepta el formato: data:image/png;base64,XXXX
    """
    try:
        result = cloudinary.uploader.upload(
            base64_data,
            folder=folder,
            resource_type="image"
        )
        return result.get("secure_url", "")
    except Exception as e:
        print(f"Error al subir imagen a Cloudinary: {e}")
        raise
