# api.ts

## Propósito

Cliente HTTP centralizado para comunicarse con el backend FastAPI.

## Configuración

- `API_URL`: Lee de `NEXT_PUBLIC_API_URL` o usa `http://localhost:8000` por defecto.

## Funciones

### Autenticación
- `registerUser(data)`: POST /auth/register
- `loginUser(data)`: POST /auth/login
- `getCurrentUser(token)`: GET /auth/me

### Diseños (CRUD)
Todas las funciones de diseño inyectan automáticamente el header `Authorization`.

- `saveDesign(data)`: POST /api/designs
- `listDesigns(page, limit)`: GET /api/designs
- `loadDesign(id)`: GET /api/designs/{id}
- `updateDesign(id, data)`: PUT /api/designs/{id}
- `deleteDesign(id)`: DELETE /api/designs/{id}

## Tipos Exportados
- `Design`, `DesignCreate`, `DesignUpdate`
- `User`, `UserRegister`, `UserLogin`, `AuthResponse`
