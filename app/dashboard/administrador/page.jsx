"use client"

import { useState, useEffect } from "react"
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
  X,
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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { useUser } from "@/context/user-context"
import { handleClientScriptLoad } from "next/script"
import { 
  getDoctors, 
  getUsers, 
  createDoctor, 
  convertUserToDoctor, 
  updateDoctor, 
  deleteDoctor,
  getDoctorsWithUserInfo 
} from "@/lib/supabase/appointments"

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    costo: ""
  });
  const [formLoading, setFormLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  
  // Estado para gestión de empleados
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [showCreateDoctorModal, setShowCreateDoctorModal] = useState(false);
  const [showConvertUserModal, setShowConvertUserModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [doctorFormData, setDoctorFormData] = useState({
    nombre: "",
    especialidad: "General",
    email: "",
    telefono: "",
    activo: true
  });
  const [selectedUserId, setSelectedUserId] = useState("");
  
  const router = useRouter();
  const { user } = useUser();

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

  // Datos de ejemplo para los ingresos mensuales
  const monthlyRevenue = [
    { month: "Enero", revenue: 12500 },
    { month: "Febrero", revenue: 13200 },
    { month: "Marzo", revenue: 14800 },
    { month: "Abril", revenue: 15500 },
    { month: "Mayo", revenue: 15800 },
  ]

  // Función para cargar servicios desde Supabase
  const loadServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('servicio')
        .select('*')
        .order('nombre');

      if (error) {
        console.error('Error al cargar servicios:', error);
        return;
      }

      setServices(data || []);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar odontólogos
  const loadDoctors = async () => {
    try {
      const data = await getDoctorsWithUserInfo();
      setDoctors(data || []);
    } catch (error) {
      console.error('Error al cargar odontólogos:', error);
    }
  };

  // Función para cargar usuarios (para convertir en odontólogos)
  const loadUsers = async () => {
    try {
      const data = await getUsers();
      // Filtrar solo usuarios que no son empleados
      const nonEmployeeUsers = data.filter(user => user.rol !== 'empleado');
      setUsers(nonEmployeeUsers || []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  // Función para crear un nuevo odontólogo desde cero
  const createNewDoctor = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      await createDoctor(doctorFormData);
      await loadDoctors();
      setShowCreateDoctorModal(false);
      setDoctorFormData({
        nombre: "",
        especialidad: "General",
        email: "",
        telefono: "",
        activo: true
      });
      alert('Odontólogo creado exitosamente');
    } catch (error) {
      console.error('Error creando odontólogo:', error);
      alert(`Error creando odontólogo: ${error.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  // Función para convertir un usuario en odontólogo
  const convertUserToDoctorHandler = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      const selectedUser = users.find(u => u.id === selectedUserId);
      if (!selectedUser) {
        throw new Error('Usuario no encontrado');
      }

      const doctorData = {
        ...doctorFormData,
        usuario_id: selectedUserId
      };

      await convertUserToDoctor(selectedUserId, doctorData);
      await loadDoctors();
      await loadUsers(); // Recargar usuarios para actualizar la lista
      setShowConvertUserModal(false);
      setDoctorFormData({
        nombre: "",
        especialidad: "General",
        email: "",
        telefono: "",
        activo: true
      });
      setSelectedUserId("");
      alert('Usuario convertido a odontólogo exitosamente');
    } catch (error) {
      console.error('Error convirtiendo usuario a odontólogo:', error);
      alert(`Error convirtiendo usuario: ${error.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  // Función para eliminar un odontólogo
  const deleteDoctorHandler = async (odontologoId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este odontólogo?')) {
      return;
    }
    
    try {
      await deleteDoctor(odontologoId);
      await loadDoctors();
      alert('Odontólogo eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando odontólogo:', error);
      alert(`Error eliminando odontólogo: ${error.message}`);
    }
  };

  // Función para eliminar un servicio
  const deleteService = async (serviceId) => {
    // Verificar que el usuario sea administrador
    if (!user || user.role !== 'admin') {
      alert('Solo los administradores pueden eliminar servicios');
      return;
    }
    
    // Confirmar eliminación
    if (!confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('servicio')
        .delete()
        .eq('servicio_id', serviceId);

      if (error) {
        console.error('Error al eliminar servicio:', error);
        alert(`Error al eliminar servicio: ${error.message}`);
        return;
      }

      // Recargar servicios después de eliminar
      await loadServices();
      
      alert('Servicio eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      alert('Error al eliminar el servicio');
    }
  };

  // Función para crear un nuevo servicio
  const createService = async (e) => {
    e.preventDefault();
    
    // Verificar que el usuario sea administrador
    if (!user || user.role !== 'admin') {
      alert('Solo los administradores pueden crear servicios');
      return;
    }
    
    // Validación básica
    if (!formData.nombre.trim()) {
      alert('El nombre del servicio es requerido');
      return;
    }
    
    if (!formData.costo || parseFloat(formData.costo) <= 0) {
      alert('El costo debe ser mayor a 0');
      return;
    }
    
    try {
      setFormLoading(true);
      
      const { data, error } = await supabase
        .from('servicio')
        .insert([{
          nombre: formData.nombre.trim(),
          descripcion: formData.descripcion.trim() || null,
          costo: parseInt(formData.costo)
        }])
        .select();

      if (error) {
        console.error('Error al crear servicio:', error);
        alert(`Error al crear servicio: ${error.message}`);
        return;
      }

      // Limpiar formulario y cerrar modal
      setFormData({ nombre: "", descripcion: "", costo: "" });
      setShowCreateModal(false);
      
      // Recargar servicios
      await loadServices();
      
      alert('Servicio creado exitosamente');
    } catch (error) {
      console.error('Error al crear servicio:', error);
      alert('Error al crear el servicio');
    } finally {
      setFormLoading(false);
    }
  };

  // Función para editar un servicio
  const updateService = async (e) => {
    e.preventDefault();
    
    // Verificar que el usuario sea administrador
    if (!user || user.role !== 'admin') {
      alert('Solo los administradores pueden editar servicios');
      return;
    }
    
    // Validación básica
    if (!formData.nombre.trim()) {
      alert('El nombre del servicio es requerido');
      return;
    }
    
    if (!formData.costo || parseFloat(formData.costo) <= 0) {
      alert('El costo debe ser mayor a 0');
      return;
    }
    
    try {
      setFormLoading(true);
      
      const { data, error } = await supabase
        .from('servicio')
        .update({
          nombre: formData.nombre.trim(),
          descripcion: formData.descripcion.trim() || null,
          costo: parseFloat(formData.costo)
        })
        .eq('servicio_id', editingService.servicio_id)
        .select();

      if (error) {
        console.error('Error al actualizar servicio:', error);
        alert(`Error al actualizar servicio: ${error.message}`);
        return;
      }

      // Limpiar formulario y cerrar modal
      setFormData({ nombre: "", descripcion: "", costo: "" });
      setEditingService(null);
      setShowEditModal(false);
      
      // Recargar servicios
      await loadServices();
      
      alert('Servicio actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar servicio:', error);
      alert('Error al actualizar el servicio');
    } finally {
      setFormLoading(false);
    }
  };

  // Función para abrir modal de edición
  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      nombre: service.nombre || "",
      descripcion: service.descripcion || "",
      costo: service.costo ? service.costo.toString() : ""
    });
    setShowEditModal(true);
  };

  // Función para abrir modal de creación
  const openCreateModal = () => {
    setFormData({ 
      nombre: "", 
      descripcion: "", 
      costo: "" 
    });
    setShowCreateModal(true);
  };

  // Función para cerrar modales
  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingService(null);
    setFormData({ 
      nombre: "", 
      descripcion: "", 
      costo: "" 
    });
  };

  // Filtrar servicios basado en el término de búsqueda
  const filteredServices = services.filter(service =>
    service.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.descripcion && service.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Función para probar la conexión con Supabase
  const testSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('servicio')
        .select('*')
        .limit(3);
      
      if (error) {
        console.error('Error de conexión:', error);
        alert(`Error de conexión: ${error.message}`);
        return;
      }
      
      console.log('Conexión exitosa. Servicios:', data);
      alert('Conexión exitosa con Supabase');
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  // Cargar servicios al montar el componente
  useEffect(() => {
    console.log('Usuario en dashboard admin:', user);
    testSupabaseConnection();
    loadServices();
    loadDoctors();
    loadUsers();
  }, []);

  // Efecto separado para cuando el usuario cambie
  useEffect(() => {
    if (user) {
      console.log('Usuario actualizado en dashboard admin:', user);
    }
  }, [user]);

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
  const handleLogout = async () => {
  await supabase.auth.signOut();
  console.log("Sesión cerrada");
  router.push('/');
};

  // Nueva función para manejar selección de servicios
  const handleSelectService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedServices.length === filteredServices.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(filteredServices.map((s) => s.servicio_id));
    }
  };

  // Nueva función para eliminar varios servicios
  const deleteSelectedServices = async () => {
    if (!user || user.role !== 'admin') {
      alert('Solo los administradores pueden eliminar servicios');
      return;
    }
    if (selectedServices.length === 0) {
      alert('Selecciona al menos un servicio para eliminar.');
      return;
    }
    if (!confirm('¿Estás seguro de que quieres eliminar los servicios seleccionados?')) {
      return;
    }
    try {
      const { error } = await supabase
        .from('servicio')
        .delete()
        .in('servicio_id', selectedServices);
      if (error) {
        alert('Error al eliminar servicios: ' + error.message);
        return;
      }
      setSelectedServices([]);
      await loadServices();
      alert('Servicios eliminados exitosamente');
    } catch (error) {
      alert('Error al eliminar los servicios');
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
          <div className="flex flex-col gap-2 p-4">
            <div className="py-2">
              <h2 className="px-4 text-lg font-semibold tracking-tight">Panel de Administrador</h2>
              <p className="px-4 text-xs text-muted-foreground">
                {user ? `${user.role || 'Sin rol'} - ${user.email}` : 'Cargando...'}
              </p>
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
                <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-500 hover:text-red-500">
                  <LogOut  className="mr-2 h-4 w-4" />
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
                      {loading ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        </div>
                      ) : services.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No hay servicios disponibles
                        </p>
                      ) : (
                        services.slice(0, 3).map((service) => (
                          <div key={service.servicio_id} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{service.nombre}</p>
                              <p className="text-xs text-muted-foreground">
                                ${service.costo}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground max-w-xs truncate">
                                {service.descripcion || "Sin descripción"}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
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
                <h1 className="text-2xl font-bold tracking-tight">Gestión de Odontólogos</h1>
                <div className="flex gap-2">
                  <Button onClick={() => setShowCreateDoctorModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Odontólogo
                  </Button>
                  <Button variant="outline" onClick={() => setShowConvertUserModal(true)}>
                    <Users className="mr-2 h-4 w-4" />
                    Convertir Usuario
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input type="text" placeholder="Buscar odontólogos..." />
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
                  <CardTitle>Directorio de Odontólogos</CardTitle>
                  <CardDescription>Gestiona la información de tu personal odontológico</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">Cargando odontólogos...</p>
                      </div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Odontólogo</TableHead>
                          <TableHead>Especialidad</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Teléfono</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {doctors.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <p className="text-muted-foreground">
                                No hay odontólogos registrados. Crea el primero para comenzar.
                              </p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          doctors.map((doctor) => (
                            <TableRow key={doctor.odontologo_id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src="/placeholder.svg" alt={doctor.nombre} />
                                    <AvatarFallback>{doctor.nombre.substring(0, 2)}</AvatarFallback>
                                  </Avatar>
                                  <span>{doctor.nombre}</span>
                                </div>
                              </TableCell>
                              <TableCell>{doctor.especialidad}</TableCell>
                              <TableCell>{doctor.email}</TableCell>
                              <TableCell>{doctor.telefono}</TableCell>
                              <TableCell>
                                <Badge variant={doctor.activo ? "default" : "secondary"}>
                                  {doctor.activo ? "Activo" : "Inactivo"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-red-500"
                                    onClick={() => deleteDoctorHandler(doctor.odontologo_id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Gestión de Servicios</h1>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={testSupabaseConnection}>
                    Probar Conexión
                  </Button>
                  <Button onClick={openCreateModal}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Servicio
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input 
                    type="text" 
                    placeholder="Buscar servicios..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
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
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">Cargando servicios...</p>
                      </div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            <input
                              type="checkbox"
                              checked={selectedServices.length === filteredServices.length && filteredServices.length > 0}
                              onChange={handleSelectAll}
                            />
                          </TableHead>
                          <TableHead>Servicio</TableHead>
                          <TableHead>Descripción</TableHead>
                          <TableHead>Precio</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredServices.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                              <p className="text-muted-foreground">
                                {searchTerm ? 'No se encontraron servicios que coincidan con la búsqueda.' : 'No hay servicios disponibles.'}
                              </p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredServices.map((service) => (
                            <TableRow key={service.servicio_id}>
                              <TableCell>
                                <input
                                  type="checkbox"
                                  checked={selectedServices.includes(service.servicio_id)}
                                  onChange={() => handleSelectService(service.servicio_id)}
                                />
                              </TableCell>
                              <TableCell className="font-medium">{service.nombre}</TableCell>
                              <TableCell className="max-w-xs truncate">{service.descripcion || "Sin descripción"}</TableCell>
                              <TableCell>${service.costo}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => openEditModal(service)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-red-500"
                                    onClick={() => deleteService(service.servicio_id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                  {selectedServices.length > 0 && (
                    <div className="flex justify-end mt-2">
                      <Button variant="destructive" onClick={deleteSelectedServices}>
                        Eliminar seleccionados ({selectedServices.length})
                      </Button>
                    </div>
                  )}
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
                      <div key={service.servicio_id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <span className="font-medium">{service.nombre}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">${service.costo}</div>
                        </div>
                        <Progress value={(service.costo / 1000) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Modal para crear nuevo servicio */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Crear Nuevo Servicio</h2>
              <Button variant="ghost" size="icon" onClick={closeModals}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={createService} className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre del Servicio</Label>
                <Input
                  id="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Limpieza Dental"
                  required
                />
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción detallada del servicio"
                  required
                />
              </div>
              <div>
                <Label htmlFor="costo">Costo ($)</Label>
                <Input
                  id="costo"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.costo}
                  onChange={(e) => setFormData({ ...formData, costo: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeModals} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" disabled={formLoading} className="flex-1">
                  {formLoading ? "Creando..." : "Crear Servicio"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para editar servicio */}
      {showEditModal && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Editar Servicio</h2>
              <Button variant="ghost" size="icon" onClick={closeModals}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={updateService} className="space-y-4">
              <div>
                <Label htmlFor="edit-nombre">Nombre del Servicio</Label>
                <Input
                  id="edit-nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Limpieza Dental"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-descripcion">Descripción</Label>
                <Textarea
                  id="edit-descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción detallada del servicio"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-costo">Costo ($)</Label>
                <Input
                  id="edit-costo"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.costo}
                  onChange={(e) => setFormData({ ...formData, costo: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeModals} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" disabled={formLoading} className="flex-1">
                  {formLoading ? "Actualizando..." : "Actualizar Servicio"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para crear nuevo odontólogo */}
      {showCreateDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Crear Nuevo Odontólogo</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateDoctorModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={createNewDoctor} className="space-y-4">
              <div>
                <Label htmlFor="doctor-nombre">Nombre Completo</Label>
                <Input
                  id="doctor-nombre"
                  type="text"
                  value={doctorFormData.nombre}
                  onChange={(e) => setDoctorFormData({ ...doctorFormData, nombre: e.target.value })}
                  placeholder="Dr. Juan Pérez"
                  required
                />
              </div>
              <div>
                <Label htmlFor="doctor-especialidad">Especialidad</Label>
                <select
                  id="doctor-especialidad"
                  value={doctorFormData.especialidad}
                  onChange={(e) => setDoctorFormData({ ...doctorFormData, especialidad: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="General">Odontología General</option>
                  <option value="Ortodoncia">Ortodoncia</option>
                  <option value="Endodoncia">Endodoncia</option>
                  <option value="Cirugía">Cirugía Maxilofacial</option>
                  <option value="Odontopediatría">Odontopediatría</option>
                  <option value="Periodoncia">Periodoncia</option>
                  <option value="Implantología">Implantología</option>
                </select>
              </div>
              <div>
                <Label htmlFor="doctor-email">Email</Label>
                <Input
                  id="doctor-email"
                  type="email"
                  value={doctorFormData.email}
                  onChange={(e) => setDoctorFormData({ ...doctorFormData, email: e.target.value })}
                  placeholder="doctor@dentallux.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="doctor-telefono">Teléfono</Label>
                <Input
                  id="doctor-telefono"
                  type="tel"
                  value={doctorFormData.telefono}
                  onChange={(e) => setDoctorFormData({ ...doctorFormData, telefono: e.target.value })}
                  placeholder="+1 234 567 8900"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="doctor-activo"
                  checked={doctorFormData.activo}
                  onChange={(e) => setDoctorFormData({ ...doctorFormData, activo: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="doctor-activo">Odontólogo Activo</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateDoctorModal(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" disabled={formLoading} className="flex-1">
                  {formLoading ? "Creando..." : "Crear Odontólogo"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para convertir usuario en odontólogo */}
      {showConvertUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Convertir Usuario en Odontólogo</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowConvertUserModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={convertUserToDoctorHandler} className="space-y-4">
              <div>
                <Label htmlFor="user-select">Seleccionar Usuario</Label>
                <select
                  id="user-select"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Selecciona un usuario...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="convert-nombre">Nombre Profesional</Label>
                <Input
                  id="convert-nombre"
                  type="text"
                  value={doctorFormData.nombre}
                  onChange={(e) => setDoctorFormData({ ...doctorFormData, nombre: e.target.value })}
                  placeholder="Dr. Juan Pérez"
                  required
                />
              </div>
              <div>
                <Label htmlFor="convert-especialidad">Especialidad</Label>
                <select
                  id="convert-especialidad"
                  value={doctorFormData.especialidad}
                  onChange={(e) => setDoctorFormData({ ...doctorFormData, especialidad: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="General">Odontología General</option>
                  <option value="Ortodoncia">Ortodoncia</option>
                  <option value="Endodoncia">Endodoncia</option>
                  <option value="Cirugía">Cirugía Maxilofacial</option>
                  <option value="Odontopediatría">Odontopediatría</option>
                  <option value="Periodoncia">Periodoncia</option>
                  <option value="Implantología">Implantología</option>
                </select>
              </div>
              <div>
                <Label htmlFor="convert-email">Email Profesional</Label>
                <Input
                  id="convert-email"
                  type="email"
                  value={doctorFormData.email}
                  onChange={(e) => setDoctorFormData({ ...doctorFormData, email: e.target.value })}
                  placeholder="doctor@dentallux.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="convert-telefono">Teléfono Profesional</Label>
                <Input
                  id="convert-telefono"
                  type="tel"
                  value={doctorFormData.telefono}
                  onChange={(e) => setDoctorFormData({ ...doctorFormData, telefono: e.target.value })}
                  placeholder="+1 234 567 8900"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="convert-activo"
                  checked={doctorFormData.activo}
                  onChange={(e) => setDoctorFormData({ ...doctorFormData, activo: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="convert-activo">Odontólogo Activo</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowConvertUserModal(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" disabled={formLoading} className="flex-1">
                  {formLoading ? "Convirtiendo..." : "Convertir a Odontólogo"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
