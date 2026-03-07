import sqlite3
import os

def check_db():
    db_path = os.path.join(os.path.dirname(__file__), "designs.db")
    if not os.path.exists(db_path):
        print(f"Base de datos no encontrada en {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    print("--- Productos ---")
    cursor.execute("SELECT id, name, slug FROM products")
    rows = cursor.fetchall()
    for row in rows:
        print(row)

    print("\n--- Columnas en products ---")
    cursor.execute("PRAGMA table_info(products)")
    cols = cursor.fetchall()
    for col in cols:
        print(col)

    conn.close()

if __name__ == "__main__":
    check_db()
