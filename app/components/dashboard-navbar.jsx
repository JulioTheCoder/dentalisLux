"use client";

import { useUser } from "@/context/user-context";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardNavbar() {
  const { user } = useUser();

  const menuItems = {
    cliente: [], // Eliminados "Inicio", "Mis Citas" y "Perfil"
    empleado: [
      { label: "Citas", href: "/dashboard/citas" },
      { label: "Pacientes", href: "/dashboard/pacientes" },
    ],
    administrador: [
      { label: "Usuarios", href: "/dashboard/usuarios" },
      { label: "Reportes", href: "/dashboard/reportes" },
      { label: "Configuración", href: "/dashboard/configuracion" },
    ],
  };

  const links = menuItems[user.role] || [];

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-16 items-center justify-between w-auto py-4 px-4">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Logo"
              width={48}
              height={48}
              className="rounded-full"
            />
            <span className="text-xl font-bold">Dentalis Lux</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User Info with Avatar */}
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src="/avatar-placeholder.png" alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="flex flex-col items-start gap-2">
                <span className="text-sm font-medium">Hola, {user.name}</span>
                <Link href="/dashboard/perfil" className="text-sm font-medium text-blue-600 hover:underline">
                  Perfil
                </Link>
                <Link href="/dashboard/configuracion" className="text-sm font-medium text-blue-600 hover:underline">
                  Configuración
                </Link>
                <Button variant="outline" size="sm">
                  Cerrar Sesión
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}