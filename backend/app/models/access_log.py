from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from app.database import Base


class AccessLog(Base):
    """Log de acceso a datos personales — cumplimiento LOPDP"""
    __tablename__ = "access_logs"

    id = Column(String(36), primary_key=True)
    usuario = Column(String(100), nullable=False)
    accion = Column(String(20), nullable=False)
    entidad = Column(String(50), nullable=False)
    entidad_id = Column(String(50), nullable=False)
    ip_address = Column(String(45), nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())