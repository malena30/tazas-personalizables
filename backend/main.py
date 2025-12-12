from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import database
from database import get_db, Design
from schemas import DesignCreate, DesignUpdate, DesignResponse

app = FastAPI(title="Tazas Personalizables API")

# Configurar CORS para permitir requests desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
async def root():
    return {'message': 'Backend iniciado correctamente 🚀'}

# CREATE - Crear nuevo diseño
@app.post('/api/designs', response_model=DesignResponse, status_code=201)
async def create_design(design: DesignCreate, db: Session = Depends(get_db)):
    db_design = Design(
        name=design.name,
        mug_color=design.mug_color,
        elements=design.elements,
        thumbnail=design.thumbnail
    )
    db.add(db_design)
    db.commit()
    db.refresh(db_design)
    return db_design

# READ - Listar todos los diseños (con paginación)
@app.get('/api/designs', response_model=List[DesignResponse])
async def list_designs(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    designs = db.query(Design).order_by(Design.updated_at.desc()).offset(skip).limit(limit).all()
    return designs

# READ - Obtener un diseño específico
@app.get('/api/designs/{design_id}', response_model=DesignResponse)
async def get_design(design_id: str, db: Session = Depends(get_db)):
    design = db.query(Design).filter(Design.id == design_id).first()
    if not design:
        raise HTTPException(status_code=404, detail="Diseño no encontrado")
    return design

# UPDATE - Actualizar diseño existente
@app.put('/api/designs/{design_id}', response_model=DesignResponse)
async def update_design(
    design_id: str,
    design_update: DesignUpdate,
    db: Session = Depends(get_db)
):
    db_design = db.query(Design).filter(Design.id == design_id).first()
    if not db_design:
        raise HTTPException(status_code=404, detail="Diseño no encontrado")
    
    # Actualizar solo los campos proporcionados
    update_data = design_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_design, field, value)
    
    db.commit()
    db.refresh(db_design)
    return db_design

# DELETE - Eliminar diseño
@app.delete('/api/designs/{design_id}', status_code=204)
async def delete_design(design_id: str, db: Session = Depends(get_db)):
    db_design = db.query(Design).filter(Design.id == design_id).first()
    if not db_design:
        raise HTTPException(status_code=404, detail="Diseño no encontrado")
    
    db.delete(db_design)
    db.commit()
    return None
