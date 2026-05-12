from sqlalchemy import Column, String, Date, Enum as SQLEnum, ForeignKey, DateTime, Numeric, Integer, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class DocumentType(enum.Enum):
    cedula = "cedula"
    pasaporte = "pasaporte"


class Gender(enum.Enum):
    masculino = "masculino"
    femenino = "femenino"


class MaritalStatus(enum.Enum):
    soltero = "soltero"
    casado = "casado"
    divorciado = "divorciado"
    viudo = "viudo"


class ActividadEconomica(enum.Enum):
    independiente = "independiente"
    empleado = "empleado"


class Party(Base):
    """Modelo para comparecientes (personas naturales)"""
    __tablename__ = "parties"

    # Identificación
    document_number = Column(String(20), primary_key=True)
    names = Column(String(100), nullable=False)
    last_names = Column(String(100), nullable=False)
    document_type = Column(SQLEnum(DocumentType), nullable=False)

    # Datos personales
    gender = Column(SQLEnum(Gender), nullable=False)
    marital_status = Column(SQLEnum(MaritalStatus), nullable=False)
    partner_document_number = Column(
        String(20),
        ForeignKey('parties.document_number'),
        nullable=True
    )
    nationality = Column(String(50), nullable=False)
    birth_date = Column(Date, nullable=False)

    # Contacto
    email = Column(String(100), nullable=False, unique=True)
    phone = Column(String(15), nullable=False)

    # Dirección
    province = Column(String(50), nullable=False)
    canton = Column(String(50), nullable=False)
    parroquia = Column(String(50), nullable=False)
    sector = Column(String(100), nullable=True)
    main_street = Column(String(150), nullable=False)
    secondary_street = Column(String(150), nullable=False)
    number_street = Column(String(20), nullable=False)

    # Ocupación
    occupation = Column(String(100), nullable=False)
    profession = Column(String(100), nullable=True)

    # Campos UAFE
    actividad_economica = Column(SQLEnum(ActividadEconomica), nullable=True)
    empresa_trabajo = Column(String(200), nullable=True)
    ingreso_mensual = Column(Numeric(10, 2), nullable=True)
    es_pep = Column(Boolean, nullable=True)

    # Detalle PEP
    pep_nombre = Column(String(200), nullable=True)
    pep_institucion = Column(String(200), nullable=True)
    pep_fecha_inicio = Column(Date, nullable=True)
    pep_cargo = Column(String(200), nullable=True)
    pep_anios_trabajo = Column(Integer, nullable=True)
    pep_grado_relacion = Column(String(200), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relaciones
    partner = relationship(
        "Party",
        foreign_keys=[partner_document_number],
        remote_side="Party.document_number",
        backref="spouse_of"
    )