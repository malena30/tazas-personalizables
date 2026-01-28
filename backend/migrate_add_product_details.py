import sqlite3
import os

def migrate():
    db_path = os.path.join(os.path.dirname(__file__), "designs.db")
    if not os.path.exists(db_path):
        print(f"Base de datos no encontrada en {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Columnas a agregar
    columns = [
        ("slug", "TEXT"),
        ("gallery_urls", "JSON"),
        ("material", "TEXT"),
        ("capacity", "TEXT"),
        ("care_instructions", "TEXT"),
        ("finish", "TEXT")
    ]

    for col_name, col_type in columns:
        try:
            cursor.execute(f"ALTER TABLE products ADD COLUMN {col_name} {col_type}")
            print(f"Columna '{col_name}' agregada exitosamente.")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e).lower():
                print(f"La columna '{col_name}' ya existe.")
            else:
                print(f"Error al agregar columna '{col_name}': {e}")

    # Crear índice para slug
    try:
        cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products (slug)")
        print("Índice único para 'slug' creado exitosamente.")
    except Exception as e:
        print(f"Error al crear índice para 'slug': {e}")

    conn.commit()
    conn.close()
    print("Migración completada.")

if __name__ == "__main__":
    migrate()
