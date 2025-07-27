"use client"

import { useEffect, useState } from "react"
import { LogOut, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LogoutLoading() {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".")
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <LogOut className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Cerrando sesión</CardTitle>
          <CardDescription>
            Estamos cerrando tu sesión de forma segura{dots}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Procesando...</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Gracias por usar Dentalis Lux
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 