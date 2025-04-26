"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Phone, Mail, CheckCircle, MessageCircle } from "lucide-react"
import { AuthButtons } from "./components/auth-buttons"
import { AppointmentForm } from "./components/appointment-form"
import { useState } from "react"

// Modificar la función Home para incluir la funcionalidad de desplazamiento suave
export default function Home() {
  // Agregar un estado para controlar la visibilidad del menú móvil
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className=" flex h-16 items-center justify-between w-auto py-4 px-0 mx-4">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png?height=48&width=48"
              alt="Logo"
              width={48}
              height={48}
              className="rounded-full"
            />
            <span className="text-xl font-bold">Dentalis Lux</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#inicio" onClick={(e) => handleNavLinkClick(e, "inicio")} className="text-sm font-medium">
              Inicio
            </a>
            <a href="#servicios" onClick={(e) => handleNavLinkClick(e, "servicios")} className="text-sm font-medium">
              Servicios
            </a>
            <a href="#nosotros" onClick={(e) => handleNavLinkClick(e, "nosotros")} className="text-sm font-medium">
              Nosotros
            </a>
           {/* <a
              href="#testimonios"
              onClick={(e) => handleNavLinkClick(e, "testimonios")}
              className="text-sm font-medium"
            >
              Testimonios
            </a>*/}
            <a href="#contacto" onClick={(e) => handleNavLinkClick(e, "contacto")} className="text-sm font-medium">
              Contacto
            </a>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <AuthButtons />
            <AppointmentForm />
          </div>
          {/* Botón de menú hamburguesa */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
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
              className="h-6 w-6"
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
        <div className="md:hidden bg-background border-b">
          <div className="container py-4 flex flex-col space-y-4">
            <a href="#inicio" onClick={(e) => handleNavLinkClick(e, "inicio")} className="text-sm font-medium py-2">
              Inicio
            </a>
            <a
              href="#servicios"
              onClick={(e) => handleNavLinkClick(e, "servicios")}
              className="text-sm font-medium py-2"
            >
              Servicios
            </a>
            <a href="#nosotros" onClick={(e) => handleNavLinkClick(e, "nosotros")} className="text-sm font-medium py-2">
              Nosotros
            </a>
            <a
              href="#testimonios"
              onClick={(e) => handleNavLinkClick(e, "testimonios")}
              className="text-sm font-medium py-2"
            >
              Testimonios
            </a>
            <a href="#contacto" onClick={(e) => handleNavLinkClick(e, "contacto")} className="text-sm font-medium py-2">
              Contacto
            </a>
            <div className="flex flex-col space-y-2 pt-2 border-t">
              <AuthButtons />
              <AppointmentForm />
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <section id="inicio" className="relative h-full">
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero.svg?height=800&width=1600"
              alt="Consultorio dental"
              fill
              className="object-cover brightness-[0.9] contrast-50"
              priority
            />
          </div>
          <div className="container relative z-10 flex flex-col items-center justify-center py-24 text-center text-white">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Sonrisas saludables para toda la familia
            </h1>
            <p className="mt-4 max-w-[700px] text-lg text-white/90">
              Ofrecemos atención dental de calidad con tecnología avanzada y un equipo profesional comprometido con su
              bienestar.
            </p>
            {/* Modificar el botón "Nuestros Servicios" en la sección Hero para que también use la función handleNavLinkClick */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <AppointmentForm className="bg-white text-primary hover:bg-white/90" variant="default" />
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
                onClick={(e) => handleNavLinkClick(e, "servicios")}
              >
                Nuestros Servicios
              </Button>
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
        <section id="servicios" className="py-16">
          <div className="container">
            <div className="mx-auto max-w-[800px] text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Nuestros Servicios</h2>
              <p className="mt-4 text-muted-foreground">
                Ofrecemos una amplia gama de servicios dentales para satisfacer todas sus necesidades.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Limpieza Dental",
                  description: "Eliminación de placa y sarro para prevenir caries y enfermedades de las encías.",
                  icon: "/limpieza-dental.svg?height=48&width=48",
                },
                {
                  title: "Ortodoncia",
                  description:
                    "Corrección de la posición de los dientes y mejora de la mordida con brackets o alineadores.",
                  icon: "/ortodoncia-en-dientes.svg?height=48&width=48",
                },
                {
                  title: "Implantes Dentales",
                  description: "Reemplazo permanente de dientes perdidos con implantes de titanio y coronas.",
                  icon: "/implante-dental.svg?height=48&width=48",
                },
                {
                  title: "Blanqueamiento",
                  description: "Procedimientos para aclarar el color de los dientes y mejorar su sonrisa.",
                  icon: "/blanqueamiento-dental.svg?height=48&width=48",
                },
                {
                  title: "Endodoncia",
                  description: "Tratamiento de conducto para salvar dientes con infección o daño en el nervio.",
                  icon: "/endodoncia-dental.svg?height=48&width=48",
                },
                {
                  title: "Odontopediatría",
                  description: "Atención especializada para niños en un ambiente amigable y seguro.",
                  icon: "/odontopediatria-dental.svg?height=48&width=48",
                },
              ].map((service, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 h-16 w-16 overflow-hidden rounded-full bg-primary/10">
                        <Image
                          src={service.icon || "/placeholder.svg"}
                          alt={service.title}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h3 className="mb-2 text-xl font-medium">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* About Us */}
        <section id="nosotros" className="bg-muted/30 py-16">
          <div className="container">
            <div className="grid gap-12 md:grid-cols-2">
              <div className="relative h-[400px] overflow-hidden rounded-lg">
                <Image src="/nosotros.png?height=400&width=600" alt="Equipo médico" fill className="object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Sobre Nosotros</h2>
                <p className="mt-4 text-muted-foreground">
                  Con más de 15 años de experiencia, nuestro consultorio dental se ha convertido en un referente en
                  atención odontológica de calidad. Contamos con un equipo de profesionales altamente calificados y
                  comprometidos con la salud bucal de nuestros pacientes.
                </p>
                <ul className="mt-6 space-y-2">
                  {[
                    "Equipo de especialistas certificados",
                    "Tecnología de vanguardia",
                    "Instalaciones modernas y confortables",
                    "Atención personalizada",
                    "Protocolos de bioseguridad estrictos",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 w-fit">Conoce a Nuestro Equipo</Button>
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
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              ¿Listo para una sonrisa más saludable?
            </h2>
            <p className="mx-auto mt-4 max-w-[700px]">
              Agende una cita hoy mismo y dé el primer paso hacia una mejor salud bucal.
            </p>
            <AppointmentForm className="mt-8 bg-white text-primary hover:bg-white/90" variant="default" />
          </div>
        </section>

        {/* Contact */}
        <section id="contacto" className="py-16">
          <div className="container">
            <div className="mx-auto max-w-[800px] text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Contáctenos</h2>
              <p className="mt-4 text-muted-foreground">
                Estamos aquí para responder a sus preguntas y programar su cita.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Dirección</h3>
                    <p className="text-sm text-muted-foreground">Av. Principal 123, Ciudad, País</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Teléfono</h3>
                    <p className="text-sm text-muted-foreground">+123 456 7890</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground">info@dentalcare.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Horario</h3>
                    <p className="text-sm text-muted-foreground">Lun - Vie: 9:00 - 19:00</p>
                    <p className="text-sm text-muted-foreground">Sáb: 9:00 - 14:00</p>
                  </div>
                </div>
                <div className="h-[300px] overflow-hidden rounded-lg bg-muted">
                  {/* Aquí iría un mapa */}
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">Mapa de ubicación</p>
                  </div>
                </div>
              </div>
              <div>
                <form className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Nombre
                      </label>
                      <input
                        id="name"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Su nombre"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Su email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Teléfono
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Su teléfono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="service" className="text-sm font-medium">
                      Servicio de Interés
                    </label>
                    <select
                      id="service"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Su teléfono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Mensaje
                    </label>
                    <textarea
                      id="message"
                      className="h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Su mensaje"
                    ></textarea>
                  </div>
                  <Button type="submit" className="w-full">
                    Enviar Mensaje
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container py-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png?height=32&width=32"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-xl font-bold">Dentalis Lux</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Comprometidos con su salud bucal y bienestar.
              </p>
            </div>
            {/* Modificar los enlaces del footer para que también usen la función handleNavLinkClick */}
            <div>
              <h3 className="mb-4 text-lg font-medium">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#inicio"
                    onClick={(e) => handleNavLinkClick(e, "inicio")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Inicio
                  </a>
                </li>
                <li>
                  <a
                    href="#servicios"
                    onClick={(e) => handleNavLinkClick(e, "servicios")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Servicios
                  </a>
                </li>
                <li>
                  <a
                    href="#nosotros"
                    onClick={(e) => handleNavLinkClick(e, "nosotros")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Nosotros
                  </a>
                </li>
                {/* <li>
                  <a
                    href="#testimonios"
                    onClick={(e) => handleNavLinkClick(e, "testimonios")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Testimonios
                  </a>
                </li> */}
                <li>
                  <a
                    href="#contacto"
                    onClick={(e) => handleNavLinkClick(e, "contacto")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
            {/* <div>
              <h3 className="mb-4 text-lg font-medium">Servicios</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Limpieza Dental
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Ortodoncia
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Implantes Dentales
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Blanqueamiento
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Endodoncia
                  </Link>
                </li>
              </ul>
            </div> */}
            <div>
              <h3 className="mb-4 text-lg font-medium">Contacto</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Av. Principal 123, Ciudad, País</span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>+123 456 7890</span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>info@dentalcare.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Dental Lux. Todos los derechos reservados.</p>
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

