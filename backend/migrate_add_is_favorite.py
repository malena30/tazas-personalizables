"""
Script para agregar el campo is_favorite a diseños existentes en la base de datos.
Ejecutar este script después de actualizar el modelo Design.
"""

from database import SessionLocal, Design, engine, Base

def add_is_favorite_field():
    # Recrear todas las tablas con el nuevo esquema
    print("Recreando tablas con el nuevo esquema...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas actualizadas correctamente")
    
    # Actualizar diseños existentes que no tengan is_favorite
    db = SessionLocal()
    try:
        designs = db.query(Design).all()
        for design in designs:
            if not hasattr(design, 'is_favorite') or design.is_favorite is None:
                design.is_favorite = False
        
        db.commit()
        print(f"✅ Actualizados {len(designs)} diseños")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🔧 Iniciando migración de base de datos (campo is_favorite)...")
    add_is_favorite_field()
    print("\n✅ Migración completada!")
    print("   Los diseños ahora pueden marcarse como favoritos")
