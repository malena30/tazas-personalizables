from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime

# Schema para crear un diseño
class DesignCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    mug_color: str = Field(..., pattern=r'^#[0-9A-Fa-f]{6}$')
    elements: List[Any]  # Array de CanvasElement
    thumbnail: Optional[str] = None

# Schema para actualizar un diseño
class DesignUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    mug_color: Optional[str] = Field(None, pattern=r'^#[0-9A-Fa-f]{6}$')
    elements: Optional[List[Any]] = None
    thumbnail: Optional[str] = None

# Schema para respuesta de diseño
class DesignResponse(BaseModel):
    id: str
    user_id: Optional[str]
    name: str
    mug_color: str
    elements: List[Any]
    thumbnail: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Para compatibilidad con SQLAlchemy
