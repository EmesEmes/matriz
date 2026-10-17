from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from pathlib import Path
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
            # exclude_unset: solo se actualizan los campos que el formulario envió.
            # Así no se borran datos UAFE/socios llenados desde el formulario público.
            for field, value in company_data.model_dump(exclude_unset=True).items():
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

@router.get("/{ruc}/anexo-socios")
def descargar_anexo_socios(
    ruc: str,
    db: Session = Depends(get_db),
    current_user: SystemUser = Depends(get_current_user)
):
    """GET /api/companies/{ruc}/anexo-socios - Descargar el listado de socios adjunto"""
    company = db.query(Company).filter(Company.ruc == ruc).first()
    if not company or not company.anexo_socios_path:
        raise HTTPException(status_code=404, detail="Esta empresa no tiene anexo de socios")

    ruta = Path(company.anexo_socios_path)
    if not ruta.is_file():
        raise HTTPException(status_code=404, detail="El archivo del anexo ya no existe en el servidor")

    return FileResponse(
        path=str(ruta),
        filename=company.anexo_socios_nombre or f"socios_{ruc}.pdf",
        media_type="application/pdf",
    )