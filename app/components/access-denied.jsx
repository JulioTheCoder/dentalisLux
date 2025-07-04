"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle } from "lucide-react"

export function AccessDenied({ userRole, attemptedRoute }) {
  const getRoleName = (role) => {
    switch (role) {
      case 'admin': return 'Administrador'
      case 'empleado': return 'Empleado'
      case 'usuario': return 'Cliente'
      default: return 'Usuario'
    }
  }

  const getDashboardRoute = (role) => {
    switch (role) {
      case 'admin': return '/dashboard/administrador'
      case 'empleado': return '/dashboard/empleado'
      case 'usuario': return '/dashboard/cliente'
      default: return '/'
    }
  }

  const handleGoToDashboard = () => {
    const dashboardRoute = getDashboardRoute(userRole)
    console.log('🔄 Redirigiendo a dashboard:', dashboardRoute)
    // Forzar recarga completa de la página
    window.location.href = dashboardRoute
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Shield className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl">Acceso Denegado</CardTitle>
          <CardDescription>
            No tienes permisos para acceder a esta sección
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center space-x-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="font-medium">Detalles del acceso:</span>
            </div>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p><strong>Tu rol:</strong> {getRoleName(userRole)}</p>
              <p><strong>Ruta intentada:</strong> {attemptedRoute}</p>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={handleGoToDashboard}
              className="w-full"
            >
              Ir a mi Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 