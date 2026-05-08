from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TokenGenerado(BaseModel):
    """Respuesta al generar un token"""
    token: str
    link: str
    expira_en: datetime
    creado_por: str


class TokenInfo(BaseModel):
    """Info del token al verificarlo (respuesta pública)"""
    valido: bool
    mensaje: str


class RegistrationTokenResponse(BaseModel):
    """Respuesta completa del token para el empleado"""
    id: str
    token: str
    usado: bool
    party_document_number: Optional[str]
    creado_en: datetime
    expira_en: datetime
    creado_por: Optional[str]

    class Config:
        from_attributes = True