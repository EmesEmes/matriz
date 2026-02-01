from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, users, parties, documents  # Agregar documents

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema Notarial API",
    description="API para generación de matrices y minutas notariales",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar rutas
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(parties.router)
app.include_router(documents.router)  # Nueva línea

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