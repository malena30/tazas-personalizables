"""
Migración: Agregar campos reset_token y reset_token_expires a la tabla users.
Para soportar la funcionalidad de recuperación de contraseña.
"""
import os
from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine, text

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./designs.db")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)

def migrate():
    with engine.connect() as conn:
        # Verificar si las columnas ya existen
        try:
            conn.execute(text("SELECT reset_token FROM users LIMIT 1"))
            print("✅ Columna 'reset_token' ya existe.")
        except Exception:
            conn.execute(text("ALTER TABLE users ADD COLUMN reset_token VARCHAR"))
            conn.commit()
            print("✅ Columna 'reset_token' agregada.")

        try:
            conn.execute(text("SELECT reset_token_expires FROM users LIMIT 1"))
            print("✅ Columna 'reset_token_expires' ya existe.")
        except Exception:
            conn.execute(text("ALTER TABLE users ADD COLUMN reset_token_expires TIMESTAMP"))
            conn.commit()
            print("✅ Columna 'reset_token_expires' agregada.")

    print("🎉 Migración completada.")

if __name__ == "__main__":
    migrate()
