from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base
from app.models.enums import (  # noqa: F401  (EstadoRepresentacion se re-exporta)
    CalidadParticipacion,
    EstadoRepresentacion,
    enum_column_type,
)


class Representacion(Base):
    """
    Relación entre un representante (apoderado/mandatario) y un representado
    (poderdante/mandante), registrada a través del formulario público.
    """
    __tablename__ = "representaciones"

    id = Column(Integer, primary_key=True, autoincrement=True)

    representante_id = Column(Integer, ForeignKey("parties.id", ondelete="CASCADE"), nullable=False, index=True)
    representado_id = Column(Integer, ForeignKey("parties.id", ondelete="CASCADE"), nullable=False, index=True)

    # Si el representado también es cónyuge del representante (caso "propios_y_representando")
    es_conyugue = Column(Boolean, default=False, server_default="0", nullable=False)

    calidad_participacion = Column(
        enum_column_type(CalidadParticipacion, "calidad_participacion_rep"), nullable=True
    )

    # Link del formulario público que originó esta representación
    registration_token_id = Column(
        Integer, ForeignKey("registration_tokens.id", ondelete="SET NULL"), nullable=True
    )

    estado = Column(
        enum_column_type(EstadoRepresentacion, "estado_representacion"),
        default=EstadoRepresentacion.pendiente,
        server_default=EstadoRepresentacion.pendiente.value,
        nullable=False,
    )

    creado_en = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    actualizado_en = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    representante = relationship("Party", foreign_keys=[representante_id])
    representado = relationship("Party", foreign_keys=[representado_id])