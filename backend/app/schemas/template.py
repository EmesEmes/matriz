from pydantic import BaseModel
from typing import Any, Dict, Optional
from datetime import datetime


class TemplateCreate(BaseModel):
    nombre: str
    nombre_vendedor: str
    tipo_contrato: str
    tipo_documento: str
    contenido: Dict[str, Any]


class TemplateResponse(BaseModel):
    id: int
    nombre: str
    nombre_vendedor: str
    tipo_contrato: str
    tipo_documento: str
    contenido: Dict[str, Any]
    creado_por: int
    creado_at: datetime

    class Config:
        from_attributes = True


class TemplateSearchResult(BaseModel):
    """Respuesta simplificada para el buscador — sin contenido completo"""
    id: int
    nombre: str
    nombre_vendedor: str
    tipo_contrato: str
    tipo_documento: str
    creado_at: datetime

    class Config:
        from_attributes = True