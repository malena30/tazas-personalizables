from sqlalchemy import create_engine, Column, String, DateTime, JSON, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import uuid

# Configuración de la base de datos SQLite
SQLALCHEMY_DATABASE_URL = "sqlite:///./designs.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Modelo de Usuario
class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    phone = Column(String, nullable=True)
    addresses = Column(JSON, default=list, nullable=True)  # Lista de direcciones
    created_at = Column(DateTime, default=datetime.utcnow)
    
    designs = relationship("Design", back_populates="owner")
    orders = relationship("Order", back_populates="user")

# Modelo de Diseño
class Design(Base):
    __tablename__ = "designs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    name = Column(String, nullable=False)
    mug_color = Column(String, nullable=False)
    elements = Column(JSON, nullable=False)  # Array de CanvasElement
    thumbnail = Column(String, nullable=True)  # Base64 o URL
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    owner = relationship("User", back_populates="designs")

# Modelo de Orden
class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    total_amount = Column(JSON, nullable=False) # Guardamos como float pero SQLAlchemy lo maneja
    status = Column(String, default="pending") # pending, paid, shipped
    shipping_address = Column(JSON, nullable=False)
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
    quantity = Column(JSON, nullable=False) # Integer
    price = Column(JSON, nullable=False) # Float

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
