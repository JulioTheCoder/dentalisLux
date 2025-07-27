@echo off
chcp 65001 >nul
echo 🚀 Iniciando despliegue de DentalisLux...

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado. Por favor instala Node.js 18+
    pause
    exit /b 1
)

REM Verificar si pnpm está instalado
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] pnpm no está instalado. Instalando...
    call npm install -g pnpm
    
    if %errorlevel% neq 0 (
        echo [ERROR] Error al instalar pnpm
        pause
        exit /b 1
    )
    
    echo [SUCCESS] pnpm instalado correctamente
)

echo [SUCCESS] Node.js y pnpm están instalados

REM Verificar si el archivo .env.local existe
if not exist ".env.local" (
    echo [WARNING] Archivo .env.local no encontrado
    echo [INFO] Creando archivo .env.local desde env.example...
    
    if exist "env.example" (
        copy env.example .env.local >nul
        echo [SUCCESS] Archivo .env.local creado
        echo [WARNING] IMPORTANTE: Edita .env.local con tus credenciales de Supabase antes de continuar
        echo.
        echo Variables que necesitas configurar:
        echo   - NEXT_PUBLIC_SUPABASE_URL
        echo   - NEXT_PUBLIC_SUPABASE_ANON_KEY
        echo.
        set /p config="¿Has configurado las variables de entorno? (y/n): "
        if /i not "%config%"=="y" (
            echo [ERROR] Por favor configura las variables de entorno antes de continuar
            pause
            exit /b 1
        )
    ) else (
        echo [ERROR] Archivo env.example no encontrado
        pause
        exit /b 1
    )
)

REM Instalar dependencias
echo [INFO] Instalando dependencias...
call pnpm install

if %errorlevel% neq 0 (
    echo [ERROR] Error al instalar dependencias
    pause
    exit /b 1
)

echo [SUCCESS] Dependencias instaladas correctamente

REM Verificar si Vercel CLI está instalado
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Vercel CLI no está instalado. Instalando...
    call pnpm add -g vercel
    
    if %errorlevel% neq 0 (
        echo [ERROR] Error al instalar Vercel CLI
        pause
        exit /b 1
    )
    
    echo [SUCCESS] Vercel CLI instalado correctamente
)

REM Verificar si el usuario está logueado en Vercel
echo [INFO] Verificando autenticación en Vercel...
vercel whoami >nul 2>&1

if %errorlevel% neq 0 (
    echo [WARNING] No estás autenticado en Vercel
    echo [INFO] Iniciando proceso de autenticación...
    call vercel login
    
    if %errorlevel% neq 0 (
        echo [ERROR] Error en la autenticación de Vercel
        pause
        exit /b 1
    )
)

echo [SUCCESS] Autenticación en Vercel verificada

REM Build del proyecto
echo [INFO] Construyendo el proyecto...
call pnpm build

if %errorlevel% neq 0 (
    echo [ERROR] Error en la construcción del proyecto
    pause
    exit /b 1
)

echo [SUCCESS] Proyecto construido correctamente

REM Desplegar en Vercel
echo [INFO] Desplegando en Vercel...
call vercel --prod

if %errorlevel% neq 0 (
    echo [ERROR] Error en el despliegue
    pause
    exit /b 1
)

echo [SUCCESS] ¡Despliegue completado exitosamente!
echo.
echo 🎉 Tu aplicación está ahora en línea!
echo.
echo 📋 Próximos pasos:
echo 1. Configura las variables de entorno en el dashboard de Vercel
echo 2. Configura tu dominio personalizado (opcional)
echo 3. Configura las políticas RLS en Supabase
echo.
echo 🔗 Enlaces útiles:
echo - Dashboard de Vercel: https://vercel.com/dashboard
echo - Documentación de Supabase: https://supabase.com/docs
echo.

echo ✅ Script de despliegue completado
pause 