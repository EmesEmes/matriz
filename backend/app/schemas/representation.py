from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class RepresentacionResponse(BaseModel):
    """Relación representante -> representado"""
    id: int
    representante_document_number: str
    representado_document_number: str
    es_conyugue: bool
    calidad_participacion: Optional[str]
    estado: str
    creado_en: datetime