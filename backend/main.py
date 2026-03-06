import os
from dotenv import load_dotenv
load_dotenv()

import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from fastapi import FastAPI, Depends, HTTPException, status, Request, Response
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List, Optional
from datetime import timedelta, datetime
import uuid
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from database import get_db, Design, User, Order, OrderItem, Product, UserFavorite
from schemas import (
    DesignCreate, DesignUpdate, DesignResponse, 
    UserRegister, UserLogin, UserResponse, Token,
    PasswordResetRequest, PasswordResetConfirm,
    OrderCreate, OrderResponse,
    AdminStats, AdminUserResponse, AdminOrderResponse, OrderStatusUpdate,
    UserProfileUpdate, UserStats, Address,
    ProductCreate, ProductUpdate, ProductResponse
)
from auth import (
    get_password_hash, verify_password, create_access_token, 
    get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
)
from admin_utils import get_admin_user
from payments import create_preference, get_payment_info
from cloudinary_utils import upload_base64_image
from email_utils import (
    send_email, 
    get_welcome_template, 
    get_order_confirmation_template, 
    get_payment_success_template,
    get_password_reset_template
)
from correo_api import get_shipping_rate

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Inicializar Sentry
SENTRY_DSN = os.getenv("SENTRY_DSN")
if SENTRY_DSN:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        integrations=[
            FastApiIntegration(),
            SqlalchemyIntegration(),
        ],
        # Set traces_sample_rate to 1.0 to capture 100%
        # of transactions for performance monitoring.
        traces_sample_rate=1.0,
        # Set profiles_sample_rate to 1.0 to profile 100%
        # of transactions.
        profiles_sample_rate=1.0,
    )

# Configurar Rate Limiting
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Tazas Personalizables API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Middleware para Forzar HTTPS (solo si no es localhost)
@app.middleware("http")
async def force_https_middleware(request: Request, call_next):
    if os.getenv("ENV") == "production" and request.url.scheme == "http":
        url = request.url.replace(scheme="https")
        return RedirectResponse(url, status_code=301)
    return await call_next(request)

# Middleware para Headers de Seguridad (Solo en Producción)
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    if os.getenv("ENV") == "production":
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline';"
    return response

