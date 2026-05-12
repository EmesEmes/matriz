from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models.registration_token import RegistrationToken
from app.models.party import Party
from app.models.company import Company
from app.schemas.registration_token import TokenGenerado, TokenInfo, RegistrationTokenResponse
from app.schemas.party import PartyCreate, PartyResponse
from app.schemas.company import CompanyCreate, CompanyResponse
from app.middleware.auth import get_current_user
from app.models.system_user import SystemUser
from app.utils.access_log import registrar_acceso
import uuid

router = APIRouter(tags=["registro"])


class RegistroPersonaPayload(BaseModel):
    """Payload para persona natural — titular + cónyuge opcional"""
    tipo: str = "persona"
    titular: PartyCreate
    conyugue: Optional[PartyCreate] = None


class RegistroEmpresaPayload(BaseModel):
    """Payload para persona jurídica"""
    tipo: str = "empresa"
    empresa: CompanyCreate


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


def _upsert_company(db: Session, company_data: CompanyCreate) -> Company:
    existing = db.query(Company).filter(
        Company.ruc == company_data.ruc
    ).first()

    if existing:
        for field, value in company_data.model_dump().items():
            setattr(existing, field, value)
        db.flush()
        return existing
    else:
        company = Company(**company_data.model_dump())
        db.add(company)
        db.flush()
        return company


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
    request: Request,
    payload: dict,
    db: Session = Depends(get_db)
):
    """
    Registra los datos del cliente usando un token válido.
    Soporta persona natural (con o sin cónyuge) y persona jurídica.
    """
    token_obj = _verificar_token_obj(token, db)
    ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else None)

    try:
        tipo = payload.get("tipo", "persona")

        if tipo == "empresa":
            # Persona jurídica
            empresa_data = CompanyCreate(**payload.get("empresa", {}))
            empresa = _upsert_company(db, empresa_data)

            token_obj.usado = True
            token_obj.party_document_number = empresa.ruc
            registrar_acceso(db, "registro_publico", "registro_publico", "companies", empresa.ruc, ip)

        else:
            # Persona natural
            titular_data = PartyCreate(**payload.get("titular", {}))
            conyugue_raw = payload.get("conyugue")

            if conyugue_raw:
                conyugue_data = PartyCreate(**conyugue_raw)
                conyugue_data_dict = conyugue_raw.copy()
                conyugue_data_dict['partner_document_number'] = titular_data.document_number
                conyugue = _upsert_party(db, PartyCreate(**conyugue_data_dict))

                titular_data_dict = payload.get("titular").copy()
                titular_data_dict['partner_document_number'] = conyugue_raw.get('document_number')
                titular = _upsert_party(db, PartyCreate(**titular_data_dict))

                registrar_acceso(db, "registro_publico", "registro_publico", "parties", conyugue.document_number, ip)
            else:
                titular = _upsert_party(db, titular_data)

            token_obj.usado = True
            token_obj.party_document_number = titular.document_number
            registrar_acceso(db, "registro_publico", "registro_publico", "parties", titular.document_number, ip)

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