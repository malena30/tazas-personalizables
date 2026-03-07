# cloudinary_utils.py

## Propósito

Provee utilidades para la gestión de imágenes en la nube utilizando Cloudinary.

## Funciones

### `upload_base64_image(base64_string, folder="tazas_designs")`
Sube una imagen en formato Base64 a Cloudinary.

- **Parámetros**:
  - `base64_string`: El string de la imagen (data:image/...).
  - `folder`: Carpeta de destino en Cloudinary.
- **Lógica**:
  - Valida si el string es efectivamente un Base64 de imagen.
  - Utiliza `cloudinary.uploader.upload`.
  - Retorna la URL segura (`secure_url`).
- **Manejo de Errores**: Si falla, retorna el Base64 original para evitar pérdida de datos, aunque se pierda la optimización de espacio.

## Configuración
Requiere las variables de entorno:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
