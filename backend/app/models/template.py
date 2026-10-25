from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Template(Base):
    """Modelo para plantillas de formularios reutilizables"""
    __tablename__ = "templates"

    id = Column(Integer, primary_key=True, autoincrement=True)

    # Identificación
    nombre = Column(String(200), nullable=False)          # Nombre del proyecto ej: "Torre Amazonas Piso 3"
    nombre_vendedor = Column(String(300), nullable=False) # Extraído automático del primer vendedor

    # Tipo
    tipo_contrato = Column(String(50), nullable=False)    # 'compraventa', 'promesa', 'poder'
    tipo_documento = Column(String(20), nullable=False)   # 'minuta', 'matriz'

    # Contenido completo del formulario
    contenido = Column(JSON, nullable=False)

    # Usuario que la creó
    creado_por = Column(Integer, ForeignKey('system_users.id'), nullable=False)

    # Timestamps
    creado_at = Column(DateTime(timezone=True), server_default=func.now())