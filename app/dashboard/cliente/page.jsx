"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Home,
  LogOut,
  Settings,
  User,
  Bell,
  CheckCircle,
  XCircle,
  ChevronRight,
  X,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getServices, getDoctors, createAppointment } from "@/lib/supabase/appointments"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Estado del formulario simplificado
  const [formData, setFormData] = useState({
    service: "",
    doctor: "auto", // Por defecto, asignación automática
    reason: "",
    notes: ""
  })

  // Datos de ejemplo para el usuario
  const user = {
    name: "María González",
    email: "maria@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    nextAppointment: "28 de Junio, 2023 - 10:30 AM",
    doctor: "Dr. Carlos Sánchez",
    service: "Limpieza Dental",
  }

  // Estado para datos dinámicos
  const [services, setServices] = useState([])
  const [doctors, setDoctors] = useState([])

  // Cargar servicios y doctores al montar el componente
  useEffect(() => {
    loadServicesAndDoctors()
  }, [])

  const loadServicesAndDoctors = async () => {
    try {
      // Cargar servicios y doctores desde Supabase
      const [servicesData, doctorsData] = await Promise.all([
        getServices(),
        getDoctors()
      ])

      setServices(servicesData)
      setDoctors(doctorsData)
    } catch (error) {
      console.error("Error cargando servicios y doctores:", error)
      // Fallback a datos de ejemplo si hay error
      const mockServices = [
        { servicio_id: 1, nombre: "Limpieza Dental", descripcion: "Limpieza profesional", costo: 80, duracion: 45 },
        { servicio_id: 2, nombre: "Ortodoncia", descripcion: "Consulta de ortodoncia", costo: 150, duracion: 60 },
        { servicio_id: 3, nombre: "Implantes Dentales", descripcion: "Colocación de implante", costo: 300, duracion: 90 },
        { servicio_id: 4, nombre: "Blanqueamiento", descripcion: "Tratamiento blanqueador", costo: 120, duracion: 60 },
        { servicio_id: 5, nombre: "Endodoncia", descripcion: "Tratamiento de conducto", costo: 200, duracion: 90 },
        { servicio_id: 6, nombre: "Odontopediatría", descripcion: "Consulta pediátrica", costo: 100, duracion: 45 },
        { servicio_id: 7, nombre: "Consulta General", descripcion: "Revisión general", costo: 50, duracion: 30 }
      ]

      const mockDoctors = [
        { odontologo_id: 1, nombre: "Dr. Carlos Sánchez", especialidad: "Ortodoncista", email: "carlos@dentalcare.com" },
        { odontologo_id: 2, nombre: "Dra. Laura Martínez", especialidad: "Cirujana Oral", email: "laura@dentalcare.com" },
        { odontologo_id: 3, nombre: "Dra. Ana López", especialidad: "Odontopediatra", email: "ana@dentalcare.com" },
        { odontologo_id: 4, nombre: "Dr. Juan Pérez", especialidad: "Endodoncista", email: "juan@dentalcare.com" }
      ]

      setServices(mockServices)
      setDoctors(mockDoctors)
    }
  }

  // Funciones para manejar el formulario
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Validar que todos los campos requeridos estén completos
      if (!formData.service || !formData.reason) {
        throw new Error("Por favor completa todos los campos requeridos")
      }

      // Crear objeto de cita simplificado - el sistema asignará fecha y hora
      const appointmentData = {
        usuario_id: user?.id, // ID del usuario autenticado
        odontologo_id: formData.doctor && formData.doctor !== 'auto' ? parseInt(formData.doctor) : null, // Opcional
        servicio_id: parseInt(formData.service),
        estado: 'solicitada', // Nuevo estado para citas solicitadas
        isUser: true,
        user_phone: user?.phone || '',
        notas: formData.notes || '',
        motivo: formData.reason
      }

      console.log("Datos de la cita a enviar:", appointmentData)

      // Crear la cita en Supabase - el sistema asignará fecha y hora automáticamente
      const newAppointment = await createAppointment(appointmentData)
      console.log("Cita creada:", newAppointment)
      
      // Limpiar formulario y cerrar modal
      setFormData({
        service: "",
        doctor: "auto", // Por defecto, asignación automática
        reason: "",
        notes: ""
      })
      setIsModalOpen(false)
      
      // Aquí se podría mostrar un toast de éxito
      alert("Solicitud de cita enviada exitosamente. Te contactaremos en las próximas 24 horas para confirmar la fecha y hora.")
      
    } catch (error) {
      console.error("Error al solicitar cita:", error)
      alert(error.message || "Error al enviar la solicitud. Inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      service: "",
      doctor: "auto", // Por defecto, asignación automática
      reason: "",
      notes: ""
    })
  }

  // Datos de ejemplo para el historial médico
  const medicalHistory = [
    {
      id: 1,
      date: "15/05/2023",
      treatment: "Limpieza Dental",
      doctor: "Dr. Carlos Sánchez",
      notes: "Limpieza rutinaria. Se recomienda mejorar técnica de cepillado.",
    },
    {
      id: 2,
      date: "10/02/2023",
      treatment: "Extracción",
      doctor: "Dra. Laura Martínez",
      notes: "Extracción de muela del juicio inferior derecha. Sin complicaciones.",
    },
    {
      id: 3,
      date: "05/12/2022",
      treatment: "Empaste",
      doctor: "Dr. Carlos Sánchez",
      notes: "Empaste en molar superior izquierdo. Caries moderada.",
    },
    {
      id: 4,
      date: "20/08/2022",
      treatment: "Radiografía",
      doctor: "Dra. Ana López",
      notes: "Radiografía panorámica para evaluación general.",
    },
    {
      id: 5,
      date: "05/05/2022",
      treatment: "Limpieza Dental",
      doctor: "Dr. Carlos Sánchez",
      notes: "Limpieza rutinaria. Encías saludables.",
    },
  ]

  // Datos de ejemplo para el historial de pagos
  const paymentHistory = [
    {
      id: 1,
      date: "15/05/2023",
      amount: "$80.00",
      service: "Limpieza Dental",
      status: "Pagado",
      method: "Tarjeta de Crédito",
    },
    {
      id: 2,
      date: "10/02/2023",
      amount: "$150.00",
      service: "Extracción",
      status: "Pagado",
      method: "Efectivo",
    },
    {
      id: 3,
      date: "05/12/2022",
      amount: "$120.00",
      service: "Empaste",
      status: "Pagado",
      method: "Tarjeta de Débito",
    },
    {
      id: 4,
      date: "20/08/2022",
      amount: "$60.00",
      service: "Radiografía",
      status: "Pagado",
      method: "Seguro Dental",
    },
    {
      id: 5,
      date: "05/05/2022",
      amount: "$80.00",
      service: "Limpieza Dental",
      status: "Pagado",
      method: "Tarjeta de Crédito",
    },
  ]

  // Datos de ejemplo para el historial de citas
  const appointmentHistory = [
    {
      id: 1,
      date: "15/05/2023",
      time: "10:30 AM",
      service: "Limpieza Dental",
      doctor: "Dr. Carlos Sánchez",
      status: "Completada",
    },
    {
      id: 2,
      date: "10/02/2023",
      time: "09:00 AM",
      service: "Extracción",
      doctor: "Dra. Laura Martínez",
      status: "Completada",
    },
    {
      id: 3,
      date: "05/12/2022",
      time: "11:15 AM",
      service: "Empaste",
      doctor: "Dr. Carlos Sánchez",
      status: "Completada",
    },
    {
      id: 4,
      date: "20/08/2022",
      time: "16:00 PM",
      service: "Radiografía",
      doctor: "Dra. Ana López",
      status: "Completada",
    },
    {
      id: 5,
      date: "28/06/2023",
      time: "10:30 AM",
      service: "Limpieza Dental",
      doctor: "Dr. Carlos Sánchez",
      status: "Pendiente",
    },
  ]

  // Función para renderizar el estado de la cita con un color adecuado
  const renderAppointmentStatus = (status) => {
    switch (status) {
      case "Completada":
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

  return (
    <div className="flex min-h-screen flex-col">
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
          <div className="flex flex-col gap-2 p-4">
            <div className="py-2">
              <h2 className="px-4 text-lg font-semibold tracking-tight">Panel de Paciente</h2>
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
                  variant={activeTab === "medical" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("medical")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Historial Médico
                </Button>
                <Button
                  variant={activeTab === "payments" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("payments")}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pagos
                </Button>
              </div>
            </div>
            {/* <div className="px-4 py-2">
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
            </div> */}
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
                <TabsTrigger value="medical">Historial</TabsTrigger>
                <TabsTrigger value="payments">Pagos</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Bienvenido, {user.name}</h1>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Próxima Cita */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Próxima Cita</CardTitle>
                    <CardDescription>Tu próxima visita al dentista</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{user.nextAppointment}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{user.doctor}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{user.service}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Reprogramar
                    </Button>
                  </CardFooter>
                </Card>

                {/* Resumen Médico */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Resumen Médico</CardTitle>
                    <CardDescription>Tu historial reciente</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Última visita:</span>
                        <span>{medicalHistory[0].date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tratamiento:</span>
                        <span>{medicalHistory[0].treatment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Doctor:</span>
                        <span>{medicalHistory[0].doctor}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("medical")}>
                      Ver Historial Completo
                    </Button>
                  </CardFooter>
                </Card>

                {/* Resumen de Pagos */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Resumen de Pagos</CardTitle>
                    <CardDescription>Tus pagos recientes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Último pago:</span>
                        <span>{paymentHistory[0].date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monto:</span>
                        <span>{paymentHistory[0].amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Servicio:</span>
                        <span>{paymentHistory[0].service}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("payments")}>
                      Ver Todos los Pagos
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Citas Recientes */}
              <Card>
                <CardHeader>
                  <CardTitle>Citas Recientes</CardTitle>
                  <CardDescription>Tus últimas 3 citas</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Servicio</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointmentHistory.slice(0, 3).map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>{appointment.date}</TableCell>
                          <TableCell>{appointment.time}</TableCell>
                          <TableCell>{appointment.service}</TableCell>
                          <TableCell>{appointment.doctor}</TableCell>
                          <TableCell>{renderAppointmentStatus(appointment.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("appointments")}>
                    Ver Todas las Citas
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === "appointments" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Historial de Citas</h1>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Solicitar Nueva Cita
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Todas tus Citas</CardTitle>
                  <CardDescription>Historial completo de citas</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Servicio</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointmentHistory.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>{appointment.date}</TableCell>
                          <TableCell>{appointment.time}</TableCell>
                          <TableCell>{appointment.service}</TableCell>
                          <TableCell>{appointment.doctor}</TableCell>
                          <TableCell>{renderAppointmentStatus(appointment.status)}</TableCell>
                          <TableCell className="text-right">
                            {appointment.status === "Pendiente" && (
                              <Button variant="ghost" size="sm">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Medical History Tab */}
          {activeTab === "medical" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Historial Médico</h1>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Tu Historial Médico</CardTitle>
                  <CardDescription>Registro de todos tus tratamientos</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Tratamiento</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Notas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {medicalHistory.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{record.treatment}</TableCell>
                          <TableCell>{record.doctor}</TableCell>
                          <TableCell>{record.notes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Historial de Pagos</h1>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Tus Pagos</CardTitle>
                  <CardDescription>Registro de todos tus pagos</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Servicio</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Método de Pago</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentHistory.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{payment.date}</TableCell>
                          <TableCell>{payment.amount}</TableCell>
                          <TableCell>{payment.service}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-500 text-white">
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{payment.method}</TableCell>
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

      {/* Modal para Solicitar Cita */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Solicitar Nueva Cita
            </DialogTitle>
            <DialogDescription>
              Completa el formulario para solicitar una cita. Nuestro sistema de agendamiento inteligente asignará automáticamente la fecha y hora más conveniente según la disponibilidad de nuestros odontólogos.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Servicio */}
            <div className="space-y-2">
              <Label htmlFor="service">Servicio *</Label>
              <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un servicio" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.servicio_id} value={service.servicio_id.toString()}>
                      <div className="flex justify-between items-center w-full">
                        <span>{service.nombre}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          {service.duracion} min • ${service.costo}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Doctor */}
            <div className="space-y-2">
              <Label htmlFor="doctor">Doctor Preferido (Opcional)</Label>
              <Select value={formData.doctor} onValueChange={(value) => handleInputChange('doctor', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Deja en blanco para asignación automática" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Asignación automática</span>
                      <span className="text-xs text-muted-foreground">El sistema elegirá el doctor más disponible</span>
                    </div>
                  </SelectItem>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.odontologo_id} value={doctor.odontologo_id.toString()}>
                      <div className="flex flex-col">
                        <span>{doctor.nombre}</span>
                        <span className="text-sm text-muted-foreground">{doctor.especialidad}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Motivo de la consulta */}
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo de la Consulta *</Label>
              <Textarea
                id="reason"
                placeholder="Describe brevemente el motivo de tu consulta..."
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                rows={3}
                required
              />
            </div>

            {/* Notas adicionales */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionales</Label>
              <Textarea
                id="notes"
                placeholder="Información adicional que consideres importante..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={2}
              />
            </div>

            {/* Información adicional */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Proceso de Agendamiento</p>
                  <p className="text-blue-700 mt-1">
                    Una vez enviada tu solicitud, nuestro sistema analizará la disponibilidad de nuestros odontólogos 
                    y te contactaremos en las próximas 24 horas para confirmar la fecha y hora asignada.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm()
                  setIsModalOpen(false)
                }}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Enviar Solicitud
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

