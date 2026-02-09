from sqlalchemy import Column, Integer, String, DateTime, Text, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base

class MinuteType(enum.Enum):
    COMPRAVENTA_INMUEBLE = "compraventa_inmueble"
    PODERES = "poderes"

class Minute(Base):
    __tablename__ = "minutes"

    id = Column(Integer, primary_key=True, index=True)
    minute_type = Column(SQLEnum(MinuteType), nullable=False)
    contract_data = Column(Text, nullable=False)  # JSON stringified
    file_path = Column(String(500))
    created_by = Column(Integer, ForeignKey("system_users.id"), nullable=False)  # Cambio aquí
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    creator = relationship("SystemUser", back_populates="minutes")  # Cambio aquí