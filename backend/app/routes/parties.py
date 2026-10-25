from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.party import Party
from app.schemas.party import PartyCreate, PartyResponse, PartyWithPartner
from app.middleware.auth import get_current_user
from app.models.system_user import SystemUser
from app.utils.access_log import registrar_acceso

router = APIRouter(prefix="/api/users", tags=["users"])


def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else None


@router.post("/", response_model=PartyResponse, status_code=status.HTTP_201_CREATED)
def save_user(
    request: Request,
    user_data: PartyCreate,
    db: Session = Depends(get_db),
    current_user: SystemUser = Depends(get_current_user)
):
    """POST /api/users — Crear o actualizar compareciente"""
    try:
        existing_user = db.query(Party).filter(
            Party.document_number == user_data.document_number
        ).first()

        if existing_user:
            # exclude_unset: solo se actualizan los campos enviados, para no borrar
            # datos UAFE/patrimonio llenados desde el formulario público.
            for field, value in user_data.model_dump(exclude_unset=True).items():
                setattr(existing_user, field, value)
            db.flush()
            registrar_acceso(db, current_user.username, "actualizar", "parties", user_data.document_number, get_client_ip(request))
            db.commit()
            db.refresh(existing_user)
            return existing_user

        new_user = Party(**user_data.model_dump())
        db.add(new_user)
        db.flush()
        registrar_acceso(db, current_user.username, "crear", "parties", user_data.document_number, get_client_ip(request))
        db.commit()
        db.refresh(new_user)
        return new_user

    except Exception as e:
        db.rollback()
        import logging
        logging.getLogger(__name__).error(f"Error guardando compareciente: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno al guardar el compareciente. Verifique los datos e intente de nuevo.")


def _serializar_party(p: Party) -> dict:
    """Convierte un Party en dict para la respuesta (persona principal o cónyuge)."""
    return {
        "document_number": p.document_number,
        "names": p.names,
        "last_names": p.last_names,
        "document_type": p.document_type.value,
        "gender": p.gender.value,
        "marital_status": p.marital_status.value,
        "partner_document_number": p.partner_document_number,
        "nationality": p.nationality,
        "birth_date": p.birth_date,
        "email": p.email,
        "phone": p.phone,
        "province": p.province,
        "canton": p.canton,
        "parroquia": p.parroquia,
        "sector": p.sector,
        "main_street": p.main_street,
        "secondary_street": p.secondary_street,
        "number_street": p.number_street,
        "edificio": p.edificio,
        "occupation": p.occupation,
        "profession": p.profession,
        "conyugue_comparece": p.conyugue_comparece,
        "razon_exclusion_conyugue": p.razon_exclusion_conyugue,
        "calidad_participacion": p.calidad_participacion,
        "actividad_economica": p.actividad_economica.value if p.actividad_economica else None,
        "empresa_trabajo": p.empresa_trabajo,
        "ingreso_mensual": float(p.ingreso_mensual) if p.ingreso_mensual is not None else None,
        "rol_tramite": p.rol_tramite,
        "origen_fondos": p.origen_fondos,
        "es_pep": p.es_pep,
        "es_pep_indirecto": p.es_pep_indirecto,
        "pep_nombre": p.pep_nombre,
        "pep_institucion": p.pep_institucion,
        "pep_fecha_inicio": p.pep_fecha_inicio,
        "pep_cargo": p.pep_cargo,
        "pep_anios_trabajo": p.pep_anios_trabajo,
        "pep_grado_relacion": p.pep_grado_relacion,
        "pep_relacion_tipo": p.pep_relacion_tipo,
        "pep_ya_no_ejerce": p.pep_ya_no_ejerce,
        "pep_fecha_fin": p.pep_fecha_fin,
        "patrimonio": p.patrimonio,
    }


@router.get("/{document_number}", response_model=PartyWithPartner)
def get_user(
    document_number: str,
    request: Request,
    db: Session = Depends(get_db),
    current_user: SystemUser = Depends(get_current_user)
):
    """GET /api/users/:documentNumber — Obtener compareciente por número de documento"""
    try:
        user = db.query(Party).filter(
            Party.document_number == document_number
        ).first()

        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")

        registrar_acceso(db, current_user.username, "ver", "parties", document_number, get_client_ip(request))
        db.commit()

        partner = None
        if user.marital_status.value == 'casado' and user.partner_document_number:
            partner = db.query(Party).filter(
                Party.document_number == user.partner_document_number
            ).first()

        user_dict = _serializar_party(user)
        user_dict["partner"] = _serializar_party(partner) if partner else None

        return user_dict

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno del servidor")