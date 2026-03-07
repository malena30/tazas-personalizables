from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime


# --- ADDRESS ---

class Address(BaseModel):
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    name: Optional[str] = None
    phone: Optional[str] = None


# --- AUTH SCHEMAS ---

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    is_admin: bool
    phone: Optional[str] = None
    addresses: Optional[List[Any]] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class PasswordResetRequest(BaseModel):
    email: str

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

class UserProfileUpdate(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    addresses: Optional[List[Address]] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None

class UserStats(BaseModel):
    total_spent: float
    total_orders: int
    paid_orders: int
    pending_orders: int
    failed_orders: int
    total_designs: int


# --- DESIGN SCHEMAS ---

class DesignCreate(BaseModel):
    name: str
    mug_color: str
    elements: Any
    thumbnail: Optional[str] = None

class DesignUpdate(BaseModel):
    name: Optional[str] = None
    mug_color: Optional[str] = None
    elements: Optional[Any] = None
    thumbnail: Optional[str] = None
    is_favorite: Optional[bool] = None

class DesignResponse(BaseModel):
    id: str
    name: str
    mug_color: str
    elements: Any
    thumbnail: Optional[str] = None
    is_favorite: bool = False
    user_id: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- ORDER SCHEMAS ---

class OrderItemCreate(BaseModel):
    design_id: Optional[str] = None
    product_id: Optional[str] = None
    quantity: int
    price: float

class OrderItemResponse(BaseModel):
    id: str
    design_id: Optional[str] = None
    product_id: Optional[str] = None
    quantity: int
    price: float
    design: Optional[DesignResponse] = None

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    total_amount: float
    shipping_address: Any
    payment_method: str
    items: List[OrderItemCreate]

class OrderResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    total_amount: float
    status: str
    shipping_address: Any
    payment_method: str
    checkout_url: Optional[str] = None
    created_at: Optional[datetime] = None
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: str


# --- ADMIN SCHEMAS ---

class AdminStats(BaseModel):
    total_sales: float
    total_orders: int
    pending_orders: int
    paid_orders: int
    failed_orders: int
    total_users: int
    total_designs: int

class AdminUserResponse(BaseModel):
    id: str
    username: str
    email: str
    is_admin: bool
    created_at: Optional[datetime] = None
    order_count: int = 0
    design_count: int = 0

    class Config:
        from_attributes = True

class AdminOrderResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    total_amount: float
    status: str
    shipping_address: Any
    payment_method: str
    checkout_url: Optional[str] = None
    created_at: Optional[datetime] = None
    items: List[OrderItemResponse] = []
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True


# --- PRODUCT SCHEMAS ---

class ProductCreate(BaseModel):
    name: str
    slug: Optional[str] = None
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    gallery_urls: Optional[List[str]] = []
    material: Optional[str] = None
    capacity: Optional[str] = None
    care_instructions: Optional[str] = None
    finish: Optional[str] = None
    stock: Optional[int] = 0
    image_fit: Optional[str] = "contain"
    image_scale: Optional[float] = 1.0
    category: Optional[str] = "frases"
    is_active: Optional[bool] = True

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    gallery_urls: Optional[List[str]] = None
    material: Optional[str] = None
    capacity: Optional[str] = None
    care_instructions: Optional[str] = None
    finish: Optional[str] = None
    stock: Optional[int] = None
    image_fit: Optional[str] = None
    image_scale: Optional[float] = None
    category: Optional[str] = None
    is_active: Optional[bool] = None

class ProductResponse(BaseModel):
    id: str
    name: str
    slug: Optional[str] = None
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    gallery_urls: Optional[List[str]] = []
    material: Optional[str] = None
    capacity: Optional[str] = None
    care_instructions: Optional[str] = None
    finish: Optional[str] = None
    stock: Optional[int] = 0
    image_fit: Optional[str] = "contain"
    image_scale: Optional[float] = 1.0
    category: Optional[str] = None
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
