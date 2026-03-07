from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import engine, Product, User

# Configuración de la base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def repopulate():
    db = SessionLocal()
    try:
        # 1. Limpiar productos existentes (opcional, pero recomendado para un estado limpio)
        db.query(Product).delete()
        print("Borrando productos existentes...")

        # 2. Crear productos de la colección "Frases"
        frases_products = [
            {
                "name": "Taza 'Con Intención'",
                "slug": "taza-con-intencion",
                "description": "Una pieza minimalista que recuerda vivir cada momento con propósito. Cerámica de alta calidad con acabado mate.",
                "price": 4500.0,
                "image_url": "https://images.pexels.com/photos/1207918/pexels-photo-1207918.jpeg",
                "category": "frases",
                "material": "Cerámica Premium",
                "capacity": "325ml",
                "stock": 50,
                "image_fit": "contain",
                "image_scale": 1.0
            },
            {
                "name": "Taza 'Inspiración Diaria'",
                "slug": "taza-inspiracion",
                "description": "El compañero perfecto para tus mañanas de reflexión y creatividad.",
                "price": 4200.0,
                "image_url": "https://images.pexels.com/photos/1556665/pexels-photo-1556665.jpeg",
                "category": "frases",
                "material": "Cerámica Premium",
                "capacity": "325ml",
                "stock": 30
            }
        ]

        # 3. Crear productos de la colección "Formas"
        formas_products = [
            {
                "name": "Taza Geometría Olive",
                "slug": "taza-geometria-olive",
                "description": "Diseño abstracto en tonos oliva que complementa cualquier espacio moderno.",
                "price": 4800.0,
                "image_url": "https://images.pexels.com/photos/2079234/pexels-photo-2079234.jpeg",
                "category": "formas",
                "material": "Cerámica Premium",
                "capacity": "350ml",
                "stock": 25,
                "image_fit": "cover",
                "image_scale": 1.1
            },
            {
                "name": "Taza Abstract Gold",
                "slug": "taza-abstract-gold",
                "description": "Líneas doradas fluidas sobre fondo blanco marfil. Elegancia en cada detalle.",
                "price": 5200.0,
                "image_url": "https://images.pexels.com/photos/4109850/pexels-photo-4109850.jpeg",
                "category": "formas",
                "material": "Porcelana Reforzada",
                "capacity": "300ml",
                "stock": 15
            }
        ]

        # Agregar productos a la base de datos
        for p_data in frases_products + formas_products:
            product = Product(**p_data)
            db.add(product)
            print(f"Agregando producto: {p_data['name']}")

        db.commit()
        print("\n¡Base de datos repoblada con éxito! ☕✨")

    except Exception as e:
        print(f"Error al repoblar: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    repopulate()
