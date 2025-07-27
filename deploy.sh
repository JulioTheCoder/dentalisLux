#!/bin/bash

# 🦷 DentalisLux - Script de Despliegue Automatizado
# Este script automatiza el proceso de despliegue en Vercel

echo "🚀 Iniciando despliegue de DentalisLux..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado. Por favor instala Node.js 18+"
    exit 1
fi

# Verificar si pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    print_status "pnpm no está instalado. Instalando..."
    npm install -g pnpm
    
    if [ $? -ne 0 ]; then
        print_error "Error al instalar pnpm"
        exit 1
    fi
    
    print_success "pnpm instalado correctamente"
fi

print_success "Node.js y pnpm están instalados"

# Verificar si el archivo .env.local existe
if [ ! -f ".env.local" ]; then
    print_warning "Archivo .env.local no encontrado"
    print_status "Creando archivo .env.local desde env.example..."
    
    if [ -f "env.example" ]; then
        cp env.example .env.local
        print_success "Archivo .env.local creado"
        print_warning "IMPORTANTE: Edita .env.local con tus credenciales de Supabase antes de continuar"
        echo ""
        echo "Variables que necesitas configurar:"
        echo "  - NEXT_PUBLIC_SUPABASE_URL"
        echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
        echo ""
        read -p "¿Has configurado las variables de entorno? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Por favor configura las variables de entorno antes de continuar"
            exit 1
        fi
    else
        print_error "Archivo env.example no encontrado"
        exit 1
    fi
fi

# Instalar dependencias
print_status "Instalando dependencias..."
pnpm install

if [ $? -eq 0 ]; then
    print_success "Dependencias instaladas correctamente"
else
    print_error "Error al instalar dependencias"
    exit 1
fi

# Verificar si Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    print_status "Vercel CLI no está instalado. Instalando..."
    pnpm add -g vercel
    
    if [ $? -eq 0 ]; then
        print_success "Vercel CLI instalado correctamente"
    else
        print_error "Error al instalar Vercel CLI"
        exit 1
    fi
fi

# Verificar si el usuario está logueado en Vercel
print_status "Verificando autenticación en Vercel..."
vercel whoami &> /dev/null

if [ $? -ne 0 ]; then
    print_warning "No estás autenticado en Vercel"
    print_status "Iniciando proceso de autenticación..."
    vercel login
    
    if [ $? -ne 0 ]; then
        print_error "Error en la autenticación de Vercel"
        exit 1
    fi
fi

print_success "Autenticación en Vercel verificada"

# Build del proyecto
print_status "Construyendo el proyecto..."
pnpm build

if [ $? -eq 0 ]; then
    print_success "Proyecto construido correctamente"
else
    print_error "Error en la construcción del proyecto"
    exit 1
fi

# Desplegar en Vercel
print_status "Desplegando en Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    print_success "¡Despliegue completado exitosamente!"
    echo ""
    echo "🎉 Tu aplicación está ahora en línea!"
    echo ""
    echo "📋 Próximos pasos:"
    echo "1. Configura las variables de entorno en el dashboard de Vercel"
    echo "2. Configura tu dominio personalizado (opcional)"
    echo "3. Configura las políticas RLS en Supabase"
    echo ""
    echo "🔗 Enlaces útiles:"
    echo "- Dashboard de Vercel: https://vercel.com/dashboard"
    echo "- Documentación de Supabase: https://supabase.com/docs"
    echo ""
else
    print_error "Error en el despliegue"
    exit 1
fi

echo "✅ Script de despliegue completado" 