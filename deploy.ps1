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

# PowerShell no detiene el script cuando falla un programa externo (git, npm,
# pip): solo lo hace con sus propios errores. Esta funcion revisa el codigo de
# salida a mano. Sin ella, un git que falla pasa desapercibido y el despliegue
# sigue con codigo viejo reportando exito.
function Verificar($queHacia) {
    if ($LASTEXITCODE -ne 0) { throw "Fallo al $queHacia (codigo $LASTEXITCODE)" }
}

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

# Se redirige por cmd a proposito: Out-File de PowerShell 5.1 escribe un BOM
# al inicio del archivo y eso impide restaurar el dump.
# --password= en una sola pieza evita que pregunte la clave y pueda correr solo.
$cmd = "`"$MARIADB\mariadb-dump.exe`" -u $DB_USER --password=$DB_PASS --single-transaction --default-character-set=utf8mb4 $DB_NAME > `"$dump`""
cmd /c $cmd
if ($LASTEXITCODE -ne 0) { throw "El respaldo fallo. Se detiene el despliegue." }
if ((Get-Item $dump).Length -lt 1024) { throw "El respaldo quedo vacio o truncado." }
Write-Host "   $dump ($([math]::Round((Get-Item $dump).Length / 1KB)) KB)"

# Conservar solo los ultimos 30 dias
Get-ChildItem $RESPALDOS -Filter "*.sql" |
    Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } |
    Remove-Item -Force

# --- 2. Codigo ---
Paso "Actualizando el codigo"
Set-Location $RAIZ
$antes = git rev-parse HEAD
Verificar "leer la version actual del repositorio"
git fetch origin main
Verificar "traer los cambios de GitHub"
git reset --hard origin/main
Verificar "actualizar el codigo"
$despues = git rev-parse HEAD
Verificar "leer la version nueva"

if ($antes -eq $despues) {
    Write-Host "   Sin cambios nuevos ($($antes.Substring(0,7)))"
} else {
    Write-Host "   $($antes.Substring(0,7)) -> $($despues.Substring(0,7))"
}

# --- 3. Dependencias del backend ---
Paso "Dependencias de Python"
Set-Location $BACKEND
& "$BACKEND\venv\Scripts\python.exe" -m pip install -q -r requirements.txt
Verificar "instalar las dependencias de Python"

# --- 4. Migraciones, si el proyecto ya usa Alembic ---
if (Test-Path "$BACKEND\alembic.ini") {
    Paso "Aplicando migraciones"
    & "$BACKEND\venv\Scripts\alembic.exe" upgrade head
    if ($LASTEXITCODE -ne 0) {
        throw "La migracion fallo. La base quedo respaldada en $dump"
    }
} else {
    Write-Host "`n==> Sin Alembic todavia; las tablas las crea el backend al arrancar" -ForegroundColor DarkGray
}

# --- 5. Frontend ---
Paso "Construyendo el frontend"
Set-Location $FRONTEND
npm ci --silent
Verificar "instalar las dependencias de Node"

$env:VITE_API_URL = $API_URL
npm run build
Verificar "construir el frontend"

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

Set-Location $RAIZ
Write-Host "`nDespliegue completo. Version $($despues.Substring(0,7)) en $API_URL" -ForegroundColor Green