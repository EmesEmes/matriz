from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, users, parties

# Crear tablas en la base de datos
Base.metadata.create_all(bind=engine)

# Crear aplicación FastAPI
app = FastAPI(
    title="Sistema Notarial API",
    description="API para generación de matrices y minutas notariales",
    version="1.0.0"
)

# Configurar CORS (para que tu frontend React pueda conectarse)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Puertos comunes de React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar rutas
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(parties.router)

# Ruta de prueba
@app.get("/")
def root():
    return {
        "message": "API Sistema Notarial",
        "status": "active",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}