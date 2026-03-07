import sys
import os
import uuid

# Asegurar que el directorio actual esté en el path
sys.path.append(os.getcwd())

from database import SessionLocal, User, Base, engine
from auth import get_password_hash

print("Intentando crear tablas (por si acaso)...")
Base.metadata.create_all(bind=engine)

db = SessionLocal()
try:
    print("Generando hash de contraseña...")
    hashed = get_password_hash("Password123!")
    
    unique_suffix = str(uuid.uuid4())[:8]
    username = f"debug_user_{unique_suffix}"
    email = f"debug_{unique_suffix}@example.com"
    
    print(f"Creando usuario: {username} ({email})...")
    new_user = User(
        username=username,
        email=email,
        hashed_password=hashed
    )
    
    db.add(new_user)
    db.commit()
    print("¡Usuario creado exitosamente en la DB!")
    
    # Limpiar el usuario de prueba
    db.delete(new_user)
    db.commit()
    print("Usuario de prueba eliminado correctamente.")
    
except Exception as e:
    print(f"ERROR DURANTE LA OPERACIÓN: {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()
