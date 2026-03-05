from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.company import Company
from app.schemas.company import CompanyCreate, CompanyUpdate, CompanyResponse
from app.middleware.auth import get_current_user
from app.models.system_user import SystemUser

router = APIRouter(prefix="/api/companies", tags=["companies"])


@router.post("/", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
def save_company(
    company_data: CompanyCreate,
    db: Session = Depends(get_db),
    current_user: SystemUser = Depends(get_current_user)
):
    """
    POST /api/companies - Crear o actualizar empresa (upsert por RUC)
    """
    try:
        existing = db.query(Company).filter(Company.ruc == company_data.ruc).first()

        if existing:
            for field, value in company_data.model_dump().items():
                setattr(existing, field, value)
            db.commit()
            db.refresh(existing)
            return existing

        new_company = Company(**company_data.model_dump())
        db.add(new_company)
        db.commit()
        db.refresh(new_company)
        return new_company

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/{ruc}", response_model=CompanyResponse)
def get_company(
    ruc: str,
    db: Session = Depends(get_db),
    current_user: SystemUser = Depends(get_current_user)
):
    """
    GET /api/companies/{ruc} - Obtener empresa por RUC
    """
    try:
        company = db.query(Company).filter(Company.ruc == ruc).first()

        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Empresa no encontrada"
            )

        return company

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )


@router.put("/{ruc}", response_model=CompanyResponse)
def update_company(
    ruc: str,
    company_data: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user: SystemUser = Depends(get_current_user)
):
    """
    PUT /api/companies/{ruc} - Actualizar datos de una empresa
    """
    try:
        company = db.query(Company).filter(Company.ruc == ruc).first()

        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Empresa no encontrada"
            )

        for field, value in company_data.model_dump(exclude_unset=True).items():
            setattr(company, field, value)

        db.commit()
        db.refresh(company)
        return company

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )