from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base
import uuid


class RegistrationToken(Base):
    """Token único para que clientes registren sus datos sin login"""
    __tablename__ = "registration_tokens"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    token = Column(String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    usado = Column(Boolean, default=False, nullable=False)
    party_document_number = Column(
        String(20),
        ForeignKey('parties.document_number'),
        nullable=True  # Se llena cuando el cliente guarda sus datos
    )
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    expira_en = Column(DateTime(timezone=True), nullable=False)
    creado_por = Column(String(50), nullable=True)  # username del empleado que generó el token