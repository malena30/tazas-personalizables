# main.py

## Propósito

Archivo principal de la aplicación backend construida con FastAPI. Contiene la inicialización de la aplicación y los endpoints de la API REST.

## Contenido

### Importaciones

```python
from fastapi import FastAPI
```

- **FastAPI**: Framework web moderno y de alto rendimiento para construir APIs con Python 3.7+

### Instancia de la Aplicación

```python
app = FastAPI()
```

Crea la instancia principal de la aplicación FastAPI. Esta instancia será utilizada por el servidor ASGI (Uvicorn) para servir la aplicación.

## Endpoints

### GET `/` - Root Endpoint

**Función**: `root()`

**Tipo**: Endpoint asíncrono

**Descripción**: Endpoint de prueba que verifica que el backend está funcionando correctamente.

**Parámetros**: Ninguno

**Retorno**: 
```python
{'message': 'Backend iniciado correctamente 🚀'}
```

**Uso**:
```bash
curl http://localhost:8000/
```

**Respuesta Esperada**:
```json
{
  "message": "Backend iniciado correctamente 🚀"
}
```

## Ejecución

### Desarrollo

```bash
uvicorn main:app --reload
```

- `main`: nombre del archivo Python
- `app`: nombre de la instancia FastAPI
- `--reload`: habilita auto-reload en cambios de código

### Producción

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Estado Actual

Este backend está en su fase inicial con:
- ✅ Configuración básica de FastAPI
- ✅ Endpoint de health check
- ⚠️ Sin endpoints de negocio implementados
- ⚠️ Sin configuración de CORS
- ⚠️ Sin middleware de autenticación
- ⚠️ Sin integración con base de datos

## Endpoints Pendientes

Para una aplicación completa de tazas personalizables, se necesitarían endpoints como:

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/{id}` - Detalle de producto
- `POST /api/products` - Crear producto (admin)

### Órdenes
- `POST /api/orders` - Crear orden
- `GET /api/orders/{id}` - Detalle de orden
- `GET /api/orders` - Listar órdenes (admin)

### Diseños Personalizados
- `POST /api/designs/upload` - Subir imagen de diseño
- `GET /api/designs/{id}` - Obtener diseño

### Envío
- `POST /api/shipping/calculate` - Calcular costo de envío
- `GET /api/shipping/options` - Opciones de envío disponibles

## Configuraciones Necesarias

### CORS (Cross-Origin Resource Sharing)

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Variables de Entorno

Crear archivo `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost/tazas_db
CLOUDINARY_URL=cloudinary://...
SECRET_KEY=your-secret-key
MERCADO_PAGO_TOKEN=your-mp-token
```

### Documentación Automática

FastAPI genera documentación automática en:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Patrones de Diseño

### Router Pattern (Recomendado)

Para escalar la aplicación, se recomienda dividir endpoints en routers:

```python
from fastapi import APIRouter

# routers/products.py
router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("/")
async def list_products():
    pass

# main.py
from routers import products
app.include_router(products.router)
```

### Dependency Injection

FastAPI permite inyectar dependencias como sesiones de DB:

```python
from database import get_db
from sqlalchemy.orm import Session

@app.get("/products")
async def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()
```

## Consideraciones de Seguridad

- [ ] Implementar autenticación JWT para endpoints protegidos
- [ ] Validar datos de entrada con Pydantic models
- [ ] Configurar rate limiting
- [ ] Implementar logging de requests
- [ ] Sanitizar uploads de archivos

## Archivos Relacionados

- [database.py](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/backend/database.py) - Configuración de base de datos

## Enlaces Útiles

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Uvicorn Server](https://www.uvicorn.org/)
- [Pydantic Models](https://docs.pydantic.dev/)
