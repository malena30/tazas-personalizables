"""
Script para agregar los campos phone y addresses a usuarios existentes en la base de datos.
Ejecutar este script después de actualizar el modelo User.
"""

from database import SessionLocal, User, engine, Base

def add_profile_fields():
    # Recrear todas las tablas con el nuevo esquema
    print("Recreando tablas con el nuevo esquema...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas actualizadas correctamente")
    
    # Actualizar usuarios existentes que no tengan estos campos
    db = SessionLocal()
    try:
        users = db.query(User).all()
        for user in users:
            if not hasattr(user, 'phone') or user.phone is None:
                user.phone = None
            if not hasattr(user, 'addresses') or user.addresses is None:
                user.addresses = []
        
        db.commit()
        print(f"✅ Actualizados {len(users)} usuarios con campos de perfil")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🔧 Iniciando migración de base de datos (campos de perfil)...")
    add_profile_fields()
    print("\n✅ Migración completada!")
    print("   Los usuarios ahora pueden gestionar teléfono y direcciones desde /profile")
