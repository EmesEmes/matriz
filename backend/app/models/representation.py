from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid
import enum


class EstadoRepresentacion(enum.Enum):
    pendiente = "pendiente"
    utilizada = "utilizada"
    expirada = "expirada"


class Representacion(Base):
    """
    Relación entre un representante (apoderado/mandatario) y un representado
    (poderdante/mandante), registrada a través del formulario público.
    """
    __tablename__ = "representaciones"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    representante_document_number = Column(
        String(20),
        ForeignKey("parties.document_number"),
        nullable=False
    )
    representado_document_number = Column(
        String(20),
        ForeignKey("parties.document_number"),
        nullable=False
    )

    # Si el representado también es cónyuge del representante (caso "propios_y_representando")
    es_conyugue = Column(Boolean, default=False, nullable=False)

    # Calidad con la que el representante participó en el trámite que originó esta representación
    calidad_participacion = Column(String(30), nullable=True)

    # Token del registro público que generó esta representación
    token = Column(
        String(36),
        ForeignKey("registration_tokens.token"),
        nullable=True
    )

    estado = Column(SQLEnum(EstadoRepresentacion), default=EstadoRepresentacion.pendiente, nullable=False)

    # Cuando se usa esta representación para generar una minuta, se guarda su id (FK definida a futuro)
    minuta_id = Column(String(36), nullable=True)

    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())

    representante = relationship("Party", foreign_keys=[representante_document_number])
    representado = relationship("Party", foreign_keys=[representado_document_number])