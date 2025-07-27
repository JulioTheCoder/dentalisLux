"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Phone, Mail, CheckCircle, MessageCircle } from "lucide-react"
import { AuthButtons } from "./components/auth-buttons"
import { AppointmentForm } from "./components/appointment-form"
import { DebugAuth } from "./components/debug-auth"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

// Modificar la función Home para incluir la funcionalidad de desplazamiento suave
export default function Home() {
  const router = useRouter();
  // Agregar un estado para controlar la visibilidad del menú móvil
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    // Suscribirse a los cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Tuki");
      console.log(event, session);

      if (session?.user) {
        console.log("Usuario ha iniciado sesión:", session.user.id);
        const { data: userData, error: userError } = await supabase
          .from("usuario")
          .select("rol")
          .eq("id", session.user.id)
          .single();

        
        // Aquí puedes redirigir según el rol si lo necesitas
        if (userData.rol === "admin") {
          router.push("/dashboard/administrador");
        } else if (userData.rol === "empleado") {
          router.push("/dashboard/empleado");
        } else if (userData.rol === "usuario") {
          router.push("/dashboard/cliente");
        } else {
          console.error("Rol de usuario no reconocido:", userData.rol);
          // Aquí podrías manejar el caso de un rol no reconocido, por ejemplo, redirigir a una página de error
        }
      
      }
      
    });

    // Efecto para detectar scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };

  // Limpiar la suscripción al desmontar el componente
  return () => {
    authListener?.subscription.unsubscribe();
  };
}, []);
    

  // Función para manejar el clic en los enlaces de navegación
  const handleNavLinkClick = (e, sectionId) => {
    e.preventDefault()

    // Cerrar el menú móvil si está abierto
    if (mobileMenuOpen) {
      setMobileMenuOpen(false)
    }

    // Obtener la sección a la que se desea desplazar
    const section = document.getElementById(sectionId)

    if (section) {
      // Desplazamiento suave a la sección
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-lg' 
          : 'bg-background/80 backdrop-blur-md'
      }`}>
        <div className="flex h-16 items-center justify-between w-auto py-4 px-0 mx-4">
          <div className="flex items-center gap-4 group">
            <Image
              src="/logo.png?height=48&width=48"
              alt="Logo"
              width={48}
              height={48}
              className="rounded-full transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Dentalis Lux
            </span>
          </div>
          <nav className="hidden md:flex gap-8">
            <a 
              href="#inicio" 
              onClick={(e) => handleNavLinkClick(e, "inicio")} 
              className="text-sm font-medium relative group transition-colors duration-200 hover:text-primary"
            >
              Inicio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#servicios" 
              onClick={(e) => handleNavLinkClick(e, "servicios")} 
              className="text-sm font-medium relative group transition-colors duration-200 hover:text-primary"
            >
              Servicios
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#nosotros" 
              onClick={(e) => handleNavLinkClick(e, "nosotros")} 
              className="text-sm font-medium relative group transition-colors duration-200 hover:text-primary"
            >
              Nosotros
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#contacto" 
              onClick={(e) => handleNavLinkClick(e, "contacto")} 
              className="text-sm font-medium relative group transition-colors duration-200 hover:text-primary"
            >
              Contacto
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <AppointmentForm />
            <AuthButtons />
          </div>
          {/* Botón de menú hamburguesa */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden transition-all duration-200 hover:bg-primary hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 transition-transform duration-200"
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </>
              )}
            </svg>
          </Button>
        </div>
      </header>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b animate-slide-in-down">
          <div className="container py-6 flex flex-col space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <a 
                href="#inicio" 
                onClick={(e) => handleNavLinkClick(e, "inicio")} 
                className="text-base font-medium py-3 px-4 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center gap-3"
              >
                <span className="text-lg">🏠</span>
                Inicio
              </a>
              <a
                href="#servicios"
                onClick={(e) => handleNavLinkClick(e, "servicios")}
                className="text-base font-medium py-3 px-4 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center gap-3"
              >
                <span className="text-lg">🦷</span>
                Servicios
              </a>
              <a 
                href="#nosotros" 
                onClick={(e) => handleNavLinkClick(e, "nosotros")} 
                className="text-base font-medium py-3 px-4 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center gap-3"
              >
                <span className="text-lg">🏥</span>
                Nosotros
              </a>
              <a 
                href="#contacto" 
                onClick={(e) => handleNavLinkClick(e, "contacto")} 
                className="text-base font-medium py-3 px-4 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center gap-3"
              >
                <span className="text-lg">📞</span>
                Contacto
              </a>
            </div>
            
            <div className="pt-4 border-t border-muted">
              <div className="space-y-3">
                <AppointmentForm className="w-full bg-primary text-white hover:bg-primary/90" />
                <AuthButtons />
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Gradiente de fondo animado */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 animate-gradient">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          
          {/* Patrón de fondo sutil */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
          </div>

          {/* Elementos decorativos de odontología */}
          
          {/* Dientes flotantes */}
          <div className="absolute top-20 left-10 opacity-20 animate-float">
            <div className="text-6xl">🦷</div>
          </div>
          <div className="absolute top-40 right-20 opacity-15 animate-float animation-delay-1000">
            <div className="text-4xl">🦷</div>
          </div>
          <div className="absolute bottom-40 left-20 opacity-20 animate-float animation-delay-2000">
            <div className="text-5xl">🦷</div>
          </div>
          <div className="absolute bottom-20 right-10 opacity-15 animate-float animation-delay-1500">
            <div className="text-3xl">🦷</div>
          </div>

          {/* Herramientas dentales */}
          <div className="absolute top-32 left-1/4 opacity-10 animate-float animation-delay-500">
            <div className="text-3xl">🔬</div>
          </div>
          <div className="absolute top-60 right-1/3 opacity-15 animate-float animation-delay-1200">
            <div className="text-4xl">💉</div>
          </div>
          <div className="absolute bottom-60 left-1/3 opacity-10 animate-float animation-delay-1800">
            <div className="text-3xl">🪑</div>
          </div>

          {/* Símbolos médicos */}
          <div className="absolute top-1/4 right-10 opacity-20 animate-float animation-delay-800">
            <div className="text-5xl">⚕️</div>
          </div>
          <div className="absolute bottom-1/3 right-1/4 opacity-15 animate-float animation-delay-1600">
            <div className="text-4xl">🏥</div>
          </div>

          {/* Líneas decorativas con forma de dientes */}
          <div className="absolute top-0 left-0 w-full h-32 opacity-5">
            <div className="flex justify-between px-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="text-2xl animate-float" style={{animationDelay: `${i * 0.3}s`}}>
                  🦷
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-32 opacity-5">
            <div className="flex justify-between px-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="text-2xl animate-float" style={{animationDelay: `${i * 0.3 + 1}s`}}>
                  🦷
                </div>
              ))}
            </div>
          </div>

          {/* Círculos decorativos con símbolos dentales */}
          <div className="absolute top-1/2 left-8 w-16 h-16 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center animate-float animation-delay-300">
            <div className="text-xl">🦷</div>
          </div>
          <div className="absolute top-1/3 right-8 w-12 h-12 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center animate-float animation-delay-700">
            <div className="text-lg">⚕️</div>
          </div>
          <div className="absolute bottom-1/3 left-12 w-14 h-14 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center animate-float animation-delay-1100">
            <div className="text-lg">🔬</div>
          </div>

          {/* Contenido principal */}
          <div className="container relative z-10 flex flex-col items-center justify-center py-24 text-center text-white">
            {/* Badge animado */}
            <div className="mb-6 animate-fade-in-up">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium">
                🦷 Cuidamos tu sonrisa
              </span>
            </div>

            {/* Título principal con animación */}
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-7xl lg:text-8xl animate-fade-in-up animation-delay-200">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Sonrisas saludables
              </span>
              <br />
              <span className="text-white/90">para toda la familia</span>
            </h1>

            {/* Descripción con animación */}
            <p className="mt-6 max-w-[700px] text-lg md:text-xl text-white/80 animate-fade-in-up animation-delay-400 leading-relaxed">
              Ofrecemos atención dental de calidad con tecnología avanzada y un equipo profesional comprometido con su
              bienestar. Su sonrisa es nuestra prioridad.
            </p>

            {/* Botones con efectos mejorados */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row animate-fade-in-up animation-delay-600">
              <AppointmentForm 
                className="bg-white text-primary hover:bg-white/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl" 
                variant="default" 
              />
              <Button
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={(e) => handleNavLinkClick(e, "servicios")}
              >
                <span className="mr-2">👨‍⚕️</span>
                Nuestros Servicios
              </Button>
            </div>

            {/* Scroll indicator con tema dental */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
              </div>
              <div className="text-center mt-2 text-white/60 text-sm"></div>
            </div>
          </div>
        </section>

        {/* Info Bar */}
        <section className="border-y bg-muted/50">
          <div className="container grid grid-cols-1 gap-6 py-8 md:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Horario de Atención</h3>
                <p className="text-sm text-muted-foreground">Lun - Vie: 9:00 - 19:00</p>
                <p className="text-sm text-muted-foreground">Sáb: 9:00 - 14:00</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Contáctenos</h3>
                <p className="text-sm text-muted-foreground">+123 456 7890</p>
                <p className="text-sm text-muted-foreground">info@dentalcare.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Ubicación</h3>
                <p className="text-sm text-muted-foreground">Av. Principal 123</p>
                <p className="text-sm text-muted-foreground">Ciudad, País</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="servicios" className="py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="container">
            {/* Header de la sección */}
            <div className="mx-auto max-w-[800px] text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                🦷 Nuestros Servicios
              </div>
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Cuidamos tu sonrisa
              </h2>
              <p className="mt-6 text-lg text-muted-foreground max-w-[600px] mx-auto leading-relaxed">
                Ofrecemos una amplia gama de servicios dentales con tecnología de vanguardia para satisfacer todas sus necesidades.
              </p>
            </div>

            {/* Grid de servicios */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Limpieza Dental",
                  description: "Eliminación profesional de placa y sarro para prevenir caries y enfermedades de las encías.",
                  icon: "/limpieza-dental.svg?height=48&width=48",
                  price: "Desde $50",
                  duration: "45 min",
                  features: ["Limpieza profunda", "Eliminación de sarro", "Pulido dental"]
                },
                {
                  title: "Ortodoncia",
                  description: "Corrección de la posición de los dientes y mejora de la mordida con brackets o alineadores.",
                  icon: "/ortodoncia-en-dientes.svg?height=48&width=48",
                  price: "Desde $2,500",
                  duration: "18-24 meses",
                  features: ["Brackets metálicos", "Brackets estéticos", "Invisalign"]
                },
                {
                  title: "Implantes Dentales",
                  description: "Reemplazo permanente de dientes perdidos con implantes de titanio y coronas de alta calidad.",
                  icon: "/implante-dental.svg?height=48&width=48",
                  price: "Desde $3,500",
                  duration: "3-6 meses",
                  features: ["Implante de titanio", "Corona personalizada", "Garantía de por vida"]
                },
                {
                  title: "Blanqueamiento",
                  description: "Procedimientos avanzados para aclarar el color de los dientes y mejorar su sonrisa.",
                  icon: "/blanqueamiento-dental.svg?height=48&width=48",
                  price: "Desde $200",
                  duration: "1 hora",
                  features: ["Blanqueamiento profesional", "Kit para casa", "Resultados inmediatos"]
                },
                {
                  title: "Endodoncia",
                  description: "Tratamiento de conducto para salvar dientes con infección o daño en el nervio.",
                  icon: "/endodoncia-dental.svg?height=48&width=48",
                  price: "Desde $800",
                  duration: "1-2 horas",
                  features: ["Anestesia local", "Tecnología digital", "Sin dolor"]
                },
                {
                  title: "Odontopediatría",
                  description: "Atención especializada para niños en un ambiente amigable, seguro y divertido.",
                  icon: "/odontopediatria-dental.svg?height=48&width=48",
                  price: "Desde $80",
                  duration: "30-60 min",
                  features: ["Ambiente infantil", "Técnicas suaves", "Educación dental"]
                },
              ].map((service, index) => (
                <Card 
                  key={index} 
                  className="group overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-200 bg-white"
                >
                  <CardContent className="p-6">
                    {/* Header del servicio */}
                    <div className="text-center mb-4">
                      <div className="mb-3">
                        <div className="h-16 w-16 mx-auto overflow-hidden rounded-xl bg-primary/10 p-3">
                          <Image
                            src={service.icon || "/placeholder.svg"}
                            alt={service.title}
                            width={48}
                            height={48}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-primary mb-2">
                        {service.title}
                      </h3>
                    </div>

                    {/* Descripción */}
                    <p className="text-muted-foreground text-center mb-4 text-sm leading-relaxed">
                      {service.description}
                    </p>

                    {/* Precio y duración */}
                    <div className="flex justify-between items-center mb-4 p-3 bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <div className="text-xl font-bold text-primary">{service.price}</div>
                        <div className="text-xs text-muted-foreground">Precio</div>
                      </div>
                      <div className="w-px h-6 bg-border"></div>
                      <div className="text-center">
                        <div className="text-base font-semibold">{service.duration}</div>
                        <div className="text-xs text-muted-foreground">Duración</div>
                      </div>
                    </div>

                    {/* Características */}
                    <div className="space-y-1">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-xs">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA adicional */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <span>💡</span>
                ¿No encuentras el servicio que buscas?
              </div>
              <p className="mt-3 text-muted-foreground text-sm">
                Contáctanos para una consulta personalizada y te ayudaremos a encontrar la mejor solución.
              </p>
              <Button 
                className="mt-4 bg-primary hover:bg-primary/90 text-white transition-colors duration-200"
                onClick={(e) => handleNavLinkClick(e, "contacto")}
              >
                Solicitar Consulta
              </Button>
            </div>
          </div>
        </section>

        {/* About Us */}
        <section id="nosotros" className="py-20 bg-gradient-to-b from-muted/20 to-background">
          <div className="container">
            {/* Header de la sección */}
            <div className="mx-auto max-w-[800px] text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                🏥 Sobre Nosotros
              </div>
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Nuestra Historia
              </h2>
              <p className="mt-6 text-lg text-muted-foreground max-w-[600px] mx-auto leading-relaxed">
                Con más de 15 años de experiencia, nuestro consultorio dental se ha convertido en un referente en
                atención odontológica de calidad.
              </p>
            </div>

            {/* Timeline de la historia */}
            <div className="mb-20">
              <h3 className="text-2xl font-bold text-center mb-12">Nuestro Camino</h3>
              <div className="relative">
                {/* Línea central */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-primary/30"></div>
                
                {/* Eventos del timeline */}
                <div className="space-y-12">
                  {[
                    {
                      year: "2008",
                      title: "Fundación",
                      description: "Abrimos nuestras puertas con la misión de brindar atención dental de calidad.",
                      icon: "🏥"
                    },
                    {
                      year: "2012",
                      title: "Expansión",
                      description: "Ampliamos nuestras instalaciones e incorporamos tecnología de vanguardia.",
                      icon: "🔬"
                    },
                    {
                      year: "2016",
                      title: "Certificación",
                      description: "Obtuvimos la certificación internacional de calidad en atención dental.",
                      icon: "🏆"
                    },
                    {
                      year: "2020",
                      title: "Innovación",
                      description: "Implementamos técnicas digitales y equipos de última generación.",
                      icon: "💻"
                    },
                    {
                      year: "2024",
                      title: "Liderazgo",
                      description: "Nos consolidamos como líderes en atención odontológica integral.",
                      icon: "⭐"
                    }
                  ].map((event, index) => (
                    <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                      {/* Contenido */}
                      <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                        <div className="bg-white p-6 rounded-2xl shadow-lg hover-lift border border-muted">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">{event.icon}</span>
                            <div>
                              <div className="text-sm font-medium text-primary">{event.year}</div>
                              <h4 className="font-bold text-lg">{event.title}</h4>
                            </div>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed">{event.description}</p>
                        </div>
                      </div>
                      
                      {/* Punto central */}
                      <div className="relative z-10 w-8 h-8 bg-primary rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      
                      {/* Espacio vacío */}
                      <div className="w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>



            {/* Características destacadas */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-center mb-8">¿Por qué elegirnos?</h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { icon: "👨‍⚕️", title: "Especialistas Certificados", description: "Equipo de profesionales altamente calificados" },
                  { icon: "🔬", title: "Tecnología de Vanguardia", description: "Equipos de última generación para diagnósticos precisos" },
                  { icon: "🏥", title: "Instalaciones Modernas", description: "Ambiente confortable y protocolos de bioseguridad" },
                  { icon: "💝", title: "Atención Personalizada", description: "Cada paciente recibe atención individualizada" },
                  { icon: "🛡️", title: "Bioseguridad Estricta", description: "Protocolos rigurosos para tu seguridad" },
                  { icon: "📱", title: "Tecnología Digital", description: "Procesos digitalizados para mayor eficiencia" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials 
        <section id="testimonios" className="py-16">
          <div className="container">
            <div className="mx-auto max-w-[800px] text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Lo Que Dicen Nuestros Pacientes
              </h2>
              <p className="mt-4 text-muted-foreground">
                La satisfacción de nuestros pacientes es nuestro mayor orgullo.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "María González",
                  text: "Excelente atención y profesionalismo. Me sentí muy cómoda durante todo el tratamiento de ortodoncia. ¡Ahora tengo la sonrisa que siempre quise!",
                  avatar: "/placeholder.svg?height=64&width=64",
                },
                {
                  name: "Carlos Rodríguez",
                  text: "Llevé a mis hijos para una revisión y quedé impresionado con la paciencia y amabilidad del personal. El consultorio es moderno y los niños se sintieron a gusto.",
                  avatar: "/placeholder.svg?height=64&width=64",
                },
                {
                  name: "Laura Martínez",
                  text: "Después de años de miedo al dentista, encontré este consultorio y cambió mi perspectiva. El Dr. Sánchez explicó todo el procedimiento y no sentí ningún dolor.",
                  avatar: "/placeholder.svg?height=64&width=64",
                },
              ].map((testimonial, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 h-16 w-16 overflow-hidden rounded-full">
                        <Image
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="mb-4 italic text-muted-foreground">"{testimonial.text}"</p>
                      <h4 className="font-medium">{testimonial.name}</h4>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
*/}
        {/* CTA */}
        <section className="relative py-20 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground overflow-hidden">
          {/* Elementos decorativos de fondo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 text-6xl animate-float">🦷</div>
            <div className="absolute top-20 right-20 text-4xl animate-float animation-delay-1000">⚕️</div>
            <div className="absolute bottom-20 left-20 text-5xl animate-float animation-delay-2000">👨‍⚕️</div>
            <div className="absolute bottom-10 right-10 text-3xl animate-float animation-delay-1500">🏥</div>
          </div>
          
          <div className="container relative z-10 text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-8">
              ✨ ¡Tu sonrisa nos importa!
            </div>
            
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-6">
              ¿Listo para una sonrisa más saludable?
            </h2>
            
            <p className="mx-auto mt-6 max-w-[700px] text-lg md:text-xl text-white/90 leading-relaxed mb-10">
              Agende una cita hoy mismo y dé el primer paso hacia una mejor salud bucal. 
              Nuestro equipo está listo para transformar su sonrisa.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <AppointmentForm 
                className="bg-white text-primary hover:bg-white/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl px-8 py-4 text-lg font-medium" 
                variant="default" 
              />
              <Button
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl px-8 py-4 text-lg font-medium"
                onClick={(e) => handleNavLinkClick(e, "servicios")}
              >
                <span className="mr-2">👨‍⚕️</span>
                Conocer Servicios
              </Button>
            </div>
            
            {/* Estadísticas rápidas */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { number: "5000+", label: "Pacientes Felices" },
                { number: "15+", label: "Años de Experiencia" },
                { number: "98%", label: "Satisfacción" },
                { number: "24/7", label: "Atención" }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-2xl md:text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base text-white/80 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contacto" className="py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="container">
            {/* Header de la sección */}
            <div className="mx-auto max-w-[800px] text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                📞 Contáctenos
              </div>
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Estamos aquí para ti
              </h2>
              <p className="mt-6 text-lg text-muted-foreground max-w-[600px] mx-auto leading-relaxed">
                Estamos aquí para responder a sus preguntas y programar su cita. Nuestro equipo está listo para ayudarle.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Información de contacto */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-primary mb-4">Información de Contacto</h3>
                
                {/* Cards de información */}
                <div className="space-y-4">
                  {[
                    {
                      icon: "📍",
                      title: "Dirección",
                      content: "Av. Principal 123, Ciudad, País",
                      description: "Ubicados en el centro de la ciudad"
                    },
                    {
                      icon: "📞",
                      title: "Teléfono",
                      content: "+123 456 7890",
                      description: "Línea directa para emergencias"
                    },
                    {
                      icon: "✉️",
                      title: "Email",
                      content: "info@dentalcare.com",
                      description: "Respondemos en 24 horas"
                    },
                    {
                      icon: "🕒",
                      title: "Horario de Atención",
                      content: "Lun - Vie: 9:00 - 19:00",
                      subContent: "Sáb: 9:00 - 14:00",
                      description: "Citas disponibles en horario extendido"
                    }
                  ].map((item, index) => (
                    <div key={index} className="group bg-white p-4 rounded-xl shadow-md hover:shadow-lg border border-muted transition-shadow duration-200">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl group-hover:scale-105 transition-transform duration-200">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-primary mb-1 text-sm">{item.title}</h4>
                          <p className="text-base font-medium mb-1">{item.content}</p>
                          {item.subContent && (
                            <p className="text-base font-medium mb-1">{item.subContent}</p>
                          )}
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formulario de contacto */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-muted">
                <h3 className="text-xl font-bold text-primary mb-4">Envíanos un Mensaje</h3>
                <form className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label htmlFor="name" className="text-sm font-medium text-primary">
                        Nombre Completo *
                      </label>
                      <input
                        id="name"
                        required
                        className="w-full rounded-lg border border-muted bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200"
                        placeholder="Su nombre completo"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="email" className="text-sm font-medium text-primary">
                        Email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        className="w-full rounded-lg border border-muted bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200"
                        placeholder="su.email@ejemplo.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="phone" className="text-sm font-medium text-primary">
                      Teléfono
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className="w-full rounded-lg border border-muted bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200"
                      placeholder="+123 456 7890"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="service" className="text-sm font-medium text-primary">
                      Servicio de Interés
                    </label>
                    <select
                      id="service"
                      className="w-full rounded-lg border border-muted bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200"
                    >
                      <option value="">Seleccione un servicio</option>
                      <option value="limpieza">Limpieza Dental</option>
                      <option value="ortodoncia">Ortodoncia</option>
                      <option value="implantes">Implantes Dentales</option>
                      <option value="blanqueamiento">Blanqueamiento</option>
                      <option value="endodoncia">Endodoncia</option>
                      <option value="odontopediatria">Odontopediatría</option>
                      <option value="consulta">Consulta General</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="message" className="text-sm font-medium text-primary">
                      Mensaje *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      className="w-full rounded-lg border border-muted bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200 resize-none"
                      placeholder="Cuéntenos sobre su consulta o inquietud..."
                    ></textarea>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg transition-colors duration-200"
                  >
                    <span className="mr-2">📤</span>
                    Enviar Mensaje
                  </Button>
                </form>
              </div>
            </div>

            {/* Mapa interactivo */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-center text-primary mb-8">Nuestra Ubicación</h3>
              <div className="bg-white p-6 rounded-3xl shadow-xl border border-muted">
                <div className="h-[400px] overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🗺️</div>
                      <h4 className="text-xl font-bold text-primary mb-2">Mapa Interactivo</h4>
                      <p className="text-muted-foreground mb-4">Av. Principal 123, Ciudad, País</p>
                      <Button 
                        className="bg-primary hover:bg-primary/90 text-white"
                        onClick={() => window.open('https://maps.google.com', '_blank')}
                      >
                        <span className="mr-2">📍</span>
                        Ver en Google Maps
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Debug Section - Temporal */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Debug de Autenticación</h2>
              <p className="text-muted-foreground">Información temporal para debugging</p>
            </div>
            <DebugAuth />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gradient-to-b from-muted/20 to-muted/40">
        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Logo y descripción */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 group">
                <Image
                  src="/logo.png?height=40&width=40"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-full group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Dentalis Lux
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Comprometidos con su salud bucal y bienestar. Más de 15 años cuidando sonrisas.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                  <span className="text-lg">📱</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                  <span className="text-lg">📧</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                  <span className="text-lg">📷</span>
                </div>
              </div>
            </div>

            {/* Enlaces rápidos */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-primary">Enlaces Rápidos</h3>
              <ul className="space-y-3">
                {[
                  { href: "#inicio", label: "Inicio", icon: "🏠" },
                  { href: "#servicios", label: "Servicios", icon: "🦷" },
                  { href: "#nosotros", label: "Nosotros", icon: "🏥" },
                  { href: "#contacto", label: "Contacto", icon: "📞" }
                ].map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavLinkClick(e, link.href.replace('#', ''))}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200 group"
                    >
                      <span className="text-sm group-hover:scale-110 transition-transform duration-200">
                        {link.icon}
                      </span>
                      <span className="text-sm font-medium">{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Servicios destacados */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-primary">Servicios</h3>
              <ul className="space-y-3">
                {[
                  { label: "Limpieza Dental", icon: "🦷" },
                  { label: "Ortodoncia", icon: "🦿" },
                  { label: "Implantes", icon: "🦷" },
                  { label: "Blanqueamiento", icon: "✨" }
                ].map((service, index) => (
                  <li key={index}>
                    <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer group">
                      <span className="text-sm group-hover:scale-110 transition-transform duration-200">
                        {service.icon}
                      </span>
                      <span className="text-sm font-medium">{service.label}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Información de contacto */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-primary">Contacto</h3>
              <ul className="space-y-3">
                {[
                  { icon: "📍", label: "Av. Principal 123, Ciudad, País" },
                  { icon: "📞", label: "+123 456 7890" },
                  { icon: "✉️", label: "info@dentalcare.com" },
                  { icon: "🕒", label: "Lun-Vie: 9:00-19:00" }
                ].map((contact, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted-foreground">
                    <span className="text-sm mt-0.5">{contact.icon}</span>
                    <span className="text-sm leading-relaxed">{contact.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Línea divisoria */}
          <div className="mt-12 pt-8 border-t border-muted/50">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Dentalis Lux. Todos los derechos reservados.
              </p>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <span className="hover:text-primary transition-colors cursor-pointer">Política de Privacidad</span>
                <span className="hover:text-primary transition-colors cursor-pointer">Términos de Servicio</span>
                <span className="hover:text-primary transition-colors cursor-pointer">Cookies</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* WhatsApp ChatBot Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg group relative" size="icon">
          <MessageCircle className="h-6 w-6 text-white" />
          <span className="absolute right-16 bg-black/75 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            ChatBot
          </span>
        </Button>
      </div>
    </div>
  )
}

