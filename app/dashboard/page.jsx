"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";

export default function DashboardPage() {
  const { user } = useUser(); // Accede al contexto del usuario
  const router = useRouter();

  useEffect(() => {
    // Redirige según el rol del usuario
    if (user.role === "cliente") {
      router.push("/dashboard/cliente"); // Ruta para el dashboard de clientes
    } else if (user.role === "empleado") {
      router.push("/dashboard/empleados"); // Ruta para el dashboard de empleados
    } else if (user.role === "administrador") {
      router.push("/dashboard/admin"); // Ruta para el dashboard de administradores
    } else {
      router.push("/"); // Redirige a la página principal si no hay un rol válido
    }
  }, [user, router]);

  return <div>Redirigiendo... </div>; // No renderiza nada, solo redirige
}
