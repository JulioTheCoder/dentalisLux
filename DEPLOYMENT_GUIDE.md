# 🚀 Guía Rápida de Despliegue - DentalisLux

## ⚡ Despliegue Rápido (5 minutos)

### Opción 1: Despliegue Automático con Vercel

1. **Ve a [vercel.com](https://vercel.com)**
2. **Conecta tu cuenta de GitHub/GitLab**
3. **Importa este repositorio**
4. **Configura las variables de entorno**:
   - `NEXT_PUBLIC_SUPABASE_URL` = Tu URL de Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Tu clave anónima de Supabase
5. **¡Listo!** Tu app estará en línea en 2-3 minutos

### Opción 2: Despliegue Manual

#### En Windows:
```bash
# Ejecuta el script automático
deploy.bat
```

#### En Mac/Linux:
```bash
# Dale permisos de ejecución
chmod +x deploy.sh

# Ejecuta el script
./deploy.sh
```

## 🔧 Configuración Requerida

### 1. Variables de Entorno

Crea un archivo `.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
```

### 2. Configuración de Supabase

1. **Ve a tu proyecto de Supabase**
2. **Ejecuta el script SQL** en el SQL Editor:
   - Primero: Estructura de tablas
   - Segundo: Políticas RLS (`supabase_rls_policies.sql`)

3. **Configura autenticación**:
   - Authentication > Settings
   - Agrega redirect URLs:
     - `http://localhost:3000/auth/callback` (desarrollo)
     - `https://tu-dominio.vercel.app/auth/callback` (producción)

## 📱 URLs de Acceso

Una vez desplegado, tendrás acceso a:

- **URL de producción**: `https://tu-proyecto.vercel.app`
- **Dashboard de Vercel**: `https://vercel.com/dashboard`
- **Dashboard de Supabase**: `https://supabase.com/dashboard`

## 👥 Usuarios de Prueba

### Administrador
- Email: `admin@dentalislux.com`
- Contraseña: `admin123`

### Odontólogo
- Email: `dr.garcia@dentalislux.com`
- Contraseña: `doctor123`

### Cliente
- Email: `cliente@dentalislux.com`
- Contraseña: `cliente123`

## 🔍 Verificación del Despliegue

1. **Verifica que la app carga** en la URL de Vercel
2. **Prueba el login** con los usuarios de prueba
3. **Verifica que las políticas RLS funcionan**:
   - Los usuarios solo ven sus propios datos
   - Los administradores ven todo
   - Los odontólogos ven sus citas asignadas

## 🐛 Solución de Problemas Comunes

### Error: "Cannot connect to Supabase"
- Verifica que las variables de entorno estén configuradas
- Asegúrate de que la URL y clave sean correctas

### Error: "Policy violation"
- Ejecuta el script de políticas RLS en Supabase
- Verifica que las tablas existan

### Error: "Build failed"
- Revisa los logs en Vercel
- Verifica que todas las dependencias estén instaladas

## 📞 Soporte

Si tienes problemas:

1. **Revisa los logs** en Vercel Dashboard
2. **Verifica la configuración** de Supabase
3. **Contacta al desarrollador** con los errores específicos

## 🎯 Próximos Pasos

1. **Configura un dominio personalizado** (opcional)
2. **Configura notificaciones por email**
3. **Agrega más funcionalidades** según las necesidades
4. **Optimiza el rendimiento** con métricas de Vercel

---

**¡Tu aplicación estará lista para mostrar al dueño del proyecto!** 🎉 