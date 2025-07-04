"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase/client";
import { useUser } from "@/context/user-context";

export function AuthButtons() {
  const router = useRouter();
  const { user, signOut, isSigningOut } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Función para abrir el modal
  const handleOpenDialog = () => {
    console.log("Abriendo modal de login...");
    setError("");
    setSuccessMessage("");
    setIsDialogOpen(true);
  };

  // Función de inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    console.log("Iniciando proceso de login...");
    const email = e.target.elements["email-login"].value;
    const password = e.target.elements["password-login"].value;
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Error en login:", error);
        setError(error.message);
        return;
      }
      
      if (!data.user) {
        setError("No se pudo iniciar sesión");
        return;
      }

      console.log("Login exitoso, usuario:", data.user.email);
      
      // Esperar un momento para que el contexto se actualice
      setTimeout(() => {
        setIsDialogOpen(false);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error inesperado en login:", error);
      setError("Error inesperado al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  // Función de registro
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    
    const email = e.target.elements["email-register"].value;
    const password = e.target.elements["password-register"].value;
    const name = e.target.elements["name-register"].value;
    const phone = e.target.elements["phone-register"].value;
    const tipo_identificacion = e.target.elements["id-type-register"].value;
    const numero_identificacion = e.target.elements["id-number-register"].value;

    try {
      console.log("🚀 Iniciando proceso de registro...");
      console.log("📧 Email:", email);
      console.log("👤 Nombre:", name);
      
      // Verificar si el email ya existe en la tabla usuario
      const { data: existingUser, error: checkError } = await supabase
        .from('usuario')
        .select('id')
        .eq('email', email)
        .single();
      
      if (existingUser) {
        setError("Este email ya está registrado");
        return;
      }

      // Crear el usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        console.error("❌ Error en registro de autenticación:", error);
        setError(error.message);
        return;
      }
      
      console.log("✅ Usuario creado en Auth:", data.user?.id);

      if (data?.user) {
        // Insertar datos adicionales en la tabla usuario
        const { error: userError } = await supabase.from("usuario").insert({
          id: data.user.id,
          name: name,
          phone: phone,
          tipo_identificacion: tipo_identificacion,
          numero_identificacion: numero_identificacion,
          rol: "usuario"
        });
        
        if (userError) {
          console.error("❌ Error al crear perfil de usuario:", userError);
          console.error("❌ Detalles del error:", userError.message, userError.details);
          
          // Si falla la inserción, intentar eliminar el usuario de Auth
          try {
            await supabase.auth.admin.deleteUser(data.user.id);
          } catch (deleteError) {
            console.error("❌ Error al eliminar usuario de Auth:", deleteError);
          }
          
          setError(`Error al crear el perfil: ${userError.message}`);
          return;
        }
        
        console.log("✅ Perfil de usuario creado exitosamente");
        
        // Mostrar mensaje de éxito
        setSuccessMessage("Usuario registrado exitosamente. Por favor, verifica tu email para confirmar tu cuenta.");
        
        // Cerrar el modal después de un breve delay
        setTimeout(() => {
          setIsDialogOpen(false);
          setSuccessMessage("");
        }, 3000);
        
      } else {
        setError("No se pudo crear el usuario");
      }
    } catch (error) {
      console.error("❌ Error inesperado en registro:", error);
      setError("Error inesperado al registrarse. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Si el usuario está autenticado, mostrar botón de cerrar sesión
  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Hola, {user.name || user.email}
        </span>
        <Button 
          variant="outline" 
          onClick={signOut}
          disabled={isSigningOut}
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          <span>{isSigningOut ? "Cerrando..." : "Cerrar Sesión"}</span>
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleOpenDialog}
        >
          <User className="h-4 w-4" />
          <span>Acceder</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] max-h-[90vh] overflow-y-auto">
        <Tabs defaultValue="login" className="w-full mt-6 ">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          {successMessage && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}
          
          <TabsContent value="login">
            <DialogHeader className="pb-2 mt-6">
              <DialogTitle>Iniciar Sesión</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleLogin} className="space-y-3 py-2">
              <div className="space-y-2">
                <Label htmlFor="email-login">Email</Label>
                <Input
                  id="email-login"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="h-8"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-login">Contraseña</Label>
                <Input id="password-login" type="password" className="h-8" required />
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-3 w-3 rounded border-gray-300"
                  />
                  <label htmlFor="remember" className="text-muted-foreground">
                    Recordarme
                  </label>
                </div>
                <Link href="#" className="text-primary hover:underline">
                  ¿Olvidó su contraseña?
                </Link>
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <Button type="submit" className="w-full h-8" disabled={isLoading}>
                  {isLoading ? "Iniciando..." : "Iniciar Sesión"}
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <DialogHeader className="pb-2">
              <DialogTitle>Crear una cuenta</DialogTitle>
              <DialogDescription>
                Regístrese para gestionar sus citas y acceder a beneficios
                exclusivos.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRegister} className="space-y-3 py-2">
              <div className="space-y-1">
                <Label htmlFor="name-register" className="text-sm">
                  Nombre completo
                </Label>
                <Input
                  id="name-register"
                  placeholder="Nombres(s) y Apellido(s) "
                  className="h-8"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email-register" className="text-sm">
                  Email
                </Label>
                <Input
                  id="email-register"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="h-8"
                  required
                />
              </div>
              {/* Nuevo campo: Tipo de identificación */}
              <div className="space-y-1">
                <Label htmlFor="id-type-register" className="text-sm">
                  Tipo de identificación
                </Label>
                <select
                  id="id-type-register"
                  className="h-8 w-full rounded border border-gray-300 px-2 text-sm"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Seleccione una opción
                  </option>
                  <option value="CC">Cédula</option>
                  <option value="TI">Tarjeta de identidad</option>
                  <option value="CE">Cédula de extranjería</option>
                  <option value="RC">Registro civil</option>
                </select>
              </div>

              {/* Nuevo campo: Número de identificación */}
              <div className="space-y-1">
                <Label htmlFor="id-number-register" className="text-sm">
                  Número de identificación
                </Label>
                <Input
                  id="id-number-register"
                  placeholder="Ej: 12345678"
                  className="h-8"
                  type="text"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone-register" className="text-sm">
                  Teléfono
                </Label>
                <Input
                  id="phone-register"
                  type="tel"
                  placeholder="+54 123-456-7890"
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password-register" className="text-sm">
                  Contraseña
                </Label>
                <Input id="password-register" type="password" className="h-8" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirm-password" className="text-sm">
                  Confirmar Contraseña
                </Label>
                <Input id="confirm-password" type="password" className="h-8" required />
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-3 w-3 rounded border-gray-300"
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-muted-foreground"
                >
                  Acepto los{" "}
                  <Link href="#" className="text-primary hover:underline">
                    términos y condiciones
                  </Link>
                </label>
              </div>
              <Button type="submit" className="w-full h-8 mt-2" disabled={isLoading}>
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
