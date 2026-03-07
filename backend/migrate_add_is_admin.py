"""
Script para agregar el campo is_admin a usuarios existentes en la base de datos.
Ejecutar este script después de actualizar el modelo User.
"""

from database import SessionLocal, User, engine, Base

def add_is_admin_column():
    # Recrear todas las tablas con el nuevo esquema
    print("Recreando tablas con el nuevo esquema...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas actualizadas correctamente")
    
    # Actualizar usuarios existentes que no tengan is_admin
    db = SessionLocal()
    try:
        users = db.query(User).all()
        for user in users:
            if not hasattr(user, 'is_admin') or user.is_admin is None:
                user.is_admin = False
        
        db.commit()
        print(f"✅ Actualizados {len(users)} usuarios")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🔧 Iniciando migración de base de datos...")
    add_is_admin_column()
    print("\n📝 IMPORTANTE: Para crear un usuario administrador, ejecuta:")
    print("   python make_admin.py <username>")
    print("\n   O desde la base de datos directamente:")
    print("   UPDATE users SET is_admin = 1 WHERE username = 'tu_usuario';")
