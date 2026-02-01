from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class LawyerData(BaseModel):
    nombre_abogado: str
    genero_abogado: str
    tipo_matricula: str
    provincia_abogado: Optional[str] = None
    numero_matricula: str
    minuta_texto: str

class NotarioData(BaseModel):
    nombre: str
    titulo: str

class ConcuerdoData(BaseModel):
    numero_protocolo: str
    names: str
    last_names: str
    document_number: str
    fecha: str

class ParticipanteExtended(BaseModel):
    """Datos extendidos de participante con opciones especiales"""
    cedula: str
    nombres: str
    apellidos: str
    genero: str
    estadoCivil: str
    nacionalidad: str
    fechaNacimiento: str
    email: Optional[str] = None
    telefono: Optional[str] = None
    provincia: str
    canton: str
    parroquia: str
    sector: Optional[str] = None
    callePrincipal: str
    calleSecundaria: Optional[str] = None
    numeroCalle: Optional[str] = None
    ocupacion: str
    profesion: Optional[str] = None
    conyuge: Optional[Dict[str, Any]] = None
    
    # Opciones especiales (no se guardan en BD)
    needsInterpreter: bool = False
    nombreInterprete: Optional[str] = None
    generoInterprete: Optional[str] = None
    cedulaInterprete: Optional[str] = None
    idiomaInterprete: Optional[str] = None
    isNoVidente: bool = False
    personaConfianzaNoVidente: Optional[str] = None
    isAnalfabeta: bool = False
    personaConfianzaAnalfabeta: Optional[str] = None
    hasDiscapacidadIntelectual: bool = False
    tipoDiscapacidad: Optional[str] = None
    razonExclusionConyugue: Optional[str] = None

class GenerateMatrizRequest(BaseModel):
    # Datos administrativos
    numero_protocolo: str
    tipo_contrato: str
    cuantia: float
    fecha_escritura: str
    notario: NotarioData
    matrizador: str
    
    # Concuerdo (opcional)
    needs_concuerdo: bool = False
    datos_concuerdo: Optional[ConcuerdoData] = None
    
    # Participantes con datos extendidos
    participantes_list: List[ParticipanteExtended]
    vendedores_list: List[ParticipanteExtended]
    compradores_list: List[ParticipanteExtended]
    
    # Abogado y minuta
    abogado: LawyerData
    
    # Flags
    is_any_tercera_edad: bool = False

class GenerateMatrizResponse(BaseModel):
    message: str
    document_id: int
    protocol_number: str
    download_url: str