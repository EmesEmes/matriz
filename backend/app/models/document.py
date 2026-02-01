from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Document(Base):
    """Modelo para registro de documentos generados (auditoría)"""
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    document_type = Column(String(50), nullable=False)  # compraventa, poder, etc.
    protocol_number = Column(String(50), nullable=False)
    amount = Column(Float, nullable=True)  # cuantía
    
    # Usuario que generó
    generated_by = Column(Integer, ForeignKey('system_users.id'), nullable=False)
    
    # Metadatos
    notario = Column(String(200), nullable=True)
    matrizador = Column(String(100), nullable=True)
    
    # Participantes (JSON con IDs)
    parties_data = Column(JSON, nullable=True)
    
    # Archivo
    file_path = Column(String(500), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())