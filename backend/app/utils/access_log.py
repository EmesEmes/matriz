from sqlalchemy.orm import Session
from app.models.access_log import AccessLog
import uuid


def registrar_acceso(
    db: Session,
    usuario: str,
    accion: str,
    entidad: str,
    entidad_id: str,
    ip_address: str = None,
):
    """
    Registra un acceso a datos personales en el log.

    Acciones posibles:
    - ver: consulta de datos
    - crear: nuevo registro
    - actualizar: modificación de datos
    - eliminar: borrado de datos
    - registro_publico: cliente se registró via link público
    """
    try:
        log = AccessLog(
            id=str(uuid.uuid4()),
            usuario=usuario,
            accion=accion,
            entidad=entidad,
            entidad_id=entidad_id,
            ip_address=ip_address,
        )
        db.add(log)
        db.flush()  # flush sin commit — el commit lo hace el endpoint
    except Exception:
        pass  # El log nunca debe romper la operación principal