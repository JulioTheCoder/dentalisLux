"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { AccessDenied } from './access-denied'
import { useUser } from '@/context/user-context'

// Mapeo de rutas permitidas por rol
const ROLE_ROUTES = {
  admin: ['/dashboard/administrador'],
  empleado: ['/dashboard/empleado'],
  usuario: ['/dashboard/cliente']
}

// Mapeo de rutas a roles requeridos
const ROUTE_ROLES = {
  '/dashboard/administrador': 'admin',
  '/dashboard/empleado': 'empleado', 
  '/dashboard/cliente': 'usuario'
}

export function RouteGuard({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useUser()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 RouteGuard: Iniciando verificación de autenticación...')
        console.log('🔍 RouteGuard: Ruta actual:', pathname)
        console.log('🔍 RouteGuard: Estado de carga:', loading)
        console.log('🔍 RouteGuard: Usuario:', user)
        
        // Esperar a que termine la carga del contexto
        if (loading) {
          console.log('⏳ RouteGuard: Esperando a que termine la carga...')
          return
        }

        // Verificar si el usuario está autenticado
        if (!user) {
          console.log('❌ RouteGuard: No hay usuario autenticado, redirigiendo a login')
          router.push('/')
          return
        }

        console.log('✅ RouteGuard: Usuario autenticado:', user.email, 'con rol:', user.role)

        // Verificar si la ruta actual requiere un rol específico
        const requiredRole = ROUTE_ROLES[pathname]
        console.log('🔍 RouteGuard: Rol requerido para esta ruta:', requiredRole)
        
        if (requiredRole) {
          // Si la ruta requiere un rol específico, verificar que coincida
          console.log('🔍 RouteGuard: Comparando roles - Usuario:', user.role, 'Requerido:', requiredRole)
          if (user.role !== requiredRole) {
            console.log(`❌ RouteGuard: Acceso denegado: rol ${user.role} no puede acceder a ${pathname}`)
            setAccessDenied(true)
            return
          }
          console.log('✅ RouteGuard: Rol válido, acceso permitido')
        } else {
          // Si es una ruta general del dashboard, verificar que tenga algún rol válido
          console.log('🔍 RouteGuard: Verificando rol válido para ruta general')
          if (!['admin', 'empleado', 'usuario'].includes(user.role)) {
            console.log('❌ RouteGuard: Rol de usuario no válido:', user.role)
            router.push('/')
            return
          }
          console.log('✅ RouteGuard: Rol válido para ruta general')
        }

        // Si llegamos aquí, el usuario está autorizado
        console.log('✅ RouteGuard: Usuario autorizado, mostrando contenido')
        setIsAuthorized(true)
        
      } catch (error) {
        console.error('❌ RouteGuard: Error inesperado en verificación de autenticación:', error)
        router.push('/')
      }
    }

    checkAuth()
  }, [pathname, router, user, loading])

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  // Si el acceso fue denegado, mostrar el componente AccessDenied
  if (accessDenied) {
    return <AccessDenied userRole={user?.role} attemptedRoute={pathname} />
  }

  // Si no está autorizado, no mostrar nada (ya se redirigió)
  if (!isAuthorized) {
    return null
  }

  // Si está autorizado, mostrar el contenido
  return children
} 