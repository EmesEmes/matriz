from app.database import SessionLocal
from app.models.system_user import SystemUser, UserRole
from app.utils.auth import get_password_hash

def create_admin():
    db = SessionLocal()
    
    try:
        # Verificar si ya existe un admin
        existing_admin = db.query(SystemUser).filter(
            SystemUser.username == "admin"
        ).first()
        
        if existing_admin:
            print("❌ Ya existe un usuario admin")
            return
        
        # Crear usuario admin
        admin_user = SystemUser(
            nombre="Administrador",
            username="admin",
            password=get_password_hash("admin123"),  # Cambiar en producción
            rol=UserRole.admin,
            iniciales="A.M.V",
            activo=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("✅ Usuario admin creado exitosamente")
        print(f"   Username: admin")
        print(f"   Password: admin123")
        print("   ⚠️  IMPORTANTE: Cambia este password en producción")
        
    except Exception as e:
        print(f"❌ Error al crear admin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()