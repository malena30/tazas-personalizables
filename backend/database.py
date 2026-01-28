import os
from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine, Column, String, DateTime, JSON, ForeignKey, Boolean, Float, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
import uuid

# Configuración de la base de datos
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./designs.db")

# Corregir prefijo para SQLAlchemy si es necesario (Heroku/Railway usan postgres://)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Configuración del motor (Engine)
engine_args = {}

if DATABASE_URL.startswith("sqlite"):
    engine_args["connect_args"] = {"check_same_thread": False}
else:
    # Configuraciones recomendadas para PostgreSQL en producción
    engine_args.update({
        "pool_size": 10,
        "max_overflow": 20,
        "pool_recycle": 3600,
        "pool_pre_ping": True,
    })

engine = create_engine(DATABASE_URL, **engine_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Helper para usar JSONB en Postgres y JSON en otros (SQLite)
def SmartJSON():
    return JSONB if DATABASE_URL.startswith("postgresql") else JSON

# Modelo de Usuario
class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    phone = Column(String, nullable=True)
    addresses = Column(SmartJSON(), default=list, nullable=True)  # Lista de direcciones
    created_at = Column(DateTime, default=datetime.utcnow)
    
    designs = relationship("Design", back_populates="owner")
    orders = relationship("Order", back_populates="user")

# Modelo de Producto
class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=True) # Nullable for migration, then set to unique
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    image_url = Column(String, nullable=True)
    gallery_urls = Column(SmartJSON(), default=list, nullable=True) # Array de URLs de fotos reales
    material = Column(String, nullable=True)
    capacity = Column(String, nullable=True)
    care_instructions = Column(String, nullable=True)
    finish = Column(String, nullable=True)
    stock = Column(Integer, default=0, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Modelo de Diseño
class Design(Base):
    __tablename__ = "designs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    name = Column(String, nullable=False)
    mug_color = Column(String, nullable=False)
    elements = Column(SmartJSON(), nullable=False)  # Array de CanvasElement
    thumbnail = Column(String, nullable=True)
    is_favorite = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    owner = relationship("User", back_populates="designs")

# Modelo de Orden
class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    total_amount = Column(Float, nullable=False)
    status = Column(String, default="pending") # pending, paid, shipped
    shipping_address = Column(SmartJSON(), nullable=False)
    payment_method = Column(String, nullable=False)
    checkout_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("OrderItem", back_populates="order")
    user = relationship("User", back_populates="orders")

# Modelo de Item de Orden
class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String, ForeignKey("orders.id"), nullable=False)
    design_id = Column(String, ForeignKey("designs.id"), nullable=True)
    product_id = Column(String, nullable=True) # ID de producto de catálogo
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    design = relationship("Design")

# Crear todas las tablas
Base.metadata.create_all(bind=engine)

# Dependency para obtener sesión de DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
