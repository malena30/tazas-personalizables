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

# Schema para registro de usuario
class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$') # Regex simple para email
    password: str = Field(..., min_length=6)

# Schema para login
class UserLogin(BaseModel):
    username: str
    password: str

# Schema para respuesta de usuario
class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    is_admin: bool = False
    created_at: datetime

    class Config:
        from_attributes = True

# Schema para Token
class Token(BaseModel):
    access_token: str
    token_type: str

# --- Order Schemas ---

class OrderItemCreate(BaseModel):
    design_id: Optional[str] = None
    product_id: Optional[str] = None
    quantity: int
    price: float

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    shipping_address: Any # JSON con datos del comprador
    payment_method: str
    total_amount: float

class OrderItemResponse(BaseModel):
    id: str
    design_id: Optional[str]
    product_id: Optional[str]
    quantity: int
    price: float
    design: Optional[DesignResponse] = None

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: str
    user_id: Optional[str]
    total_amount: float
    status: str
    shipping_address: Any
    payment_method: str
    checkout_url: Optional[str] = None
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True

# --- Admin Schemas ---

class AdminStats(BaseModel):
    """Estadísticas generales para el panel de admin"""
    total_sales: float
    total_orders: int
    pending_orders: int
    paid_orders: int
    failed_orders: int
    total_users: int
    total_designs: int

class OrderStatusUpdate(BaseModel):
    """Schema para actualizar el estado de una orden"""
    status: str = Field(..., pattern=r'^(pending|paid|failed)$')

class AdminUserResponse(BaseModel):
    """Usuario con estadísticas adicionales para admin"""
    id: str
    username: str
    email: str
    is_admin: bool
    created_at: datetime
    order_count: int = 0
    design_count: int = 0

    class Config:
        from_attributes = True

class AdminOrderResponse(BaseModel):
    """Orden con información del usuario para admin"""
    id: str
    user_id: Optional[str]
    user: Optional[UserResponse] = None
    total_amount: float
    status: str
    shipping_address: Any
    payment_method: str
    checkout_url: Optional[str] = None
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True
