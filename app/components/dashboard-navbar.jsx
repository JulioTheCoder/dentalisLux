"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useUser } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Bell, 
  LogOut, 
  Settings, 
  User, 
  CreditCard,
  Plus,
  Shield,
  Building
} from "lucide-react"
import Image from "next/image"

export default function DashboardNavbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, signOut, isSigningOut } = useUser()

  console.log("DashboardNavbar renderizado - pathname:", pathname)
  console.log("DashboardNavbar - usuario:", user)
  console.log("DashboardNavbar - isSigningOut:", isSigningOut)

  const handleLogout = async () => {
    if (isSigningOut) {
      console.log("⚠️ Logout ya en progreso, ignorando clic adicional")
      return
    }

    try {
      console.log("Iniciando proceso de logout...")
      await signOut()
    } catch (error) {
      console.error("Error inesperado durante el logout:", error)
      // En caso de error, forzar la redirección
      window.location.replace('/')
    }
  }

  // Determinar el tipo de dashboard basado en la ruta
  const getDashboardType = () => {
    if (pathname.includes('/administrador')) return 'admin'
    if (pathname.includes('/empleado')) return 'empleado'
    if (pathname.includes('/cliente')) return 'cliente'
    return 'unknown'
  }

  const getDashboardTitle = () => {
    const dashboardType = getDashboardType()
    
    switch (dashboardType) {
      case 'admin':
        return 'Panel de Administrador'
      case 'empleado':
        return 'Panel de Empleado'
      case 'cliente':
        return 'Mi Panel'
      default:
        return 'Dashboard'
    }
  }

  const getDashboardActions = () => {
    const dashboardType = getDashboardType()
    
    switch (dashboardType) {
      case 'admin':
        return []
      case 'empleado':
        return [
          { label: 'Nueva Cita', icon: Plus, onClick: () => console.log('Nueva cita') },
          { label: 'Nuevo Paciente', icon: Plus, onClick: () => console.log('Nuevo paciente') }
        ]
      case 'cliente':
        return []
      default:
        return []
    }
  }

  const getConfigMenuItems = () => {
    const dashboardType = getDashboardType()
    
    switch (dashboardType) {
      case 'admin':
        return [
          { label: 'Clínica', icon: Building, onClick: () => console.log('Configurar clínica') },
          { label: 'Permisos', icon: Shield, onClick: () => console.log('Gestionar permisos') },
          { label: 'Configuración', icon: Settings, onClick: () => console.log('Configuración general') }
        ]
      case 'empleado':
        return [
          { label: 'Mi Horario', icon: Settings, onClick: () => console.log('Configurar horario') },
          { label: 'Configuración', icon: Settings, onClick: () => console.log('Configuración personal') }
        ]
      case 'cliente':
        return [
          { label: 'Mi Perfil', icon: User, onClick: () => console.log('Editar perfil') },
          { label: 'Preferencias', icon: Settings, onClick: () => console.log('Preferencias') }
        ]
      default:
        return []
    }
  }

  const dashboardActions = getDashboardActions()
  const configMenuItems = getConfigMenuItems()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" flex h-16 items-center justify-between px-4 mx-5">
        {/* Logo y título */}
        <div className="flex items-center space-x-4 ml-0">
          <Image
            src="/logo.png"
            alt="Logo"
            width={48}
            height={48}
            className="rounded-full"
          />
          <h1 className="text-xl font-semibold">{getDashboardTitle()}</h1>
        </div>
        
        {/* Acciones y usuario */}
        <div className="flex items-center space-x-2">
          {/* Acciones específicas del dashboard */}
          {dashboardActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={action.onClick}
                className="flex items-center space-x-2"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{action.label}</span>
              </Button>
            )
          })}
          
          {/* Notificaciones */}
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          
          {/* Menú de usuario */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt={user?.email} />
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || user?.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.role === 'admin' ? 'Administrador' : 
                     user?.role === 'empleado' ? 'Empleado' : 'Cliente'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Elementos de configuración específicos */}
              {configMenuItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <DropdownMenuItem key={index} onClick={item.onClick}>
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                )
              })}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="text-red-600 focus:text-red-600"
                disabled={isSigningOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isSigningOut ? "Cerrando sesión..." : "Cerrar Sesión"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}