"""
Declaraciones UAFE desde el sistema interno: ver una declaración completa y
aplicar o descartar los datos personales que reportó un cliente ya registrado.
"""
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.declaracion_uafe import DeclaracionUAFE
from app.models.enums import EstadoDatosReportados, TipoSujeto
from app.models.system_user import SystemUser
from app.services import comparecientes as svc
from app.utils.access_log import registrar_acceso

router = APIRouter(prefix="/api/declaraciones", tags=["declaraciones"])


def _obtener(db: Session, declaracion_id: int) -> DeclaracionUAFE:
    decl = db.get(DeclaracionUAFE, declaracion_id)
    if decl is None:
        raise HTTPException(status_code=404, detail="Declaración no encontrada")
    return decl


def _sujeto(decl: DeclaracionUAFE) -> tuple[str, str]:
    if decl.tipo_sujeto == TipoSujeto.persona:
        return "parties", decl.party.document_number
    return "companies", decl.company.ruc


def _pendiente(decl: DeclaracionUAFE) -> None:
    if decl.datos_reportados_estado != EstadoDatosReportados.pendiente:
        raise HTTPException(status_code=400, detail="Esta declaración no tiene cambios pendientes de revisión.")


@router.get("/{declaracion_id}")
def ver_declaracion(
    declaracion_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: SystemUser = Depends(get_current_user),
):
    decl = _obtener(db, declaracion_id)
    entidad, doc = _sujeto(decl)
    registrar_acceso(db, current_user.username, "ver", entidad, doc, request.client.host if request.client else None)
    db.commit()
    return svc.serializar_declaracion(decl)


@router.post("/{declaracion_id}/datos-reportados/aplicar")
def aplicar_datos_reportados(
    declaracion_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: SystemUser = Depends(get_current_user),
):
    decl = _obtener(db, declaracion_id)
    _pendiente(decl)
    try:
        svc.aplicar_reportados(db, decl)
    except ValidationError as e:
        db.rollback()
        errores = "; ".join(f"{'.'.join(map(str, x['loc']))}: {x['msg']}" for x in e.errors()[:5])
        raise HTTPException(status_code=400, detail=f"Los datos reportados no son válidos: {errores}")
    entidad, doc = _sujeto(decl)
    registrar_acceso(db, current_user.username, "actualizar", entidad, doc, request.client.host if request.client else None)
    db.commit()
    return {"message": "Cambios aplicados"}


@router.post("/{declaracion_id}/datos-reportados/descartar")
def descartar_datos_reportados(
    declaracion_id: int,
    db: Session = Depends(get_db),
    current_user: SystemUser = Depends(get_current_user),
):
    decl = _obtener(db, declaracion_id)
    _pendiente(decl)
    decl.datos_reportados_estado = EstadoDatosReportados.descartado
    db.commit()
    return {"message": "Cambios descartados"}