from sqlalchemy import Column, String, DateTime, Enum as SQLEnum, Numeric, Boolean, Integer, Text, JSON
from sqlalchemy.sql import func
from app.database import Base
import enum


class DocumentType(enum.Enum):
    cedula = "cedula"
    pasaporte = "pasaporte"


class Gender(enum.Enum):
    masculino = "masculino"
    femenino = "femenino"


class Company(Base):
    """Modelo para empresas que participan en actos notariales"""
    __tablename__ = "companies"

    # Identificación empresa
    ruc = Column(String(13), primary_key=True)
    razon_social = Column(String(200), nullable=False)

    # Contacto empresa
    email = Column(String(100), nullable=False)
    phone = Column(String(15), nullable=False)

    # Dirección empresa
    province = Column(String(50), nullable=False)
    canton = Column(String(50), nullable=False)
    parroquia = Column(String(50), nullable=False)
    sector = Column(String(100), nullable=False)
    main_street = Column(String(150), nullable=False)
    secondary_street = Column(String(150), nullable=False)
    number_street = Column(String(20), nullable=False)

    # Representante legal - datos propios, independiente de comparecientes
    rep_document_type = Column(SQLEnum(DocumentType), nullable=False)
    rep_document_number = Column(String(20), nullable=False)
    rep_names = Column(String(100), nullable=False)
    rep_last_names = Column(String(100), nullable=False)
    rep_gender = Column(SQLEnum(Gender), nullable=False)
    rep_nationality = Column(String(50), nullable=False)
    rep_birth_date = Column(String(10), nullable=False)  # formato YYYY-MM-DD
    rep_email = Column(String(100), nullable=False)
    rep_phone = Column(String(15), nullable=False)
    rep_province = Column(String(50), nullable=False)
    rep_canton = Column(String(50), nullable=False)
    rep_parroquia = Column(String(50), nullable=False)
    rep_sector = Column(String(100), nullable=False)
    rep_main_street = Column(String(150), nullable=False)
    rep_secondary_street = Column(String(150), nullable=False)
    rep_number_street = Column(String(20), nullable=False)
    rep_occupation = Column(String(100), nullable=False)
    rep_profession = Column(String(100), nullable=True)
    rep_position = Column(String(100), nullable=False)  # cargo

    # Financiero empresa
    ingreso_mensual = Column(Numeric(10, 2), nullable=True)
    egreso_mensual = Column(Numeric(10, 2), nullable=True)
    actividad_empresa = Column(String(200), nullable=True)  # actividad económica principal
    rol_tramite = Column(String(20), nullable=True)  # vendedor / adquirente
    origen_fondos = Column(Text, nullable=True)

    # Socios / accionistas
    controlada_supercias = Column(Boolean, nullable=True)
    socios = Column(JSON, nullable=True)  # [{nombres, tipo_documento, numero_documento, porcentaje}]
    referencia_supercias = Column(String(300), nullable=True)  # cita al listado de la Superintendencia
    anexo_socios_path = Column(String(300), nullable=True)  # ruta interna del PDF (nunca se expone)
    anexo_socios_nombre = Column(String(200), nullable=True)

    # UAFE representante legal
    rep_actividad_economica = Column(String(20), nullable=True)
    rep_empresa_trabajo = Column(String(200), nullable=True)
    rep_ingreso_mensual = Column(Numeric(10, 2), nullable=True)
    rep_rol_tramite = Column(String(20), nullable=True)
    rep_origen_fondos = Column(Text, nullable=True)
    rep_es_pep = Column(Boolean, nullable=True)
    rep_pep_nombre = Column(String(200), nullable=True)
    rep_pep_institucion = Column(String(200), nullable=True)
    rep_pep_fecha_inicio = Column(String(10), nullable=True)
    rep_pep_cargo = Column(String(200), nullable=True)
    rep_pep_anios_trabajo = Column(Integer, nullable=True)
    rep_pep_grado_relacion = Column(String(200), nullable=True)
    rep_es_pep_indirecto = Column(Boolean, nullable=True)
    rep_pep_relacion_tipo = Column(String(100), nullable=True)
    rep_pep_ya_no_ejerce = Column(Boolean, nullable=True)
    rep_pep_fecha_fin = Column(String(10), nullable=True)
    rep_patrimonio = Column(JSON, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())