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
            for field, value in user_data.model_dump().items():
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

        user_dict = {
            "document_number": user.document_number,
            "names": user.names,
            "last_names": user.last_names,
            "document_type": user.document_type.value,
            "gender": user.gender.value,
            "marital_status": user.marital_status.value,
            "partner_document_number": user.partner_document_number,
            "nationality": user.nationality,
            "birth_date": user.birth_date,
            "email": user.email,
            "phone": user.phone,
            "province": user.province,
            "canton": user.canton,
            "parroquia": user.parroquia,
            "sector": user.sector,
            "main_street": user.main_street,
            "secondary_street": user.secondary_street,
            "number_street": user.number_street,
            "edificio": user.edificio,
            "occupation": user.occupation,
            "profession": user.profession,
            "conyugue_comparece": user.conyugue_comparece,
            "razon_exclusion_conyugue": user.razon_exclusion_conyugue,
            "actividad_economica": user.actividad_economica.value if user.actividad_economica else None,
            "empresa_trabajo": user.empresa_trabajo,
            "ingreso_mensual": float(user.ingreso_mensual) if user.ingreso_mensual is not None else None,
            "origen_fondos": user.origen_fondos,
            "es_pep": user.es_pep,
            "es_pep_indirecto": user.es_pep_indirecto,
            "pep_nombre": user.pep_nombre,
            "pep_institucion": user.pep_institucion,
            "pep_fecha_inicio": user.pep_fecha_inicio,
            "pep_cargo": user.pep_cargo,
            "pep_anios_trabajo": user.pep_anios_trabajo,
            "pep_grado_relacion": user.pep_grado_relacion,
            "partner": None
        }

        if partner:
            user_dict["partner"] = {
                "document_number": partner.document_number,
                "names": partner.names,
                "last_names": partner.last_names,
                "document_type": partner.document_type.value,
                "gender": partner.gender.value,
                "marital_status": partner.marital_status.value,
                "partner_document_number": partner.partner_document_number,
                "nationality": partner.nationality,
                "birth_date": partner.birth_date,
                "email": partner.email,
                "phone": partner.phone,
                "province": partner.province,
                "canton": partner.canton,
                "parroquia": partner.parroquia,
                "sector": partner.sector,
                "main_street": partner.main_street,
                "secondary_street": partner.secondary_street,
                "number_street": partner.number_street,
                "occupation": partner.occupation,
                "profession": partner.profession
            }

        return user_dict

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno del servidor")