from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.party import Party
from app.schemas.party import PartyCreate, PartyResponse, PartyWithPartner
from app.middleware.auth import get_current_user
from app.models.system_user import SystemUser

router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("/", response_model=PartyResponse, status_code=status.HTTP_201_CREATED)
def save_user(
    user_data: PartyCreate,
    db: Session = Depends(get_db),
    current_user: SystemUser = Depends(get_current_user)
):
    """
    POST /api/users - Crear o guardar compareciente
    Requiere autenticación
    """
    try:
        # Verificar si ya existe el usuario
        existing_user = db.query(Party).filter(
            Party.document_number == user_data.document_number
        ).first()
        
        if existing_user:
            # Si existe, actualizar (upsert)
            for field, value in user_data.model_dump().items():
                setattr(existing_user, field, value)
            
            db.commit()
            db.refresh(existing_user)
            return existing_user
        
        # Si no existe, crear nuevo
        new_user = Party(**user_data.model_dump())
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return new_user
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{document_number}", response_model=PartyWithPartner)
def get_user(
    document_number: str,
    db: Session = Depends(get_db),
    current_user: SystemUser = Depends(get_current_user)
):
    """
    GET /api/users/:documentNumber - Obtener compareciente por número de documento
    Incluye datos del cónyuge si está casado
    """
    try:
        # Buscar usuario por documento
        user = db.query(Party).filter(
            Party.document_number == document_number
        ).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )
        
        # Si el usuario está casado y tiene cédula de pareja, buscarla
        partner = None
        if user.marital_status.value == 'casado' and user.partner_document_number:
            partner = db.query(Party).filter(
                Party.document_number == user.partner_document_number
            ).first()
        
        # Convertir a dict para incluir partner
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
            "occupation": user.occupation,
            "profession": user.profession,
            "partner": None
        }
        
        # Agregar datos del partner si existe
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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )