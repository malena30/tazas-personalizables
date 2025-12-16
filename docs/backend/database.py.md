# database.py

## Propósito

Archivo destinado a contener la configuración de la base de datos para la aplicación backend. Actualmente está vacío y pendiente de implementación.

## Estado Actual

⚠️ **Archivo vacío - Pendiente de implementación**

Este archivo está preparado para albergar:
- Configuración de conexión a base de datos
- Definición de modelos de datos (SQLAlchemy/SQLModel)
- Schemas y validaciones
- Sesiones y contextos de base de datos

## Implementación Esperada

### Dependencias Típicas
```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
```

### Estructura Recomendada

1. **URL de Conexión**: Configuración de la cadena de conexión a PostgreSQL/MySQL/SQLite
2. **Engine**: Motor de SQLAlchemy
3. **SessionLocal**: Factory para crear sesiones de base de datos
4. **Base**: Clase base declarativa para modelos ORM
5. **get_db()**: Función generadora para dependency injection en FastAPI

### Ejemplo de Implementación

```python
# Conexión a base de datos
SQLALCHEMY_DATABASE_URL = "sqlite:///./tazas.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}  # Solo para SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency para obtener sesión de DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## Modelos Implementados

### User
Tabla: `users`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | String (UUID) | Identificador único (PK) |
| `username` | String | Nombre de usuario único |
| `email` | String | Correo electrónico único |
| `hashed_password` | String | Contraseña hasheada (bcrypt) |
| `created_at` | DateTime | Fecha de creación |

**Relaciones**:
- `designs`: One-to-Many con `Design`

### Design
Tabla: `designs`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | String (UUID) | Identificador único (PK) |
| `user_id` | String (FK) | ID del usuario propietario |
| `name` | String | Nombre del diseño |
| `mug_color` | String | Color base de la taza (hex) |
| `elements` | JSON | Array de elementos del diseño (imágenes, texto) |
| `thumbnail` | String | URL o Base64 de la vista previa |
| `created_at` | DateTime | Fecha de creación |
| `updated_at` | DateTime | Fecha de última actualización |

**Relaciones**:
- `owner`: Many-to-One con `User`

## Consideraciones de Seguridad

- [ ] Usar variables de entorno para credenciales de base de datos
- [ ] Implementar migraciones con Alembic
- [ ] Configurar pools de conexiones apropiados
- [ ] Validar entrada de datos antes de persistir

## Referencias

- [FastAPI - SQL Databases](https://fastapi.tiangolo.com/tutorial/sql-databases/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)

## Archivos Relacionados

- [main.py](file:///c:/Users/Malena%20Cort%C3%A9s/OneDrive/Desktop/tazas-personalizables/backend/main.py) - Aplicación FastAPI principal
