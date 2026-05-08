from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models.registration_token import RegistrationToken
from app.models.party import Party
from app.schemas.registration_token import TokenGenerado, TokenInfo, RegistrationTokenResponse
from app.schemas.party import PartyCreate, PartyResponse
from app.middleware.auth import get_current_user
from app.models.system_user import SystemUser
from app.utils.access_log import registrar_acceso
import uuid

router = APIRouter(tags=["registro"])


class RegistroClientePayload(BaseModel):
    """Payload del formulario público — titular + cónyuge opcional"""
    titular: PartyCreate
    conyugue: Optional[PartyCreate] = None


# ============================================
# ENDPOINTS PRIVADOS (requieren login)
# ============================================

@router.post("/api/registro/generar-token", response_model=TokenGenerado)
def generar_token(
    request: Request,
    db: Session = Depends(get_db),
    current_user: SystemUser = Depends(get_current_user)
):
    """Genera un token único para que un cliente registre sus datos."""
    token_str = str(uuid.uuid4())
    expira_en = datetime.now(timezone.utc) + timedelta(hours=72)

    token = RegistrationToken(
        token=token_str,
        expira_en=expira_en,
        creado_por=current_user.username
    )
    db.add(token)
    db.commit()
    db.refresh(token)

    base_url = str(request.base_url).rstrip('/')
    link = f"{base_url}/registro/{token_str}"

    return TokenGenerado(
        token=token_str,
        link=link,
        expira_en=expira_en,
        creado_por=current_user.username
    )


@router.get("/api/registro/tokens", response_model=list[RegistrationTokenResponse])
def listar_tokens(
    db: Session = Depends(get_db),
    current_user: SystemUser = Depends(get_current_user)
):
    """Lista todos los tokens generados."""
    return db.query(RegistrationToken).order_by(
        RegistrationToken.creado_en.desc()
    ).all()


@router.delete("/api/registro/tokens/{token}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_token(
    token: str,
    db: Session = Depends(get_db),
    current_user: SystemUser = Depends(get_current_user)
):
    """Elimina un token no usado."""
    token_obj = db.query(RegistrationToken).filter(
        RegistrationToken.token == token
    ).first()

    if not token_obj:
        raise HTTPException(status_code=404, detail="Token no encontrado")

    if token_obj.usado:
        raise HTTPException(status_code=400, detail="No se puede eliminar un token ya usado")

    db.delete(token_obj)
    db.commit()


# ============================================
# ENDPOINTS PÚBLICOS (sin login)
# ============================================

def _verificar_token_obj(token: str, db: Session) -> RegistrationToken:
    """Helper que valida el token y retorna el objeto o lanza excepción."""
    token_obj = db.query(RegistrationToken).filter(
        RegistrationToken.token == token
    ).first()

    if not token_obj or token_obj.usado:
        raise HTTPException(status_code=400, detail="El enlace no es válido o ya fue utilizado")

    ahora = datetime.now(timezone.utc)
    if token_obj.expira_en.replace(tzinfo=timezone.utc) < ahora:
        raise HTTPException(status_code=400, detail="El enlace no es válido o ya fue utilizado")

    return token_obj


def _upsert_party(db: Session, party_data: PartyCreate) -> Party:
    """Crea o actualiza una persona en la BD."""
    existing = db.query(Party).filter(
        Party.document_number == party_data.document_number
    ).first()

    if existing:
        for field, value in party_data.model_dump().items():
            setattr(existing, field, value)
        db.flush()
        return existing
    else:
        party = Party(**party_data.model_dump())
        db.add(party)
        db.flush()
        return party


@router.get("/api/public/registro/verificar/{token}", response_model=TokenInfo)
def verificar_token(token: str, db: Session = Depends(get_db)):
    """Verifica si un token es válido. Endpoint público."""
    token_obj = db.query(RegistrationToken).filter(
        RegistrationToken.token == token
    ).first()

    if not token_obj or token_obj.usado:
        return TokenInfo(valido=False, mensaje="El enlace no es válido o ya fue utilizado")

    ahora = datetime.now(timezone.utc)
    if token_obj.expira_en.replace(tzinfo=timezone.utc) < ahora:
        return TokenInfo(valido=False, mensaje="El enlace no es válido o ya fue utilizado")

    return TokenInfo(valido=True, mensaje="Token válido")


@router.post("/api/public/registro/{token}", status_code=status.HTTP_201_CREATED)
def registrar_cliente(
    token: str,
    payload: RegistroClientePayload,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Registra los datos del cliente (y cónyuge si aplica) usando un token válido.
    Guarda cada persona por separado en la tabla parties, relacionadas por cédula.
    Endpoint público — no requiere autenticación.
    """
    token_obj = _verificar_token_obj(token, db)

    try:
        if payload.conyugue:
            # Guardar cónyuge primero (sin partner_document_number aún)
            datos_conyugue = payload.conyugue.model_dump()
            datos_conyugue['partner_document_number'] = payload.titular.document_number
            conyugue_schema = PartyCreate(**datos_conyugue)
            conyugue = _upsert_party(db, conyugue_schema)

            # Guardar titular con referencia al cónyuge
            datos_titular = payload.titular.model_dump()
            datos_titular['partner_document_number'] = payload.conyugue.document_number
            titular_schema = PartyCreate(**datos_titular)
            titular = _upsert_party(db, titular_schema)
        else:
            titular = _upsert_party(db, payload.titular)

        # Marcar token como usado
        token_obj.usado = True
        token_obj.party_document_number = titular.document_number

        # Log de acceso — registro público
        ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else None)
        registrar_acceso(db, "registro_publico", "registro_publico", "parties", titular.document_number, ip)
        if payload.conyugue:
            registrar_acceso(db, "registro_publico", "registro_publico", "parties", payload.conyugue.document_number, ip)

        db.commit()

        return {"message": "Datos registrados correctamente"}

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Error al guardar los datos. Por favor intente nuevamente."
        )