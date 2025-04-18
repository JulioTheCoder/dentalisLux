document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear()

  // Mobile Menu Toggle - CORREGIDO
  const menuToggle = document.getElementById("menu-toggle")
  const mobileMenu = document.getElementById("mobile-menu")

  if (menuToggle && mobileMenu) {
    console.log("Menú hamburguesa inicializado")

    menuToggle.addEventListener("click", (e) => {
      e.preventDefault() // Prevenir comportamiento predeterminado
      console.log("Clic en menú hamburguesa")
      mobileMenu.classList.toggle("active")

      // Cambiar el ícono según el estado del menú
      const icon = menuToggle.querySelector("i")
      if (icon) {
        if (mobileMenu.classList.contains("active")) {
          icon.classList.remove("fa-bars")
          icon.classList.add("fa-times")
        } else {
          icon.classList.remove("fa-times")
          icon.classList.add("fa-bars")
        }
      }
    })
  } else {
    console.error("No se encontró el menú hamburguesa o el menú móvil")
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", (event) => {
    if (
      mobileMenu &&
      mobileMenu.classList.contains("active") &&
      !event.target.closest("#mobile-menu") &&
      !event.target.closest("#menu-toggle")
    ) {
      mobileMenu.classList.remove("active")

      // Restaurar ícono de hamburguesa
      const icon = menuToggle.querySelector("i")
      if (icon) {
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
      }
    }
  })

  // Auth Modal
  const authBtn = document.getElementById("auth-btn")
  const authModal = document.getElementById("auth-modal")
  const closeAuthModal = document.getElementById("close-auth-modal")

  if (authBtn && authModal && closeAuthModal) {
    authBtn.addEventListener("click", () => {
      authModal.classList.add("active")
      document.body.style.overflow = "hidden"
    })

    closeAuthModal.addEventListener("click", () => {
      authModal.classList.remove("active")
      document.body.style.overflow = ""
    })
  }

  // Auth Tabs
  const tabItems = document.querySelectorAll(".tab-item")
  const tabPanes = document.querySelectorAll(".tab-pane")
  const switchTabLinks = document.querySelectorAll(".switch-tab")

  tabItems.forEach((item) => {
    item.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")

      // Remove active class from all tabs and panes
      tabItems.forEach((tab) => tab.classList.remove("active"))
      tabPanes.forEach((pane) => pane.classList.remove("active"))

      // Add active class to current tab and pane
      this.classList.add("active")
      document.getElementById(tabId).classList.add("active")
    })
  })

  switchTabLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const tabId = this.getAttribute("data-tab")

      // Find and click the corresponding tab
      document.querySelector(`.tab-item[data-tab="${tabId}"]`).click()
    })
  })

  // Auth Forms Submission
  const loginForm = document.getElementById("login-form")
  const registerForm = document.getElementById("register-form")

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      // Simulate login - in a real app, this would make an API call
      console.log("Login submitted")
      authModal.classList.remove("active")
      document.body.style.overflow = ""
      // Redirect to dashboard in a real app
      // window.location.href = 'dashboard.html';
    })
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault()
      // Simulate registration - in a real app, this would make an API call
      console.log("Registration submitted")
      authModal.classList.remove("active")
      document.body.style.overflow = ""
      // Redirect to dashboard in a real app
      // window.location.href = 'dashboard.html';
    })
  }

  // Appointment Modal
  const appointmentBtns = document.querySelectorAll(
    "#appointment-btn, #hero-appointment-btn, #cta-appointment-btn, .mobile-btn",
  )
  const appointmentModal = document.getElementById("appointment-modal")
  const closeAppointmentModal = document.getElementById("close-appointment-modal")
  const appointmentForm = document.getElementById("appointment-form")
  const appointmentDate = document.getElementById("appointment-date")
  const appointmentTime = document.getElementById("appointment-time")
  const appointmentFormContainer = document.getElementById("appointment-form-container")
  const appointmentSuccess = document.getElementById("appointment-success")

  appointmentBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      appointmentModal.classList.add("active")
      document.body.style.overflow = "hidden"
    })
  })

  if (closeAppointmentModal) {
    closeAppointmentModal.addEventListener("click", () => {
      appointmentModal.classList.remove("active")
      document.body.style.overflow = ""
      // Reset form state
      setTimeout(() => {
        appointmentFormContainer.style.display = "block"
        appointmentSuccess.classList.add("hidden")
        appointmentForm.reset()
        appointmentTime.disabled = true
      }, 300)
    })
  }

  // Enable time selection only after date is selected
  if (appointmentDate && appointmentTime) {
    appointmentDate.addEventListener("change", function () {
      if (this.value) {
        appointmentTime.disabled = false
      } else {
        appointmentTime.disabled = true
        appointmentTime.value = ""
      }
    })

    // Set min date to today
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, "0")
    const dd = String(today.getDate()).padStart(2, "0")
    appointmentDate.min = `${yyyy}-${mm}-${dd}`
  }

  // Variable para controlar envíos múltiples
  let isSubmitting = false

  // Appointment form submission
  if (appointmentForm) {
    appointmentForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Evitar envíos múltiples
      if (isSubmitting) {
        console.log("Ya se está procesando un envío")
        return
      }

      isSubmitting = true

      // Disable submit button and show loading state
      const submitBtn = document.getElementById("submit-appointment")
      submitBtn.disabled = true
      submitBtn.textContent = "Enviando..."

      // Simulate form submission - in a real app, this would make an API call
      setTimeout(() => {
        // Show success message
        appointmentFormContainer.style.display = "none"
        appointmentSuccess.classList.remove("hidden")

        // Reset form
        appointmentForm.reset()
        appointmentTime.disabled = true

        // Close modal after delay
        setTimeout(() => {
          appointmentModal.classList.remove("active")
          document.body.style.overflow = ""

          // Reset view for next time
          setTimeout(() => {
            appointmentFormContainer.style.display = "block"
            appointmentSuccess.classList.add("hidden")
            isSubmitting = false
            submitBtn.disabled = false
            submitBtn.textContent = "Solicitar Cita"
          }, 300)
        }, 3000)
      }, 1500)
    })
  }

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === authModal) {
      authModal.classList.remove("active")
      document.body.style.overflow = ""
    }
    if (e.target === appointmentModal) {
      appointmentModal.classList.remove("active")
      document.body.style.overflow = ""
      // Reset form state
      setTimeout(() => {
        appointmentFormContainer.style.display = "block"
        appointmentSuccess.classList.add("hidden")
        appointmentForm.reset()
        appointmentTime.disabled = true
      }, 300)
    }
  })

  // Contact form submission
  const contactForm = document.getElementById("contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()
      // Simulate form submission - in a real app, this would make an API call
      alert("Mensaje enviado correctamente. Nos pondremos en contacto con usted pronto.")
      contactForm.reset()
    })
  }

  // Configuración del botón de WhatsApp ChatBot
  const chatbotButton = document.querySelector(".btn-chatbot")
  if (chatbotButton) {
    chatbotButton.addEventListener("click", (e) => {
      e.preventDefault()

      // Número de teléfono de la clínica dental (reemplaza con el número real)
      const phoneNumber = "1234567890"

      // Mensaje predeterminado (opcional)
      const message = "Hola, me gustaría obtener más información sobre sus servicios dentales."

      // Crear la URL de WhatsApp según el dispositivo
      let whatsappUrl
      if (isMobileDevice()) {
        // URL para dispositivos móviles
        whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
      } else {
        // URL para navegadores de escritorio
        whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
      }

      // Abrir WhatsApp
      window.open(whatsappUrl, "_blank")
    })
  }

  // Función para detectar dispositivos móviles
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }
})

