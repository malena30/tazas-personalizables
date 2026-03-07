from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db, User
from auth import get_current_user


async def get_admin_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Dependency que verifica que el usuario autenticado sea administrador.
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso denegado: se requieren permisos de administrador"
        )
    return current_user
