"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AuthButtons() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Función simulada de inicio de sesión
  const handleLogin = (e) => {
    e.preventDefault()
    // Aquí iría la lógica real de autenticación
    setIsDialogOpen(false)
    router.push("/dashboard")
  }

  // Función simulada de registro
  const handleRegister = (e) => {
    e.preventDefault()
    // Aquí iría la lógica real de registro
    setIsDialogOpen(false)
    router.push("/dashboard")
  }

  return (
  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>Acceder</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] max-h-[90vh] overflow-y-auto">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <DialogHeader className="pb-2">
              <DialogTitle>Iniciar Sesión</DialogTitle>
              <DialogDescription>Acceda a su cuenta para gestionar sus citas y tratamientos.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLogin} className="space-y-3 py-2">
              <div className="space-y-2">
                <Label htmlFor="email-login">Email</Label>
                <Input id="email-login" type="email" placeholder="correo@ejemplo.com" className="h-8" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-login">Contraseña</Label>
                <Input id="password-login" type="password" className="h-8" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="remember" className="h-3 w-3 rounded border-gray-300" />
                  <label htmlFor="remember" className="text-muted-foreground">
                    Recordarme
                  </label>
                </div>
                <Link href="#" className="text-primary hover:underline">
                  ¿Olvidó su contraseña?
                </Link>
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <Button type="submit" className="w-full h-8">
                  Iniciar Sesión
                </Button>
                <p className="text-center text-xs text-muted-foreground pt-1">
                  ¿No tiene una cuenta?{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Regístrese
                  </Link>
                </p>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <DialogHeader className="pb-2">
              <DialogTitle>Crear una cuenta</DialogTitle>
              <DialogDescription>
                Regístrese para gestionar sus citas y acceder a beneficios exclusivos.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRegister} className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="first-name" className="text-sm">
                    Nombre
                  </Label>
                  <Input id="first-name" placeholder="Juan" className="h-8" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="last-name" className="text-sm">
                    Apellido
                  </Label>
                  <Input id="last-name" placeholder="Pérez" className="h-8" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="email-register" className="text-sm">
                  Email
                </Label>
                <Input id="email-register" type="email" placeholder="correo@ejemplo.com" className="h-8" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone-register" className="text-sm">
                  Teléfono
                </Label>
                <Input id="phone-register" type="tel" placeholder="+123 456 7890" className="h-8" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password-register" className="text-sm">
                  Contraseña
                </Label>
                <Input id="password-register" type="password" className="h-8" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirm-password" className="text-sm">
                  Confirmar Contraseña
                </Label>
                <Input id="confirm-password" type="password" className="h-8" />
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <input type="checkbox" id="terms" className="h-3 w-3 rounded border-gray-300" />
                <label htmlFor="terms" className="text-xs text-muted-foreground">
                  Acepto los{" "}
                  <Link href="#" className="text-primary hover:underline">
                    términos y condiciones
                  </Link>
                </label>
              </div>
              <Button type="submit" className="w-full h-8 mt-2">
                Crear Cuenta
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

