from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List, Optional
from datetime import timedelta
import database
from database import get_db, Design, User, Order, OrderItem
from schemas import (
    DesignCreate, DesignUpdate, DesignResponse, 
    UserRegister, UserLogin, UserResponse, Token,
    OrderCreate, OrderResponse,
    AdminStats, AdminUserResponse, AdminOrderResponse, OrderStatusUpdate,
    UserProfileUpdate, UserStats, Address
)
from auth import (
    get_password_hash, verify_password, create_access_token, 
    get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
)
from admin_utils import get_admin_user
from payments import create_preference, get_payment_info
from cloudinary_utils import upload_base64_image

app = FastAPI(title="Tazas Personalizables API")

# Configurar CORS para permitir requests desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
async def root():
    return {'message': 'Backend iniciado correctamente 🚀'}

# --- AUTH ENDPOINTS ---

@app.post("/auth/register", response_model=UserResponse, status_code=201)
async def register(user: UserRegister, db: Session = Depends(get_db)):
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
    return new_user

@app.post("/auth/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_credentials.username).first()
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
        except Exception as e:
            print(f"Error creando preferencia de MP: {e}")
            # No fallamos la orden si MP falla, pero el usuario no tendrá link
    
    db.commit()
    db.refresh(db_order)
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

# --- PAYMENT WEBHOOK ---

@app.post("/api/payments/webhook")
async def mercadopago_webhook(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
        print(f"Webhook recibido: {data}")
        
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
                        elif status in ["rejected", "cancelled", "refunded"]:
                            order.status = "failed"
                        
                        db.commit()
                        print(f"Orden {order_id} actualizada a estado: {order.status}")
        
        return {"status": "ok"}
    except Exception as e:
        print(f"Error procesando webhook: {e}")
        return {"status": "error", "message": str(e)}

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
