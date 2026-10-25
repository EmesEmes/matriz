from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.system_user import SystemUser
from app.utils.auth import decode_access_token

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> SystemUser:
    """
    Middleware para verificar que el usuario esté autenticado
    Obtiene el usuario actual desde el token
    """
    token = credentials.credentials
    
    # Verificar el token
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Token inválido o expirado"
        )
    
    username = payload.get("sub")
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Token inválido"
        )
    
    # Buscar usuario en BD
    user = db.query(SystemUser).filter(SystemUser.username == username).first()
    if user is None or not user.activo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no válido"
        )
    
    return user

def require_role(*allowed_roles: str):
    """
    Middleware para verificar roles específicos
    Uso: current_user = Depends(require_role("admin", "notaria"))
    """
    def role_checker(current_user: SystemUser = Depends(get_current_user)) -> SystemUser:
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario no autenticado"
            )
        
        if current_user.rol.value not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos para acceder a este recurso"
            )
        return current_user
    
    return role_checker

def is_admin(current_user: SystemUser = Depends(get_current_user)) -> SystemUser:
    """
    Middleware para verificar que solo admin pueda acceder
    Uso: current_user = Depends(is_admin)
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no autenticado"
        )
    
    if current_user.rol.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo administradores pueden acceder a este recurso"
        )
    
    return current_user

def block_lexdata_access(current_user: SystemUser = Depends(get_current_user)) -> SystemUser:
    """
    Middleware para bloquear acceso a notaria en módulo Lexdata
    Lexdata: solo para admin y lexdata
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no autenticado"
        )
    
    if current_user.rol.value == "notaria":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes acceso al módulo Lexdata"
        )
    
    return current_user