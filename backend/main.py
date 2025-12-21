from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta
import database
from database import get_db, Design, User, Order, OrderItem
from schemas import (
    DesignCreate, DesignUpdate, DesignResponse, 
    UserRegister, UserLogin, UserResponse, Token,
    OrderCreate, OrderResponse
)
from auth import (
    get_password_hash, verify_password, create_access_token, 
    get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
)
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
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
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
