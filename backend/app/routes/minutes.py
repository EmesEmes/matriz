from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import Dict, Any
import json
import os

from app.database import get_db
from app.middleware.auth import get_current_user  # Cambio aquí
from app.models.system_user import SystemUser
from app.models.minute import Minute, MinuteType
from app.services.minuta_generator import generate_minuta_compraventa

router = APIRouter(prefix="/minutes", tags=["minutes"])

@router.post("/generate-minuta")
async def generate_minuta(
    data: Dict[Any, Any],
    db: Session = Depends(get_db),
    current_user: SystemUser = Depends(get_current_user)
):
    """
    Generar minuta de compraventa de inmueble
    """
    try:
        print("DEBUG - Datos recibidos:", json.dumps(data, indent=2, ensure_ascii=False))
        
        # Validar tipo de contrato
        if data.get('tipoContrato') != 'compraventa':
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Solo se soporta tipo de contrato 'compraventa' por ahora"
            )
        
        # Generar el documento
        output_path = generate_minuta_compraventa(data, current_user)
        
        if not output_path or not os.path.exists(output_path):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al generar el documento"
            )
        
        # Guardar en la base de datos
        new_minute = Minute(
            minute_type=MinuteType.COMPRAVENTA_INMUEBLE,
            contract_data=json.dumps(data, ensure_ascii=False),
            file_path=output_path,
            created_by=current_user.id
        )
        db.add(new_minute)
        db.commit()
        db.refresh(new_minute)
        
        # Retornar el archivo
        return FileResponse(
            path=output_path,
            filename=f"minuta_{new_minute.id}.docx",
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
        
    except Exception as e:
        print(f"ERROR al generar minuta: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al generar minuta: {str(e)}"
        )

@router.get("/")
async def list_minutes(
    db: Session = Depends(get_db),
    current_user: SystemUser = Depends(get_current_user)  # Cambio aquí
):
    """
    Listar todas las minutas del usuario actual
    """
    minutes = db.query(Minute).filter(Minute.created_by == current_user.id).all()
    return minutes

@router.get("/{minute_id}")
async def get_minute(
    minute_id: int,
    db: Session = Depends(get_db),
    current_user: SystemUser = Depends(get_current_user)  # Cambio aquí
):
    """
    Obtener una minuta específica
    """
    minute = db.query(Minute).filter(
        Minute.id == minute_id,
        Minute.created_by == current_user.id
    ).first()
    
    if not minute:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Minuta no encontrada"
        )
    
    return minute

@router.get("/download/{minute_id}")
async def download_minute(
    minute_id: int,
    db: Session = Depends(get_db),
    current_user: SystemUser = Depends(get_current_user)  # Cambio aquí
):
    """
    Descargar una minuta
    """
    minute = db.query(Minute).filter(
        Minute.id == minute_id,
        Minute.created_by == current_user.id
    ).first()
    
    if not minute:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Minuta no encontrada"
        )
    
    if not os.path.exists(minute.file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archivo no encontrado"
        )
    
    return FileResponse(
        path=minute.file_path,
        filename=f"minuta_{minute.id}.docx",
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )