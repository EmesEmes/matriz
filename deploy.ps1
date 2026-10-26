# deploy.ps1 - Despliegue de Matriz en Windows Server
#
# Uso:  .\deploy.ps1
#
# Hace, en orden: respaldo de la base, actualizar codigo, dependencias,
# migraciones, build del frontend, reinicio del servicio y verificacion.
# Si algo falla, se detiene y lo dice; no deja el sistema a medias en silencio.

$ErrorActionPreference = "Stop"

# --- Rutas. Ajustar solo si la instalacion no esta en C:\matriz ---
$RAIZ      = "C:\matriz"
$BACKEND   = "$RAIZ\backend"
$FRONTEND  = "$RAIZ\frontend"
$RESPALDOS = "$RAIZ\respaldos"
$SERVICIO  = "MatrizBackend"
$MARIADB   = "C:\Program Files\MariaDB 10.11\bin"

function Paso($texto) { Write-Host "`n==> $texto" -ForegroundColor Cyan }

# --- Leer el .env del backend: es la unica fuente de verdad ---
Paso "Leyendo configuracion"
$env_vars = @{}
Get-Content "$BACKEND\.env" | ForEach-Object {
    if ($_ -match '^\s*([^#=]+?)\s*=\s*(.*)$') {
        $env_vars[$matches[1].Trim()] = $matches[2].Trim()
    }
}
$DB_NAME = $env_vars["DB_NAME"]
$DB_USER = $env_vars["DB_USER"]
$DB_PASS = $env_vars["DB_PASSWORD"]
$API_URL = $env_vars["FRONTEND_URL"]

if (-not $API_URL) { throw "FRONTEND_URL no esta definido en el .env" }
Write-Host "   Dominio: $API_URL"

# --- 1. Respaldo ANTES de tocar nada ---
Paso "Respaldando la base de datos"
New-Item -ItemType Directory -Force -Path $RESPALDOS | Out-Null
$fecha = Get-Date -Format "yyyy-MM-dd-HHmm"
$dump  = "$RESPALDOS\$DB_NAME-$fecha.sql"

& "$MARIADB\mariadb-dump.exe" -u $DB_USER -p"$DB_PASS" --single-transaction $DB_NAME |
    Out-File -FilePath $dump -Encoding utf8
if ($LASTEXITCODE -ne 0) { throw "El respaldo fallo. Se detiene el despliegue." }
Write-Host "   $dump"

# Conservar solo los ultimos 30 dias
Get-ChildItem $RESPALDOS -Filter "*.sql" |
    Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } |
    Remove-Item -Force

# --- 2. Codigo ---
Paso "Actualizando el codigo"
Set-Location $RAIZ
$antes = git rev-parse HEAD
git fetch origin main
git reset --hard origin/main
$despues = git rev-parse HEAD

if ($antes -eq $despues) {
    Write-Host "   Sin cambios nuevos ($($antes.Substring(0,7)))"
} else {
    Write-Host "   $($antes.Substring(0,7)) -> $($despues.Substring(0,7))"
}

# --- 3. Dependencias del backend ---
Paso "Dependencias de Python"
Set-Location $BACKEND
& "$BACKEND\venv\Scripts\python.exe" -m pip install -q -r requirements.txt
if ($LASTEXITCODE -ne 0) { throw "pip install fallo" }

# --- 4. Migraciones, si el proyecto ya usa Alembic ---
if (Test-Path "$BACKEND\alembic.ini") {
    Paso "Aplicando migraciones"
    & "$BACKEND\venv\Scripts\alembic.exe" upgrade head
    if ($LASTEXITCODE -ne 0) { throw "La migracion fallo. La base quedo respaldada en $dump" }
} else {
    Write-Host "`n==> Sin Alembic todavia; las tablas las crea el backend al arrancar" -ForegroundColor DarkGray
}

# --- 5. Frontend ---
Paso "Construyendo el frontend"
Set-Location $FRONTEND
npm ci --silent
if ($LASTEXITCODE -ne 0) { throw "npm ci fallo" }

$env:VITE_API_URL = $API_URL
npm run build
if ($LASTEXITCODE -ne 0) { throw "El build del frontend fallo" }

# --- 6. Reiniciar el backend ---
Paso "Reiniciando el servicio"
Restart-Service $SERVICIO
Start-Sleep -Seconds 3

# --- 7. Verificar que quedo respondiendo ---
Paso "Verificando"
$ok = $false
foreach ($intento in 1..20) {
    try {
        $r = Invoke-WebRequest "http://127.0.0.1:8000/health" -UseBasicParsing -TimeoutSec 5
        if ($r.StatusCode -eq 200) { $ok = $true; break }
    } catch {
        Start-Sleep -Seconds 3
    }
}

if (-not $ok) {
    Write-Host "`nEl backend no respondio. Ultimas lineas del log:" -ForegroundColor Red
    Get-Content "$RAIZ\logs\matriz-backend.err.log" -Tail 30 -ErrorAction SilentlyContinue
    throw "Despliegue fallido: el backend no responde en /health"
}

Write-Host "`nDespliegue completo. Version $($despues.Substring(0,7)) en $API_URL" -ForegroundColor Green