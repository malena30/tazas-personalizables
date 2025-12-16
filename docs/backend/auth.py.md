# auth.py

## Propósito

Maneja la lógica de seguridad y autenticación del backend, incluyendo hashing de contraseñas y generación/validación de tokens JWT.

## Funciones Principales

### Hashing
- `get_password_hash(password)`: Genera un hash seguro de la contraseña usando bcrypt.
- `verify_password(plain_password, hashed_password)`: Verifica si una contraseña coincide con su hash.

### JWT (JSON Web Tokens)
- `create_access_token(data, expires_delta)`: Crea un token JWT firmado con los datos del usuario y fecha de expiración.
- **Configuración**:
  - `ALGORITHM`: HS256
  - `ACCESS_TOKEN_EXPIRE_MINUTES`: 10080 (7 días)

### Dependencias FastAPI
- `get_current_user(token, db)`: Dependency para proteger endpoints.
  1. Extrae el token del header `Authorization`.
  2. Decodifica y valida el token.
  3. Busca el usuario en la base de datos.
  4. Retorna el usuario o lanza `HTTPException` (401).

## Dependencias Externas
- `passlib[bcrypt]`: Para hashing de contraseñas.
- `python-jose[cryptography]`: Para manejo de JWT.
