"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Calendar,
  Clock,
  Users,
  FileText,
  Home,
  LogOut,
  Settings,
  User,
  Bell,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Plus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"

export default function EmployeeDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Datos de ejemplo para el empleado
  const employee = {
    name: "Dr. Carlos Sánchez",
    role: "Odontólogo",
    email: "carlos.sanchez@dentallux.com",
    avatar: "/placeholder.svg?height=40&width=40",
  }

  // Datos de ejemplo para las citas del día
  const todayAppointments = [
    {
      id: 1,
      time: "09:00 AM",
      patient: "María González",
      service: "Limpieza Dental",
      status: "Confirmada",
    },
    {
      id: 2,
      time: "10:30 AM",
      patient: "Juan Pérez",
      service: "Revisión Ortodoncia",
      status: "Confirmada",
    },
    {
      id: 3,
      time: "12:00 PM",
      patient: "Ana Rodríguez",
      service: "Extracción",
      status: "Pendiente",
    },
    {
      id: 4,
      time: "15:30 PM",
      patient: "Luis Martínez",
      service: "Empaste",
      status: "Confirmada",
    },
    {
      id: 5,
      time: "17:00 PM",
      patient: "Carmen López",
      service: "Radiografía",
      status: "Cancelada",
    },
  ]

  // Datos de ejemplo para los pacientes recientes
  const recentPatients = [
    {
      id: 1,
      name: "María González",
      lastVisit: "15/05/2023",
      nextVisit: "28/06/2023",
      treatment: "Ortodoncia",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Juan Pérez",
      lastVisit: "10/05/2023",
      nextVisit: "10/06/2023",
      treatment: "Implante Dental",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Ana Rodríguez",
      lastVisit: "05/05/2023",
      nextVisit: "12/06/2023",
      treatment: "Extracción",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Datos de ejemplo para las tareas pendientes
  const pendingTasks = [
    {
      id: 1,
      task: "Revisar historial de María González",
      dueDate: "Hoy",
      priority: "Alta",
    },
    {
      id: 2,
      task: "Actualizar receta para Juan Pérez",
      dueDate: "Mañana",
      priority: "Media",
    },
    {
      id: 3,
      task: "Confirmar cita con Ana Rodríguez",
      dueDate: "Hoy",
      priority: "Alta",
    },
    {
      id: 4,
      task: "Revisar radiografías de Luis Martínez",
      dueDate: "28/05/2023",
      priority: "Baja",
    },
  ]

  // Función para renderizar el estado de la cita con un color adecuado
  const renderAppointmentStatus = (status) => {
    switch (status) {
      case "Confirmada":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="mr-1 h-3 w-3" /> {status}
          </Badge>
        )
      case "Pendiente":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            <Clock className="mr-1 h-3 w-3" /> {status}
          </Badge>
        )
      case "Cancelada":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" /> {status}
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Función para renderizar la prioridad de la tarea con un color adecuado
  const renderTaskPriority = (priority) => {
    switch (priority) {
      case "Alta":
        return <Badge variant="destructive">{priority}</Badge>
      case "Media":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            {priority}
          </Badge>
        )
      case "Baja":
        return (
          <Badge variant="outline" className="text-green-500 border-green-500">
            {priority}
          </Badge>
        )
      default:
        return <Badge>{priority}</Badge>
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
          <div className="flex flex-col gap-2 p-4">
            <div className="py-2">
              <h2 className="px-4 text-lg font-semibold tracking-tight">Panel de Empleado</h2>
              <p className="px-4 text-xs text-muted-foreground">{employee.role}</p>
            </div>
            <div className="px-4 py-2">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">General</h2>
              <div className="space-y-1">
                <Button
                  variant={activeTab === "overview" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("overview")}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Resumen
                </Button>
                <Button
                  variant={activeTab === "appointments" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("appointments")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Citas
                </Button>
                <Button
                  variant={activeTab === "patients" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("patients")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Pacientes
                </Button>
                <Button
                  variant={activeTab === "medical" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("medical")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Historiales
                </Button>
              </div>
            </div>
            <div className="px-4 py-2">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cuenta</h2>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </Button>
                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {/* Mobile Tab Navigation */}
          <div className="mb-6 md:hidden">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="appointments">Citas</TabsTrigger>
                <TabsTrigger value="patients">Pacientes</TabsTrigger>
                <TabsTrigger value="medical">Historiales</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Bienvenido, {employee.name}</h1>
                <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
              </div>

              {/* Resumen de citas del día */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Citas del Día</CardTitle>
                    <CardDescription>Tienes {todayAppointments.length} citas programadas para hoy</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Ver calendario
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Hora</TableHead>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Servicio</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todayAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>{appointment.time}</TableCell>
                          <TableCell>{appointment.patient}</TableCell>
                          <TableCell>{appointment.service}</TableCell>
                          <TableCell>{renderAppointmentStatus(appointment.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Pacientes recientes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pacientes Recientes</CardTitle>
                    <CardDescription>Últimos pacientes atendidos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentPatients.map((patient) => (
                        <div key={patient.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                              <AvatarFallback>{patient.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{patient.name}</p>
                              <p className="text-xs text-muted-foreground">{patient.treatment}</p>
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <p>Última visita: {patient.lastVisit}</p>
                            <p className="text-xs text-muted-foreground">Próxima: {patient.nextVisit}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("patients")}>
                      Ver todos los pacientes
                    </Button>
                  </CardFooter>
                </Card>

                {/* Tareas pendientes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tareas Pendientes</CardTitle>
                    <CardDescription>Tienes {pendingTasks.length} tareas por completar</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border">
                              <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{task.task}</p>
                              <p className="text-xs text-muted-foreground">Vence: {task.dueDate}</p>
                            </div>
                          </div>
                          <div>{renderTaskPriority(task.priority)}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Ver todas las tareas
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === "appointments" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Gestión de Citas</h1>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Cita
                </Button>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input type="text" placeholder="Buscar citas..." />
                  <Button type="submit" size="icon" variant="ghost">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Hoy
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Calendario de Citas</CardTitle>
                  <CardDescription>Gestiona las citas de tus pacientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Servicio</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        ...todayAppointments,
                        {
                          id: 6,
                          time: "09:30 AM",
                          patient: "Roberto Gómez",
                          service: "Consulta General",
                          status: "Confirmada",
                          date: "29/05/2023",
                        },
                        {
                          id: 7,
                          time: "11:00 AM",
                          patient: "Elena Torres",
                          service: "Blanqueamiento",
                          status: "Pendiente",
                          date: "29/05/2023",
                        },
                        {
                          id: 8,
                          time: "16:00 PM",
                          patient: "Miguel Ángel",
                          service: "Ortodoncia",
                          status: "Confirmada",
                          date: "30/05/2023",
                        },
                      ].map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>{appointment.date || "Hoy"}</TableCell>
                          <TableCell>{appointment.time}</TableCell>
                          <TableCell>{appointment.patient}</TableCell>
                          <TableCell>{appointment.service}</TableCell>
                          <TableCell>{renderAppointmentStatus(appointment.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Patients Tab */}
          {activeTab === "patients" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Gestión de Pacientes</h1>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Paciente
                </Button>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input type="text" placeholder="Buscar pacientes..." />
                  <Button type="submit" size="icon" variant="ghost">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrar
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Directorio de Pacientes</CardTitle>
                  <CardDescription>Gestiona la información de tus pacientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead>Última Visita</TableHead>
                        <TableHead>Próxima Visita</TableHead>
                        <TableHead>Tratamiento</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        ...recentPatients,
                        {
                          id: 4,
                          name: "Roberto Gómez",
                          lastVisit: "01/05/2023",
                          nextVisit: "01/06/2023",
                          treatment: "Consulta General",
                          avatar: "/placeholder.svg?height=40&width=40",
                          contact: "555-123-4567",
                        },
                        {
                          id: 5,
                          name: "Elena Torres",
                          lastVisit: "28/04/2023",
                          nextVisit: "29/05/2023",
                          treatment: "Blanqueamiento",
                          avatar: "/placeholder.svg?height=40&width=40",
                          contact: "555-987-6543",
                        },
                        {
                          id: 6,
                          name: "Miguel Ángel",
                          lastVisit: "15/04/2023",
                          nextVisit: "30/05/2023",
                          treatment: "Ortodoncia",
                          avatar: "/placeholder.svg?height=40&width=40",
                          contact: "555-456-7890",
                        },
                      ].map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                                <AvatarFallback>{patient.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span>{patient.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{patient.contact || "555-000-0000"}</TableCell>
                          <TableCell>{patient.lastVisit}</TableCell>
                          <TableCell>{patient.nextVisit}</TableCell>
                          <TableCell>{patient.treatment}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Medical Records Tab */}
          {activeTab === "medical" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Historiales Médicos</h1>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Registro
                </Button>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input type="text" placeholder="Buscar historiales..." />
                  <Button type="submit" size="icon" variant="ghost">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrar
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Historiales Médicos</CardTitle>
                  <CardDescription>Accede a los historiales médicos de tus pacientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Tratamiento</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Notas</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        {
                          id: 1,
                          patient: "María González",
                          date: "15/05/2023",
                          treatment: "Limpieza Dental",
                          doctor: "Dr. Carlos Sánchez",
                          notes: "Limpieza rutinaria. Se recomienda mejorar técnica de cepillado.",
                          avatar: "/placeholder.svg?height=40&width=40",
                        },
                        {
                          id: 2,
                          patient: "Juan Pérez",
                          date: "10/05/2023",
                          treatment: "Revisión Ortodoncia",
                          doctor: "Dr. Carlos Sánchez",
                          notes: "Ajuste de brackets. Progreso satisfactorio.",
                          avatar: "/placeholder.svg?height=40&width=40",
                        },
                        {
                          id: 3,
                          patient: "Ana Rodríguez",
                          date: "05/05/2023",
                          treatment: "Extracción",
                          doctor: "Dr. Carlos Sánchez",
                          notes: "Extracción de muela del juicio. Sin complicaciones.",
                          avatar: "/placeholder.svg?height=40&width=40",
                        },
                        {
                          id: 4,
                          patient: "Roberto Gómez",
                          date: "01/05/2023",
                          treatment: "Consulta General",
                          doctor: "Dr. Carlos Sánchez",
                          notes: "Revisión general. Se recomienda limpieza en próxima visita.",
                          avatar: "/placeholder.svg?height=40&width=40",
                        },
                        {
                          id: 5,
                          patient: "Elena Torres",
                          date: "28/04/2023",
                          treatment: "Blanqueamiento",
                          doctor: "Dr. Carlos Sánchez",
                          notes: "Primera sesión de blanqueamiento. Resultados visibles.",
                          avatar: "/placeholder.svg?height=40&width=40",
                        },
                      ].map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={record.avatar || "/placeholder.svg"} alt={record.patient} />
                                <AvatarFallback>{record.patient.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span>{record.patient}</span>
                            </div>
                          </TableCell>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{record.treatment}</TableCell>
                          <TableCell>{record.doctor}</TableCell>
                          <TableCell className="max-w-xs truncate">{record.notes}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
