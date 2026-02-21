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
    # Configuraciones recomendadas para PostgreSQL en producción (Render/Supabase)
    engine_args.update({
        "pool_size": 5,
        "max_overflow": 10,
        "pool_recycle": 300,
        "pool_pre_ping": True,
        "connect_args": {
            "sslmode": "require",
            "connect_timeout": 10,
        },
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
    reset_token = Column(String, nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)
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
    image_fit = Column(String, default="contain", nullable=True) # "contain" or "cover"
    image_scale = Column(Float, default=1.0, nullable=True)      # Zoom level (1.0 = 100%)
    category = Column(String, default="frases", nullable=True) # "frases" or "formas"
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

# Auto-migración: agregar columnas nuevas si no existen (solo para SQLite, en Postgres create_all es suficiente)
def _auto_migrate():
    from sqlalchemy import text, inspect
    inspector = inspect(engine)
    # En PostgreSQL, create_all ya se encarga de las tablas y columnas nuevas
    # Esta migración es principalmente para SQLite local
    try:
        cols = [c['name'] for c in inspector.get_columns('users')]
        with engine.connect() as conn:
            if 'reset_token' not in cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN reset_token VARCHAR"))
                conn.commit()
            if 'reset_token_expires' not in cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN reset_token_expires TIMESTAMP"))
                conn.commit()
            if 'addresses' not in cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN addresses JSON"))
                conn.commit()
    except Exception as e:
        print(f"⚠️  Migración users: {e}")

    try:
        p_cols = [c['name'] for c in inspector.get_columns('products')]
        missing = {
            'slug': 'VARCHAR', 'gallery_urls': 'JSON', 'material': 'VARCHAR',
            'capacity': 'VARCHAR', 'care_instructions': 'VARCHAR', 'finish': 'VARCHAR',
            'stock': 'INTEGER DEFAULT 0', 'image_fit': "VARCHAR DEFAULT 'contain'",
            'image_scale': 'FLOAT DEFAULT 1.0', 'category': "VARCHAR DEFAULT 'frases'"
        }
        with engine.connect() as conn:
            for col_name, col_type in missing.items():
                if col_name not in p_cols:
                    conn.execute(text(f"ALTER TABLE products ADD COLUMN {col_name} {col_type}"))
                    conn.commit()
    except Exception as e:
        print(f"⚠️  Migración products: {e}")

# Crear todas las tablas + auto-migración al iniciar
def init_db():
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Tablas verificadas/creadas correctamente.")
    except Exception as e:
        print(f"⚠️  Error al crear tablas: {e}")
        return

    try:
        _auto_migrate()
        print("✅ Auto-migración completada.")
    except Exception as e:
        print(f"⚠️  Error en auto-migración: {e}")

try:
    init_db()
except Exception as e:
    print(f"⚠️  Error al inicializar DB: {e}")


# Dependency para obtener sesión de DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
