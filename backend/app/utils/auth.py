from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import settings

# Contexto mejorado para bcrypt
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12
)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica que el password coincida con el hash"""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        print(f"Error verificando password: {e}")
        return False

def get_password_hash(password: str) -> str:
    """Hashea un password"""
    try:
        return pwd_context.hash(password)
    except Exception as e:
        print(f"Error hasheando password: {e}")
        raise

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Crea un token JWT"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """Decodifica un token JWT"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None