# Configurar CORS para permitir requests desde el frontend
_default_origins = "http://localhost:3000,http://127.0.0.1:3000,https://kyathos-shops.vercel.app"
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", _default_origins).split(",")
# Limpiar espacios por si acaso
ALLOWED_ORIGINS = [o.strip() for o in ALLOWED_ORIGINS if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.api_route('/', methods=["GET", "HEAD"])
async def root():
    return {'message': 'Backend iniciado correctamente 🚀'}

@app.get("/api/debug-sentry")
async def trigger_error():
    division_by_zero = 1 / 0
    return division_by_zero

# --- AUTH ENDPOINTS ---

@app.post("/auth/register", response_model=UserResponse, status_code=201)
@limiter.limit("5/minute")
async def register(request: Request, user: UserRegister, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    db_email = db.query(User).filter(User.email == user.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Enviar email de bienvenida
    try:
        send_email(
            new_user.email, 
            "¡Bienvenido a Tazas.shop!", 
            get_welcome_template(new_user.username)
        )
    except Exception:
        pass
        
    return new_user

from sqlalchemy import or_

@app.post("/auth/login", response_model=Token)
@limiter.limit("10/minute")
async def login(request: Request, user_credentials: UserLogin, db: Session = Depends(get_db)):
    # Buscar por username o por email
    user = db.query(User).filter(
        or_(User.username == user_credentials.username, User.email == user_credentials.username)
    ).first()
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/forgot-password")
@limiter.limit("5/minute")
async def forgot_password(request: Request, data: PasswordResetRequest, db: Session = Depends(get_db)):
    """
    Solicitar recuperación de contraseña.
    Genera un token temporal y envía un email con el link de reset.
    """
    print(f"\n🔑 Solicitud de recuperación de contraseña para: {data.email}")
    user = db.query(User).filter(User.email == data.email).first()
    
    # Siempre responder con éxito para no revelar si el email existe
    if not user:
        print(f"   ⚠️ No se encontró usuario con email: {data.email}")
        return {"message": "Si el email existe, recibirás un enlace de recuperación."}
    
    print(f"   ✅ Usuario encontrado: {user.username}")
    
    # Generar token único
    reset_token = str(uuid.uuid4())
    user.reset_token = reset_token
    user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
    db.commit()
    
    # Enviar email
    reset_url = f"{FRONTEND_URL}/reset-password?token={reset_token}"
    print(f"   🔗 URL de reset: {reset_url}")
    try:
        send_email(
            user.email,
            "Recuperar Contraseña - KYATHOS tazas",
            get_password_reset_template(reset_url)
        )
    except Exception:
        pass
    
    return {"message": "Si el email existe, recibirás un enlace de recuperación."}

@app.post("/auth/reset-password")
@limiter.limit("5/minute")
async def reset_password(request: Request, data: PasswordResetConfirm, db: Session = Depends(get_db)):
    """
    Restablecer contraseña usando el token recibido por email.
    """
    user = db.query(User).filter(
        User.reset_token == data.token,
        User.reset_token_expires > datetime.utcnow()
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=400,
            detail="El enlace de recuperación es inválido o ha expirado."
        )
    
    # Actualizar contraseña
    user.hashed_password = get_password_hash(data.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()
    
    return {"message": "Contraseña actualizada correctamente. Ya podés iniciar sesión."}

@app.get("/auth/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.patch("/auth/profile", response_model=UserResponse)
async def update_profile(
    profile_data: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Actualizar perfil del usuario.
    Puede actualizar email, teléfono, direcciones y contraseña.
    """
    # Si cambia email, verificar que no exista otro usuario con ese email
    if profile_data.email and profile_data.email != current_user.email:
        existing_user = db.query(User).filter(User.email == profile_data.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="El email ya está en uso")
        current_user.email = profile_data.email
    
    # Actualizar teléfono
    if profile_data.phone is not None:
        current_user.phone = profile_data.phone
    
    # Actualizar direcciones (convertir objetos Address a dict)
    if profile_data.addresses is not None:
        current_user.addresses = [addr.model_dump() for addr in profile_data.addresses]
    
    # Cambiar contraseña si se proporciona
    if profile_data.new_password:
        if not profile_data.current_password:
            raise HTTPException(status_code=400, detail="Debes proporcionar tu contraseña actual")
        
        if not verify_password(profile_data.current_password, current_user.hashed_password):
            raise HTTPException(status_code=400, detail="Contraseña actual incorrecta")
        
        current_user.hashed_password = get_password_hash(profile_data.new_password)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@app.get("/auth/profile/stats", response_model=UserStats)
async def get_user_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtener estadísticas del usuario para su perfil.
    """
    # Total gastado (sum de órdenes pagadas)
    total_spent = db.query(func.sum(Order.total_amount)).filter(
        Order.user_id == current_user.id,
        Order.status == "paid"
    ).scalar() or 0.0
    
    # Contadores de órdenes por estado
    total_orders = db.query(Order).filter(Order.user_id == current_user.id).count()
    paid_orders = db.query(Order).filter(Order.user_id == current_user.id, Order.status == "paid").count()
    pending_orders = db.query(Order).filter(Order.user_id == current_user.id, Order.status == "pending").count()
    failed_orders = db.query(Order).filter(Order.user_id == current_user.id, Order.status == "failed").count()
    
    # Total de diseños
    total_designs = db.query(Design).filter(Design.user_id == current_user.id).count()
    
    return UserStats(
        total_spent=total_spent,
        total_orders=total_orders,
        paid_orders=paid_orders,
        pending_orders=pending_orders,
        failed_orders=failed_orders,
        total_designs=total_designs
    )

# --- DESIGN ENDPOINTS (PROTECTED) ---

@app.post('/api/designs', response_model=DesignResponse, status_code=201)
async def create_design(
    design: DesignCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Subir thumbnail a Cloudinary si existe
    thumbnail_url = design.thumbnail
    if design.thumbnail and design.thumbnail.startswith("data:image"):
        thumbnail_url = upload_base64_image(design.thumbnail)

    db_design = Design(
        name=design.name,
        mug_color=design.mug_color,
        elements=design.elements,
        thumbnail=thumbnail_url,
        user_id=current_user.id
    )
    db.add(db_design)
    db.commit()
    db.refresh(db_design)
    return db_design

@app.get('/api/designs', response_model=List[DesignResponse])
async def list_designs(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    designs = db.query(Design).filter(Design.user_id == current_user.id).order_by(Design.updated_at.desc()).offset(skip).limit(limit).all()
    return designs

@app.get('/api/designs/{design_id}', response_model=DesignResponse)
async def get_design(
    design_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    design = db.query(Design).filter(Design.id == design_id, Design.user_id == current_user.id).first()
    if not design:
        raise HTTPException(status_code=404, detail="Diseño no encontrado")
    return design

@app.put('/api/designs/{design_id}', response_model=DesignResponse)
async def update_design(
    design_id: str,
    design_update: DesignUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_design = db.query(Design).filter(Design.id == design_id, Design.user_id == current_user.id).first()
    if not db_design:
        raise HTTPException(status_code=404, detail="Diseño no encontrado")
    
    # Subir nuevo thumbnail a Cloudinary si cambió y es base64
    thumbnail_url = db_design.thumbnail
    if design_update.thumbnail and design_update.thumbnail.startswith("data:image"):
        thumbnail_url = upload_base64_image(design_update.thumbnail)

    # Actualizar solo los campos proporcionados
    update_data = design_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field == "thumbnail":
            setattr(db_design, field, thumbnail_url)
        else:
            setattr(db_design, field, value)
    
    db.commit()
    db.refresh(db_design)
    return db_design

@app.delete('/api/designs/{design_id}', status_code=204)
async def delete_design(
    design_id: str, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_design = db.query(Design).filter(Design.id == design_id, Design.user_id == current_user.id).first()
    if not db_design:
        raise HTTPException(status_code=404, detail="Diseño no encontrado")
    
    db.delete(db_design)
    db.commit()
    return None

@app.patch('/api/designs/{design_id}/favorite', response_model=DesignResponse)
async def toggle_favorite(
    design_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Toggle favorite status for a design."""
    design = db.query(Design).filter(Design.id == design_id, Design.user_id == current_user.id).first()
    if not design:
        raise HTTPException(status_code=404, detail="Diseño no encontrado")
    
    design.is_favorite = not design.is_favorite
    db.commit()
    db.refresh(design)
    return design

# --- ORDER ENDPOINTS ---

@app.post('/api/orders', response_model=OrderResponse, status_code=201)
async def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Crear la orden
    db_order = Order(
        user_id=current_user.id,
        total_amount=order.total_amount,
        shipping_address=order.shipping_address,
        payment_method=order.payment_method
    )
    db.add(db_order)
    db.flush() # Para obtener el ID de la orden

    # Crear los items y prepararlos para MP
    order_items = []
    for item in order.items:
        db_item = OrderItem(
            order_id=db_order.id,
            design_id=item.design_id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price
        )
        db.add(db_item)
        order_items.append(db_item)
    
    # Generar link de Mercado Pago si el método es Mercado Pago
    if order.payment_method == "mercadopago":
        try:
            checkout_url = create_preference(db_order, order_items)
            db_order.checkout_url = checkout_url
        except Exception:
            pass
            # No fallamos la orden si MP falla, pero el usuario no tendrá link
    
    db.commit()
    db.refresh(db_order)
    
    # Enviar email de confirmación de orden
    try:
        send_email(
            current_user.email,
            f"Confirmación de Pedido #{db_order.id[:8]}",
            get_order_confirmation_template(db_order.id, db_order.total_amount)
        )
    except Exception:
        pass
        
    return db_order

@app.get('/api/orders', response_model=List[OrderResponse])
async def list_orders(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    orders = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.design)
    ).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    return orders

# --- SHIPPING ENDPOINT ---

from pydantic import BaseModel as PydanticBase

class ShippingRateRequest(PydanticBase):
    postal_code: str
    weight_kg: float = 0.5

@app.post("/api/shipping/rate")
async def shipping_rate(data: ShippingRateRequest):
    """
    Cotiza un envío de Correo Argentino a partir del código postal de destino.
    Usa la API real de MiCorreo si hay credenciales en .env, o precios estimados por zona como fallback.
    """
    result = await get_shipping_rate(
        dest_postal_code=data.postal_code,
        weight_kg=data.weight_kg,
    )
    return result

# --- FAVORITES ENDPOINTS ---

@app.get("/api/favorites", response_model=List[ProductResponse])
async def get_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtener la lista de productos favoritos del usuario.
    """
    favorites = db.query(UserFavorite).filter(UserFavorite.user_id == current_user.id).all()
    product_ids = [f.product_id for f in favorites if f.product_id]
    
    products = db.query(Product).filter(Product.id.in_(product_ids)).all()
    return products

@app.post("/api/favorites/toggle/{product_id}")
async def toggle_favorite(
    product_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Alternar un producto como favorito para el usuario actual.
    """
    # Verificar que el producto existe
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # Buscar si ya es favorito
    fav = db.query(UserFavorite).filter(
        UserFavorite.user_id == current_user.id,
        UserFavorite.product_id == product_id
    ).first()
    
    if fav:
        db.delete(fav)
        db.commit()
        return {"is_favorite": False}
    else:
        new_fav = UserFavorite(user_id=current_user.id, product_id=product_id)
        db.add(new_fav)
        db.commit()
        return {"is_favorite": True}

@app.get("/api/favorites/ids", response_model=List[str])
async def get_favorite_ids(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtener solo los IDs de los productos favoritos para el estado global.
    """
    favorites = db.query(UserFavorite).filter(UserFavorite.user_id == current_user.id).all()
    return [f.product_id for f in favorites if f.product_id]

# --- PAYMENT WEBHOOK ---

@app.post("/api/payments/webhook")
async def mercadopago_webhook(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
        
        topic = data.get("type") or data.get("topic")
        
        if topic == "payment":
            payment_id = data.get("data", {}).get("id") or data.get("id")
            
            if payment_id:
                payment_info = get_payment_info(payment_id)
                
                order_id = payment_info.get("external_reference")
                status = payment_info.get("status")
                
                if order_id:
                    order = db.query(Order).filter(Order.id == order_id).first()
                    if order:
                        if status == "approved":
                            order.status = "paid"
                            # Enviar email de pago aprobado
                            try:
                                # Necesitamos el email del usuario
                                user = db.query(User).filter(User.id == order.user_id).first()
                                if user:
                                    send_email(
                                        user.email,
                                        f"¡Pago Aprobado! Pedido #{order.id[:8]}",
                                        get_payment_success_template(order.id)
                                    )
                            except Exception:
                                pass
                        elif status in ["rejected", "cancelled", "refunded"]:
                            order.status = "failed"
                        
                        db.commit()
        
        return {"status": "ok"}
    except Exception:
        return {"status": "error"}

# --- ADMIN ENDPOINTS ---

@app.get("/api/admin/stats", response_model=AdminStats)
async def get_admin_stats(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    """
    Obtiene estadísticas generales para el panel de admin.
    Solo accesible para usuarios admin.
    """
    # Total de ventas (suma de órdenes pagadas)
    total_sales = db.query(func.sum(Order.total_amount)).filter(Order.status == "paid").scalar() or 0.0
    
    # Contadores de órdenes por estado
    total_orders = db.query(Order).count()
    pending_orders = db.query(Order).filter(Order.status == "pending").count()
    paid_orders = db.query(Order).filter(Order.status == "paid").count()
    failed_orders = db.query(Order).filter(Order.status == "failed").count()
    
    # Total de usuarios y diseños
    total_users = db.query(User).count()
    total_designs = db.query(Design).count()
    
    return AdminStats(
        total_sales=total_sales,
        total_orders=total_orders,
        pending_orders=pending_orders,
        paid_orders=paid_orders,
        failed_orders=failed_orders,
        total_users=total_users,
        total_designs=total_designs
    )

@app.get("/api/admin/orders", response_model=List[AdminOrderResponse])
async def get_admin_orders(
    status_filter: Optional[str] = None,
    user_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    """
    Lista todas las órdenes con filtros y paginación.
    Solo accesible para usuarios admin.
    """
    query = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.design),
        joinedload(Order.user)
    )
    
    # Aplicar filtros
    if status_filter:
        query = query.filter(Order.status == status_filter)
    if user_id:
        query = query.filter(Order.user_id == user_id)
    
    orders = query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    return orders

@app.patch("/api/admin/orders/{order_id}", response_model=OrderResponse)
async def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    """
    Actualiza el estado de una orden.
    Solo accesible para usuarios admin.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    
    order.status = status_update.status
    db.commit()
    db.refresh(order)
    return order

@app.get("/api/admin/users", response_model=List[AdminUserResponse])
async def get_admin_users(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    """
    Lista todos los usuarios con estadísticas.
    Solo accesible para usuarios admin.
    """
    users = db.query(User).offset(skip).limit(limit).all()
    
    # Agregar contadores de órdenes y diseños
    users_with_stats = []
    for user in users:
        order_count = db.query(Order).filter(Order.user_id == user.id).count()
        design_count = db.query(Design).filter(Design.user_id == user.id).count()
        
        user_dict = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_admin,
            "created_at": user.created_at,
            "order_count": order_count,
            "design_count": design_count
        }
        users_with_stats.append(AdminUserResponse(**user_dict))
    
    return users_with_stats

# --- PRODUCT ENDPOINTS ---

@app.get("/api/products", response_model=List[ProductResponse])
async def get_products(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Obtener lista de productos activos (público).
    """
    products = db.query(Product).filter(Product.is_active == True).offset(skip).limit(limit).all()
    return products

@app.get("/api/products/slug/{slug}", response_model=ProductResponse)
async def get_product_by_slug(
    slug: str,
    db: Session = Depends(get_db)
):
    """
    Obtener un producto por su slug (público).
    Soporta búsqueda por ID como fallback para mayor robustez.
    """
    # Intentar por slug primero
    product = db.query(Product).filter(Product.slug == slug, Product.is_active == True).first()
    
    # Si no se encuentra, intentar por ID (fallback)
    if not product:
        product = db.query(Product).filter(Product.id == slug, Product.is_active == True).first()
        
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return product

@app.get("/api/products/all", response_model=List[ProductResponse])
async def get_all_products(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    """
    Obtener lista de todos los productos (admin only).
    """
    products = db.query(Product).offset(skip).limit(limit).all()
    return products

@app.post("/api/products", response_model=ProductResponse, status_code=201)
async def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    """
    Crear un nuevo producto (admin only).
    """
    print(f"DEBUG: Creando producto: {product.name}, slug: {product.slug}")
    try:
        image_url = product.image_url
        if image_url and image_url.startswith("data:image"):
            print("DEBUG: Subiendo imagen a Cloudinary...")
            image_url = upload_base64_image(image_url, folder="tazas_products")
            print(f"DEBUG: Imagen subida: {image_url[:50]}...")

        new_product = Product(
            name=product.name,
            slug=product.slug if product.slug else None, # Convertir "" a None para evitar duplicados de ""
            description=product.description,
            price=product.price,
            image_url=image_url,
            gallery_urls=product.gallery_urls,
            material=product.material,
            capacity=product.capacity,
            care_instructions=product.care_instructions,
            finish=product.finish,
            stock=product.stock,
            image_fit=product.image_fit,
            image_scale=product.image_scale,
            category=product.category,
            is_active=product.is_active
        )
        db.add(new_product)
        db.commit()
        db.refresh(new_product)
        print(f"DEBUG: Producto creado exitosamente: {new_product.id}")
        return new_product
    except Exception as e:
        print(f"ERROR en create_product: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear producto: {str(e)}")

@app.put("/api/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    product_update: ProductUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    """
    Actualizar un producto existente (admin only).
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # Actualizar solo los campos proporcionados
    update_data = product_update.model_dump(exclude_unset=True)
    
    if "image_url" in update_data and update_data["image_url"] and update_data["image_url"].startswith("data:image"):
        update_data["image_url"] = upload_base64_image(update_data["image_url"], folder="tazas_products")

    for key, value in update_data.items():
        setattr(product, key, value)
    
    db.commit()
    db.refresh(product)
    return product

@app.delete("/api/products/{product_id}", status_code=204)
async def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    """
    Eliminar un producto (admin only).
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    db.delete(product)
    db.commit()
    return None
