"""
Script para hacer que un usuario sea administrador.
Uso: python make_admin.py <username>
"""

import sys
from database import SessionLocal, User

def make_admin(username: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == username).first()
        if not user:
            print(f"❌ Usuario '{username}' no encontrado")
            return
        
        user.is_admin = True
        db.commit()
        print(f"✅ Usuario '{username}' ahora es administrador")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Uso: python make_admin.py <username>")
        sys.exit(1)
    
    username = sys.argv[1]
    make_admin(username)
