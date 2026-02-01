from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database import get_db
from app.models.system_user import SystemUser
from app.schemas.system_user import (
    LoginRequest, 
    LoginResponse, 
    VerifyResponse,
    UserData
)
from app.utils.auth import verify_password, create_access_token
from app.middleware.auth import get_current_user
from app.config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=LoginResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    POST /api/auth/login - Login de usuario
    Devuelve: { message, token, user: {id, nombre, username, rol, iniciales} }
    """
    
    # Validar que vengan los datos (FastAPI ya valida, pero por consistencia)
    if not login_data.username or not login_data.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username y password son requeridos"
        )
    
    # Buscar el usuario
    user = db.query(SystemUser).filter(
        SystemUser.username == login_data.username
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas"
        )
    
    # Verificar si el usuario está activo
    if not user.activo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario inactivo"
        )
    
    # Verificar la contraseña
    if not verify_password(login_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas"
        )
    
    # Crear el token JWT
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={
            "sub": user.username,
            "id": user.id,
            "username": user.username,
            "rol": user.rol.value
        },
        expires_delta=access_token_expires
    )
    
    # Retornar datos del usuario (sin password) y el token
    return {
        "message": "Login exitoso",
        "token": token,
        "user": {
            "id": user.id,
            "nombre": user.nombre,
            "username": user.username,
            "rol": user.rol.value,
            "iniciales": user.iniciales
        }
    }

@router.get("/verify", response_model=VerifyResponse)
def verify_token(
    current_user: SystemUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    GET /api/auth/verify - Verificar token válido
    El usuario ya viene del middleware de autenticación
    """
    
    # Buscar usuario actualizado en BD
    user = db.query(SystemUser).filter(
        SystemUser.id == current_user.id
    ).first()
    
    if not user or not user.activo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no válido"
        )
    
    return {
        "user": {
            "id": user.id,
            "nombre": user.nombre,
            "username": user.username,
            "rol": user.rol.value,
            "iniciales": user.iniciales
        }
    }

@router.post("/logout")
def logout():
    """
    POST /api/auth/logout - Logout (opcional)
    Principalmente para limpiar en el frontend
    """
    return {"message": "Logout exitoso"}