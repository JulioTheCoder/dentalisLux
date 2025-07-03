"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error al obtener sesión inicial:', error)
          setLoading(false)
          return
        }

        if (session?.user) {
          setUser(session.user)
          await fetchUserRole(session.user.id)
        }
      } catch (error) {
        console.error('Error en getInitialSession:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Suscribirse a cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id)
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          await fetchUserRole(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setUserRole(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('usuario')
        .select('rol')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error al obtener rol del usuario:', error)
        return
      }

      setUserRole(data.rol)
    } catch (error) {
      console.error('Error en fetchUserRole:', error)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error al cerrar sesión:', error)
        return false
      }
      
      setUser(null)
      setUserRole(null)
      router.push('/')
      return true
    } catch (error) {
      console.error('Error inesperado durante el logout:', error)
      return false
    }
  }

  const hasRole = (requiredRole) => {
    return userRole === requiredRole
  }

  const hasAnyRole = (roles) => {
    return roles.includes(userRole)
  }

  const canAccessRoute = (route) => {
    const routeRoles = {
      '/dashboard/administrador': 'admin',
      '/dashboard/empleado': 'empleado',
      '/dashboard/cliente': 'usuario'
    }
    
    const requiredRole = routeRoles[route]
    return !requiredRole || userRole === requiredRole
  }

  return {
    user,
    userRole,
    loading,
    signOut,
    hasRole,
    hasAnyRole,
    canAccessRoute,
    isAuthenticated: !!user
  }
} 