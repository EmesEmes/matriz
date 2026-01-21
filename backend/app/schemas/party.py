from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional
from datetime import date

class PartyBase(BaseModel):
    """Schema base para comparecientes"""
    document_number: str = Field(..., min_length=10, max_length=13, description="Número de cédula o pasaporte")
    names: str = Field(..., min_length=2, max_length=100, description="Nombres")
    last_names: str = Field(..., min_length=2, max_length=100, description="Apellidos")
    document_type: str = Field(..., pattern="^(cedula|pasaporte)$")
    gender: str = Field(..., pattern="^(masculino|femenino)$")
    marital_status: str = Field(..., pattern="^(soltero|casado|divorciado|viudo)$")
    partner_document_number: Optional[str] = Field(None, min_length=10, max_length=13)
    nationality: str = Field(..., min_length=2, max_length=50)
    birth_date: date
    email: EmailStr
    phone: str = Field(..., min_length=9, max_length=15)
    province: str = Field(..., min_length=2, max_length=50)
    canton: str = Field(..., min_length=2, max_length=50)
    parroquia: str = Field(..., min_length=2, max_length=50)
    sector: Optional[str] = Field(None, max_length=100)
    main_street: str = Field(..., min_length=2, max_length=150)
    secondary_street: str = Field(..., min_length=2, max_length=150)
    number_street: str = Field(..., min_length=1, max_length=20)
    occupation: str = Field(..., min_length=2, max_length=100)
    profession: Optional[str] = Field(None, max_length=100)
    
    @field_validator('document_number')
    @classmethod
    def validate_document_number(cls, v, info):
        """Validar formato de cédula ecuatoriana"""
        document_type = info.data.get('document_type')
        
        if document_type == 'cedula':
            # Cédula ecuatoriana: 10 dígitos
            if not v.isdigit() or len(v) != 10:
                raise ValueError('Cédula ecuatoriana debe tener 10 dígitos')
            
            # Validar que los dos primeros dígitos sean provincia válida (01-24)
            provincia = int(v[:2])
            if provincia < 1 or provincia > 24:
                raise ValueError('Código de provincia inválido en cédula')
        
        elif document_type == 'pasaporte':
            # Pasaporte: alfanumérico, 6-13 caracteres
            if len(v) < 6 or len(v) > 13:
                raise ValueError('Pasaporte debe tener entre 6 y 13 caracteres')
        
        return v.upper()
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v):
        """Validar teléfono ecuatoriano"""
        # Remover espacios y guiones
        v = v.replace(' ', '').replace('-', '')
        
        # Debe ser numérico
        if not v.isdigit():
            raise ValueError('Teléfono debe contener solo números')
        
        # Teléfonos Ecuador: 9-10 dígitos (09xxxxxxxx o 02xxxxxxx)
        if len(v) not in [9, 10]:
            raise ValueError('Teléfono debe tener 9 o 10 dígitos')
        
        return v
    
    @field_validator('partner_document_number')
    @classmethod
    def validate_partner(cls, v, info):
        """Validar cónyuge solo si es casado"""
        marital_status = info.data.get('marital_status')
        
        if marital_status == 'casado' and not v:
            raise ValueError('Debe proporcionar documento del cónyuge para estado civil casado')
        
        if marital_status != 'casado' and v:
            raise ValueError('Solo puede tener cónyuge si el estado civil es casado')
        
        return v

class PartyCreate(PartyBase):
    """Schema para crear compareciente"""
    pass

class PartyUpdate(BaseModel):
    """Schema para actualizar compareciente (todos los campos opcionales)"""
    names: Optional[str] = Field(None, min_length=2, max_length=100)
    last_names: Optional[str] = Field(None, min_length=2, max_length=100)
    document_type: Optional[str] = Field(None, pattern="^(cedula|pasaporte)$")
    gender: Optional[str] = Field(None, pattern="^(masculino|femenino)$")
    marital_status: Optional[str] = Field(None, pattern="^(soltero|casado|divorciado|viudo)$")
    partner_document_number: Optional[str] = None
    nationality: Optional[str] = None
    birth_date: Optional[date] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    province: Optional[str] = None
    canton: Optional[str] = None
    parroquia: Optional[str] = None
    sector: Optional[str] = None
    main_street: Optional[str] = None
    secondary_street: Optional[str] = None
    number_street: Optional[str] = None
    occupation: Optional[str] = None
    profession: Optional[str] = None

class PartyResponse(PartyBase):
    """Schema para respuesta"""
    
    class Config:
        from_attributes = True

class PartyWithPartner(PartyResponse):
    """Schema con información del cónyuge"""
    partner: Optional[PartyResponse] = None
    
    class Config:
        from_attributes = True