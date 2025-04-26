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
  DollarSign,
  BarChart2,
  Shield,
  Building,
  Search,
  Filter,
  Plus,
  ChevronDown,
  Trash2,
  Edit,
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
import { Progress } from "@/components/ui/progress"

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Datos de ejemplo para el administrador
  const admin = {
    name: "Dr. Alejandro Ramírez",
    role: "Administrador",
    email: "alejandro.ramirez@dentallux.com",
    avatar: "/placeholder.svg?height=40&width=40",
  }

  // Datos de ejemplo para las estadísticas
  const statistics = {
    totalPatients: 1250,
    newPatients: 45,
    totalAppointments: 78,
    completedAppointments: 52,
    totalRevenue: 15800,
    pendingPayments: 3200,
  }

  // Datos de ejemplo para los empleados
  const employees = [
    {
      id: 1,
      name: "Dr. Carlos Sánchez",
      role: "Odontólogo",
      department: "Odontología General",
      status: "Activo",
      appointments: 12,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Dra. Laura Martínez",
      role: "Ortodoncista",
      department: "Ortodoncia",
      status: "Activo",
      appointments: 8,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Dr. Miguel Rodríguez",
      role: "Cirujano Maxilofacial",
      department: "Cirugía",
      status: "Ausente",
      appointments: 0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Dra. Ana López",
      role: "Odontopediatra",
      department: "Odontopediatría",
      status: "Activo",
      appointments: 10,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "Lucía Fernández",
      role: "Recepcionista",
      department: "Administración",
      status: "Activo",
      appointments: 0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Datos de ejemplo para los servicios
  const services = [
    {
      id: 1,
      name: "Limpieza Dental",
      price: 80,
      duration: "60 min",
      appointments: 25,
      revenue: 2000,
    },
    {
      id: 2,
      name: "Ortodoncia",
      price: 2500,
      duration: "45 min",
      appointments: 15,
      revenue: 3750,
    },
    {
      id: 3,
      name: "Implantes Dentales",
      price: 1200,
      duration: "120 min",
      appointments: 8,
      revenue: 9600,
    },
    {
      id: 4,
      name: "Blanqueamiento",
      price: 150,
      duration: "90 min",
      appointments: 12,
      revenue: 1800,
    },
    {
      id: 5,
      name: "Endodoncia",
      price: 350,
      duration: "75 min",
      appointments: 10,
      revenue: 3500,
    },
  ]

  // Datos de ejemplo para los ingresos mensuales
  const monthlyRevenue = [
    { month: "Enero", revenue: 12500 },
    { month: "Febrero", revenue: 13200 },
    { month: "Marzo", revenue: 14800 },
    { month: "Abril", revenue: 15500 },
    { month: "Mayo", revenue: 15800 },
  ]

  // Función para renderizar el estado del empleado
  const renderEmployeeStatus = (status) => {
    switch (status) {
      case "Activo":
        return <Badge className="bg-green-500">{status}</Badge>
      case "Ausente":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            {status}
          </Badge>
        )
      case "Vacaciones":
        return (
          <Badge variant="outline" className="text-blue-500 border-blue-500">
            {status}
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
          <div className="flex flex-col gap-2 p-4">
            <div className="py-2">
              <h2 className="px-4 text-lg font-semibold tracking-tight">Panel de Administrador</h2>
              <p className="px-4 text-xs text-muted-foreground">{admin.role}</p>
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
                  variant={activeTab === "employees" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("employees")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Empleados
                </Button>
                <Button
                  variant={activeTab === "services" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("services")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Servicios
                </Button>
                <Button
                  variant={activeTab === "finance" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("finance")}
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Finanzas
                </Button>
                <Button
                  variant={activeTab === "reports" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("reports")}
                >
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Reportes
                </Button>
              </div>
            </div>
            <div className="px-4 py-2">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Configuración
              </h2>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  <Building className="mr-2 h-4 w-4" />
                  Clínica
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  Permisos
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
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="employees">Empleados</TabsTrigger>
                <TabsTrigger value="services">Servicios</TabsTrigger>
                <TabsTrigger value="finance">Finanzas</TabsTrigger>
                <TabsTrigger value="reports">Reportes</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Bienvenido, {admin.name}</h1>
                <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
              </div>

              {/* Estadísticas generales */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statistics.totalPatients}</div>
                    <p className="text-xs text-muted-foreground">+{statistics.newPatients} nuevos este mes</p>
                    <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-primary" style={{ width: "70%" }} />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Citas</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statistics.totalAppointments}</div>
                    <p className="text-xs text-muted-foreground">{statistics.completedAppointments} completadas</p>
                    <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(statistics.completedAppointments / statistics.totalAppointments) * 100}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${statistics.totalRevenue}</div>
                    <p className="text-xs text-muted-foreground">Este mes</p>
                    <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-primary" style={{ width: "85%" }} />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${statistics.pendingPayments}</div>
                    <p className="text-xs text-muted-foreground">Por cobrar</p>
                    <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: `${(statistics.pendingPayments / statistics.totalRevenue) * 100}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Gráfico de ingresos */}
              <Card>
                <CardHeader>
                  <CardTitle>Ingresos Mensuales</CardTitle>
                  <CardDescription>Evolución de ingresos en los últimos meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <div className="flex h-full items-end gap-2">
                      {monthlyRevenue.map((month, index) => (
                        <div key={index} className="relative flex h-full flex-1 flex-col justify-end">
                          <div
                            className="bg-primary rounded-t-md w-full"
                            style={{
                              height: `${(month.revenue / Math.max(...monthlyRevenue.map((m) => m.revenue))) * 100}%`,
                            }}
                          ></div>
                          <span className="mt-2 text-xs text-center font-medium">{month.month}</span>
                          <span className="text-xs text-center text-muted-foreground">${month.revenue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Empleados y Servicios */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Empleados Activos</CardTitle>
                      <CardDescription>Resumen de personal</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("employees")}>
                      Ver todos
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {employees.slice(0, 3).map((employee) => (
                        <div key={employee.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                              <AvatarFallback>{employee.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{employee.name}</p>
                              <p className="text-xs text-muted-foreground">{employee.role}</p>
                            </div>
                          </div>
                          <div>{renderEmployeeStatus(employee.status)}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Servicios Populares</CardTitle>
                      <CardDescription>Servicios más solicitados</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("services")}>
                      Ver todos
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {services.slice(0, 3).map((service) => (
                        <div key={service.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ${service.price} - {service.duration}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{service.appointments} citas</p>
                            <p className="text-xs text-muted-foreground">${service.revenue} ingresos</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Employees Tab */}
          {activeTab === "employees" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Gestión de Empleados</h1>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Empleado
                </Button>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input type="text" placeholder="Buscar empleados..." />
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
                  <CardTitle>Directorio de Empleados</CardTitle>
                  <CardDescription>Gestiona la información de tu personal</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Empleado</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Departamento</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Citas Hoy</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                                <AvatarFallback>{employee.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span>{employee.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{employee.role}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>{renderEmployeeStatus(employee.status)}</TableCell>
                          <TableCell>{employee.appointments}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Gestión de Servicios</h1>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Servicio
                </Button>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input type="text" placeholder="Buscar servicios..." />
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
                  <CardTitle>Catálogo de Servicios</CardTitle>
                  <CardDescription>Gestiona los servicios ofrecidos por la clínica</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Servicio</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Duración</TableHead>
                        <TableHead>Citas</TableHead>
                        <TableHead>Ingresos</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell className="font-medium">{service.name}</TableCell>
                          <TableCell>${service.price}</TableCell>
                          <TableCell>{service.duration}</TableCell>
                          <TableCell>{service.appointments}</TableCell>
                          <TableCell>${service.revenue}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Finance Tab */}
          {activeTab === "finance" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Gestión Financiera</h1>
                <div className="flex gap-2">
                  <Button variant="outline">Exportar</Button>
                  <Button>Nuevo Registro</Button>
                </div>
              </div>

              {/* Resumen financiero */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${statistics.totalRevenue}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-500">+5.2%</span> vs mes anterior
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${statistics.pendingPayments}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-red-500">+12.5%</span> vs mes anterior
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Gastos</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$8,450</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-500">-3.1%</span> vs mes anterior
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Transacciones recientes */}
              <Card>
                <CardHeader>
                  <CardTitle>Transacciones Recientes</CardTitle>
                  <CardDescription>Historial de pagos y gastos</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        {
                          id: 1,
                          date: "15/05/2023",
                          description: "Pago de María González - Limpieza Dental",
                          category: "Ingreso",
                          amount: 80,
                          status: "Completado",
                        },
                        {
                          id: 2,
                          date: "14/05/2023",
                          description: "Pago de Juan Pérez - Ortodoncia",
                          category: "Ingreso",
                          amount: 150,
                          status: "Completado",
                        },
                        {
                          id: 3,
                          date: "13/05/2023",
                          description: "Compra de suministros dentales",
                          category: "Gasto",
                          amount: 450,
                          status: "Completado",
                        },
                        {
                          id: 4,
                          date: "12/05/2023",
                          description: "Pago de Ana Rodríguez - Implante Dental",
                          category: "Ingreso",
                          amount: 1200,
                          status: "Pendiente",
                        },
                        {
                          id: 5,
                          date: "10/05/2023",
                          description: "Pago de servicios públicos",
                          category: "Gasto",
                          amount: 320,
                          status: "Completado",
                        },
                      ].map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>
                            <Badge
                              variant={transaction.category === "Ingreso" ? "default" : "outline"}
                              className={
                                transaction.category === "Ingreso" ? "bg-green-500" : "text-red-500 border-red-500"
                              }
                            >
                              {transaction.category}
                            </Badge>
                          </TableCell>
                          <TableCell className={transaction.category === "Ingreso" ? "text-green-500" : "text-red-500"}>
                            {transaction.category === "Ingreso" ? "+" : "-"}${transaction.amount}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={transaction.status === "Completado" ? "default" : "outline"}
                              className={
                                transaction.status === "Completado" ? "bg-green-500" : "text-amber-500 border-amber-500"
                              }
                            >
                              {transaction.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Reportes y Estadísticas</h1>
                <div className="flex gap-2">
                  <Button variant="outline">Exportar</Button>
                  <Button>Generar Reporte</Button>
                </div>
              </div>

              {/* Reportes disponibles */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "Reporte de Ingresos",
                    description: "Análisis detallado de ingresos por servicio y período",
                    icon: <DollarSign className="h-5 w-5" />,
                  },
                  {
                    title: "Reporte de Citas",
                    description: "Estadísticas de citas completadas, canceladas y pendientes",
                    icon: <Calendar className="h-5 w-5" />,
                  },
                  {
                    title: "Reporte de Pacientes",
                    description: "Análisis demográfico y de retención de pacientes",
                    icon: <Users className="h-5 w-5" />,
                  },
                  {
                    title: "Reporte de Empleados",
                    description: "Productividad y desempeño del personal",
                    icon: <User className="h-5 w-5" />,
                  },
                  {
                    title: "Reporte de Servicios",
                    description: "Análisis de popularidad y rentabilidad de servicios",
                    icon: <FileText className="h-5 w-5" />,
                  },
                  {
                    title: "Reporte de Gastos",
                    description: "Desglose de gastos por categoría y período",
                    icon: <DollarSign className="h-5 w-5" />,
                  },
                ].map((report, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center gap-3 pb-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {report.icon}
                      </div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/50 px-6 py-3">
                      <Button variant="ghost" className="w-full">
                        Ver Reporte
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Estadísticas de rendimiento */}
              <Card>
                <CardHeader>
                  <CardTitle>Rendimiento por Servicio</CardTitle>
                  <CardDescription>Comparativa de ingresos y citas por servicio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div key={service.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <span className="font-medium">{service.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">${service.revenue}</div>
                        </div>
                        <Progress value={(service.revenue / 10000) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
