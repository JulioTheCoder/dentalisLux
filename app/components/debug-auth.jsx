"use client"

import { useUser } from '@/context/user-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'

export function DebugAuth() {
  const { user, loading, signOut } = useUser()

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      console.log('🔍 DebugAuth - Sesión directa de Supabase:', session)
      console.log('🔍 DebugAuth - Error de sesión:', error)
      
      if (session?.user) {
        const { data: userData, error: userError } = await supabase
          .from('usuario')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        console.log('🔍 DebugAuth - Datos de usuario de BD:', userData)
        console.log('🔍 DebugAuth - Error de usuario de BD:', userError)
      }
    } catch (error) {
      console.error('❌ DebugAuth - Error al verificar sesión:', error)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Debug de Autenticación
          <Badge variant={loading ? "secondary" : "default"}>
            {loading ? "Cargando..." : "Listo"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Estado del Contexto:</h4>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Loading:</strong> {loading ? "Sí" : "No"}
            </div>
            <div>
              <strong>Usuario:</strong> {user ? "Autenticado" : "No autenticado"}
            </div>
            {user && (
              <>
                <div>
                  <strong>ID:</strong> {user.id}
                </div>
                <div>
                  <strong>Email:</strong> {user.email}
                </div>
                <div>
                  <strong>Nombre:</strong> {user.name || "No definido"}
                </div>
                <div>
                  <strong>Rol:</strong> 
                  <Badge variant="outline" className="ml-2">
                    {user.role || "No definido"}
                  </Badge>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={checkSession} variant="outline" size="sm">
            Verificar Sesión
          </Button>
          {user && (
            <Button onClick={signOut} variant="destructive" size="sm">
              Cerrar Sesión
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Revisa la consola del navegador para más detalles.</p>
        </div>
      </CardContent>
    </Card>
  )
} 