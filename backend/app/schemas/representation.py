from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RepresentacionResponse(BaseModel):
    """Representación de una relación representante -> representado"""
    id: str
    representante_document_number: str
    representado_document_number: str
    es_conyugue: bool
    calidad_participacion: Optional[str]
    estado: str
    minuta_id: Optional[str]
    creado_en: datetime

    class Config:
        from_attributes = True


class RepresentacionConDatos(BaseModel):
    """Representación incluyendo nombre del representado, para mostrar en ComparecienteInline"""
    id: str
    representado_document_number: str
    representado_nombre: str
    es_conyugue: bool
    estado: str

    class Config:
        from_attributes = True