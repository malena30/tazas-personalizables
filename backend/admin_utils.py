from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal
from auth import get_current_user
from database import User

# Dependency para obtener la sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dependency para verificar que el usuario es administrador
async def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Verifica que el usuario actual tenga privilegios de administrador.
    Retorna el usuario si es admin, caso contrario lanza HTTPException 403.
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos de administrador para acceder a este recurso"
        )
    return current_user
