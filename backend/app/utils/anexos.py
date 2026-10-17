"""
Manejo de anexos subidos desde el formulario público (ej. listado de socios
de la Superintendencia de Compañías).

Los archivos se guardan fuera de cualquier carpeta servida públicamente y solo
se pueden descargar desde un endpoint que requiere login.
"""
import base64
import binascii
import uuid
from pathlib import Path

from fastapi import HTTPException

UPLOADS_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
ANEXOS_SOCIOS_DIR = UPLOADS_DIR / "anexos_socios"

MAX_BYTES = 5 * 1024 * 1024  # 5 MB


def guardar_anexo_pdf(contenido_base64: str, nombre_original: str, ruc: str) -> tuple[str, str]:
    """
    Decodifica un PDF enviado como base64, lo valida y lo guarda en disco.

    Retorna (ruta_absoluta, nombre_original_limpio).
    Lanza HTTPException 400 si el archivo no es un PDF válido o excede el tamaño.
    """
    if "," in contenido_base64 and contenido_base64.strip().startswith("data:"):
        # Viene como data URL: "data:application/pdf;base64,JVBERi0..."
        contenido_base64 = contenido_base64.split(",", 1)[1]

    try:
        datos = base64.b64decode(contenido_base64, validate=True)
    except (binascii.Error, ValueError):
        raise HTTPException(status_code=400, detail="El anexo de socios no se pudo leer. Intente adjuntarlo de nuevo.")

    if len(datos) > MAX_BYTES:
        raise HTTPException(status_code=400, detail="El anexo de socios supera el tamaño máximo de 5 MB.")

    if not datos.startswith(b"%PDF"):
        raise HTTPException(status_code=400, detail="El anexo de socios debe ser un archivo PDF.")

    ANEXOS_SOCIOS_DIR.mkdir(parents=True, exist_ok=True)

    ruc_limpio = "".join(c for c in ruc if c.isdigit())[:13] or "sin_ruc"
    destino = ANEXOS_SOCIOS_DIR / f"{ruc_limpio}_{uuid.uuid4().hex[:8]}.pdf"
    destino.write_bytes(datos)

    nombre = Path(nombre_original or "listado_socios.pdf").name[:200]
    return str(destino), nombre