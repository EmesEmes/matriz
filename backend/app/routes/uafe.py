from fastapi import APIRouter, Depends, HTTPException, status, Security
from fastapi.security.api_key import APIKeyHeader
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.party import Party
from app.models.company import Company
from app.config import settings
import logging

router = APIRouter(prefix="/api/public/uafe", tags=["uafe"])
logger = logging.getLogger(__name__)

API_KEY_HEADER = APIKeyHeader(name="X-API-Key", auto_error=False)


def verificar_api_key(api_key: str = Security(API_KEY_HEADER)):
    """Valida que el header X-API-Key sea correcto."""
    if not settings.UAFE_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Integración UAFE no configurada en este servidor."
        )
    if api_key != settings.UAFE_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API Key inválida.",
            headers={"WWW-Authenticate": "ApiKey"},
        )
    return api_key


@router.get("/consultar/{documento}")
def consultar_uafe(
    documento: str,
    db: Session = Depends(get_db),
    api_key: str = Depends(verificar_api_key),
):
    """
    Consulta datos UAFE de una persona natural o empresa por cédula o RUC.

    - 10 dígitos → busca en personas naturales (parties)
    - 13 dígitos → busca en empresas (companies)

    Requiere header: X-API-Key
    """
    documento = documento.strip()

    if not documento.isdigit():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El documento debe contener solo dígitos."
        )

    # Persona natural (cédula = 10 dígitos)
    if len(documento) == 10:
        party = db.query(Party).filter(
            Party.document_number == documento
        ).first()

        if not party:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró ninguna persona con cédula {documento}."
            )

        # Datos del cónyuge si existe
        conyugue = None
        if party.partner_document_number:
            partner = db.query(Party).filter(
                Party.document_number == party.partner_document_number
            ).first()
            if partner:
                conyugue = {
                    "cedula": partner.document_number,
                    "nombres": partner.names,
                    "apellidos": partner.last_names,
                    "genero": partner.gender.value if partner.gender else None,
                    "nacionalidad": partner.nationality,
                    "fecha_nacimiento": str(partner.birth_date) if partner.birth_date else None,
                    "ocupacion": partner.occupation,
                    "profesion": partner.profession,
                }

        return {
            "tipo": "persona_natural",
            "documento": party.document_number,
            "tipo_documento": party.document_type.value if party.document_type else "cedula",
            "nombres": party.names,
            "apellidos": party.last_names,
            "genero": party.gender.value if party.gender else None,
            "estado_civil": party.marital_status.value if party.marital_status else None,
            "nacionalidad": party.nationality,
            "fecha_nacimiento": str(party.birth_date) if party.birth_date else None,
            "email": party.email,
            "telefono": party.phone,
            "provincia": party.province,
            "canton": party.canton,
            "parroquia": party.parroquia,
            "sector": party.sector,
            "calle_principal": party.main_street,
            "calle_secundaria": party.secondary_street,
            "numero_casa": party.number_street,
            "ocupacion": party.occupation,
            "profesion": party.profession,
            "conyugue": conyugue,
            # Datos UAFE
            "uafe": {
                "actividad_economica": party.actividad_economica.value if party.actividad_economica else None,
                "empresa_trabajo": party.empresa_trabajo,
                "ingreso_mensual": float(party.ingreso_mensual) if party.ingreso_mensual else None,
                "origen_fondos": party.origen_fondos,
                "es_pep": party.es_pep,
                "es_pep_indirecto": party.es_pep_indirecto,
                "pep_nombre": party.pep_nombre,
                "pep_institucion": party.pep_institucion,
                "pep_cargo": party.pep_cargo,
                "pep_fecha_inicio": str(party.pep_fecha_inicio) if party.pep_fecha_inicio else None,
                "pep_anios_trabajo": party.pep_anios_trabajo,
                "pep_grado_relacion": party.pep_grado_relacion,
                "pep_relacion_tipo": party.pep_relacion_tipo,
                "pep_ya_no_ejerce": party.pep_ya_no_ejerce,
                "pep_fecha_fin": str(party.pep_fecha_fin) if party.pep_fecha_fin else None,
                "situacion_patrimonial": party.patrimonio,
                "rol_tramite": party.rol_tramite,
                "calidad_participacion": party.calidad_participacion,
                "conyugue_comparece": party.conyugue_comparece,
                "razon_exclusion_conyugue": party.razon_exclusion_conyugue,
            }
        }

    # Empresa (RUC = 13 dígitos)
    elif len(documento) == 13:
        company = db.query(Company).filter(
            Company.ruc == documento
        ).first()

        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró ninguna empresa con RUC {documento}."
            )

        return {
            "tipo": "persona_juridica",
            "ruc": company.ruc,
            "razon_social": company.razon_social,
            "email": company.email,
            "telefono": company.phone,
            "provincia": company.province,
            "canton": company.canton,
            "parroquia": company.parroquia,
            "sector": company.sector,
            "calle_principal": company.main_street,
            "calle_secundaria": company.secondary_street,
            "numero": company.number_street,
            # Financiero empresa
            "uafe_empresa": {
                "ingreso_mensual": float(company.ingreso_mensual) if company.ingreso_mensual else None,
                "egreso_mensual": float(company.egreso_mensual) if company.egreso_mensual else None,
                "actividad_economica": company.actividad_empresa,
                "rol_tramite": company.rol_tramite,
                "origen_fondos": company.origen_fondos,
            },
            # Socios / accionistas
            "socios": {
                "controlada_supercias": company.controlada_supercias,
                "listado": company.socios or [],
                "referencia_supercias": company.referencia_supercias,
                "tiene_anexo": bool(company.anexo_socios_path),
            },
            # Representante legal
            "representante_legal": {
                "cedula": company.rep_document_number,
                "nombres": company.rep_names,
                "apellidos": company.rep_last_names,
                "genero": company.rep_gender,
                "nacionalidad": company.rep_nationality,
                "fecha_nacimiento": str(company.rep_birth_date) if company.rep_birth_date else None,
                "cargo": company.rep_position,
                "ocupacion": company.rep_occupation,
                "profesion": company.rep_profession,
                "email": company.rep_email,
                "telefono": company.rep_phone,
                "provincia": company.rep_province,
                "canton": company.rep_canton,
                "parroquia": company.rep_parroquia,
                "calle_principal": company.rep_main_street,
                "calle_secundaria": company.rep_secondary_street,
                "numero": company.rep_number_street,
                # UAFE representante
                "uafe": {
                    "actividad_economica": company.rep_actividad_economica,
                    "empresa_trabajo": company.rep_empresa_trabajo,
                    "ingreso_mensual": float(company.rep_ingreso_mensual) if company.rep_ingreso_mensual else None,
                    "origen_fondos": company.rep_origen_fondos,
                    "es_pep": company.rep_es_pep,
                    "pep_nombre": company.rep_pep_nombre,
                    "pep_institucion": company.rep_pep_institucion,
                    "pep_cargo": company.rep_pep_cargo,
                    "pep_fecha_inicio": company.rep_pep_fecha_inicio,
                    "pep_anios_trabajo": company.rep_pep_anios_trabajo,
                    "pep_grado_relacion": company.rep_pep_grado_relacion,
                    "es_pep_indirecto": company.rep_es_pep_indirecto,
                    "pep_relacion_tipo": company.rep_pep_relacion_tipo,
                    "pep_ya_no_ejerce": company.rep_pep_ya_no_ejerce,
                    "pep_fecha_fin": company.rep_pep_fecha_fin,
                    "situacion_patrimonial": company.rep_patrimonio,
                    "rol_tramite": company.rep_rol_tramite,
                }
            }
        }

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El documento debe tener 10 dígitos (cédula) o 13 dígitos (RUC)."
        )