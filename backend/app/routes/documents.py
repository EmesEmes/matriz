from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.system_user import SystemUser
from app.models.document import Document
from app.schemas.document import GenerateMatrizRequest, GenerateMatrizResponse
from app.middleware.auth import get_current_user
from app.services.document_generator import generate_matriz_compraventa
import os

router = APIRouter(prefix="/api/documents", tags=["documents"])

@router.post("/generate-matriz", response_model=GenerateMatrizResponse)
def generate_matriz(
    request: GenerateMatrizRequest,
    db: Session = Depends(get_db),
    current_user: SystemUser = Depends(get_current_user)
):
    """
    Genera matriz de compraventa
    """
    try:
        # Preparar datos para docxtpl (mismo formato que usabas en frontend)
        datos_para_docx = {
            "numeroProtocolo": request.numero_protocolo,
            "tipoContrato": request.tipo_contrato.upper(),
            "cuantia": request.cuantia,
            "fechaActual": request.fecha_escritura,
            "notario": request.notario.nombre,
            "tituloNotario": request.notario.titulo,
            "matrizador": request.matrizador,
            "isAnyTerceraEdad": request.is_any_tercera_edad,
            
            # Concuerdo
            "needsConcuerdo": request.needs_concuerdo,
            "datosConcuerdo": request.datos_concuerdo.dict() if request.datos_concuerdo else None,
            
            # Abogado
            "abogadoNombre": request.abogado.nombre_abogado,
            "abogadoNumeroMatricula": request.abogado.numero_matricula,
            "abogadoTipoMatricula": request.abogado.tipo_matricula,
            "abogadoProvincia": request.abogado.provincia_abogado,
            "abogadoEsMujer": request.abogado.genero_abogado.lower() == "femenino",
            "abogadoTexto": request.abogado.minuta_texto,
            
            # Participantes
            "participantesList": request.participantes_list,
            "vendedoresList": request.vendedores_list,
            "compradoresList": request.compradores_list,
        }
        
        # Generar documento
        file_path = generate_matriz_compraventa(datos_para_docx)
        
        # Guardar registro en BD
        document = Document(
            document_type=request.tipo_contrato,
            protocol_number=request.numero_protocolo,
            amount=request.cuantia,
            generated_by=current_user.id,
            notario=request.notario.nombre,
            matrizador=request.matrizador,
            parties_data={
                "vendedores": [v.cedula if hasattr(v, 'cedula') else v.get('cedula') for v in request.vendedores_list],
                "compradores": [c.cedula if hasattr(c, 'cedula') else c.get('cedula') for c in request.compradores_list]
            },
            file_path=file_path
        )
        
        db.add(document)
        db.commit()
        db.refresh(document)
        
        return {
            "message": "Documento generado exitosamente",
            "document_id": document.id,
            "protocol_number": request.numero_protocolo,
            "download_url": f"/api/documents/download/{document.id}"
        }
        
    except Exception as e:
        print(f"Error generando documento: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al generar documento: {str(e)}"
        )

@router.get("/download/{document_id}")
def download_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: SystemUser = Depends(get_current_user)
):
    """
    Descargar documento generado
    """
    document = db.query(Document).filter(Document.id == document_id).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Documento no encontrado"
        )
    
    if not os.path.exists(document.file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archivo no encontrado en el servidor"
        )
    
    filename = f"matriz_{document.protocol_number}.docx"
    
    return FileResponse(
        document.file_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename=filename
    )