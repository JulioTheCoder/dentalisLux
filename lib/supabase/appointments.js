import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

// Función para obtener todos los servicios
export const getServices = async () => {
  try {
    const { data, error } = await supabase
      .from('servicio')
      .select('*')
      .order('nombre')
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error obteniendo servicios:', error)
    throw error
  }
}

// Función para obtener todos los odontólogos
export const getDoctors = async () => {
  try {
    const { data, error } = await supabase
      .from('odontologo')
      .select('*')
      .order('nombre')
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error obteniendo doctores:', error)
    throw error
  }
}

// Función para obtener todos los usuarios (para convertir en odontólogos)
export const getUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
    throw error
  }
}

// Función para crear un nuevo odontólogo desde cero
export const createDoctor = async (doctorData) => {
  try {
    const { data, error } = await supabase
      .from('odontologo')
      .insert([doctorData])
      .select()
    
    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error creando odontólogo:', error)
    throw error
  }
}

// Función para convertir un usuario existente en odontólogo
export const convertUserToDoctor = async (userId, doctorData) => {
  try {
    // Primero actualizar el rol del usuario a 'empleado'
    const { error: userError } = await supabase
      .from('usuario')
      .update({ rol: 'empleado' })
      .eq('id', userId)
    
    if (userError) throw userError

    // Luego crear el registro de odontólogo
    const { data, error } = await supabase
      .from('odontologo')
      .insert([doctorData])
      .select()
    
    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error convirtiendo usuario a odontólogo:', error)
    throw error
  }
}

// Función para actualizar un odontólogo
export const updateDoctor = async (odontologoId, doctorData) => {
  try {
    const { data, error } = await supabase
      .from('odontologo')
      .update(doctorData)
      .eq('odontologo_id', odontologoId)
      .select()
    
    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error actualizando odontólogo:', error)
    throw error
  }
}

// Función para eliminar un odontólogo
export const deleteDoctor = async (odontologoId) => {
  try {
    const { error } = await supabase
      .from('odontologo')
      .delete()
      .eq('odontologo_id', odontologoId)
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error eliminando odontólogo:', error)
    throw error
  }
}

// Función para obtener odontólogos con información de usuario
export const getDoctorsWithUserInfo = async () => {
  try {
    const { data, error } = await supabase
      .from('odontologo')
      .select(`
        *,
        usuario:usuario_id(id, name, email, phone, rol)
      `)
      .order('nombre')
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error obteniendo odontólogos con información de usuario:', error)
    throw error
  }
}

// Función para obtener slots disponibles usando la función SQL
export const getAvailableSlots = async (odontologoId, fecha, duracionMinutos = 60) => {
  try {
    const { data, error } = await supabase
      .rpc('get_available_slots', {
        p_odontologo_id: odontologoId,
        p_fecha: fecha,
        p_duracion_minutos: duracionMinutos
      })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error obteniendo slots disponibles:', error)
    throw error
  }
}

// Función para verificar disponibilidad
export const checkAvailability = async (odontologoId, fechaHora, duracionMinutos = 60) => {
  try {
    const { data, error } = await supabase
      .rpc('check_availability', {
        p_odontologo_id: odontologoId,
        p_fecha_hora: fechaHora,
        p_duracion_minutos: duracionMinutos
      })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error verificando disponibilidad:', error)
    throw error
  }
}

// Función para solicitar una nueva cita (sin fecha/hora asignada)
export const createAppointment = async (appointmentData) => {
  try {
    // Si no se especifica odontólogo, el sistema lo asignará automáticamente
    const appointmentToCreate = {
      ...appointmentData,
      // Si no hay fecha_hora, el sistema la asignará más tarde
      fecha_hora: appointmentData.fecha_hora || null,
      // Estado inicial: solicitada
      estado: 'solicitada'
    }

    const { data, error } = await supabase
      .from('cita')
      .insert([appointmentToCreate])
      .select()
    
    if (error) throw error
    
    // Si la cita se creó exitosamente, intentar asignar fecha/hora automáticamente
    if (data[0]) {
      await assignAppointmentAutomatically(data[0].id, appointmentData.servicio_id, appointmentData.odontologo_id)
    }
    
    return data[0]
  } catch (error) {
    console.error('Error creando cita:', error)
    throw error
  }
}

// Función para asignar automáticamente fecha y hora a una cita solicitada
export const assignAppointmentAutomatically = async (citaId, servicioId, odontologoId = null) => {
  try {
    // Obtener información del servicio para conocer la duración
    const { data: servicio } = await supabase
      .from('servicio')
      .select('duracion')
      .eq('servicio_id', servicioId)
      .single()
    
    const duracionMinutos = servicio?.duracion || 60

    // Si no se especificó odontólogo, buscar el más disponible
    let odontologoAsignado = odontologoId
    if (!odontologoAsignado) {
      const { data: odontologos } = await supabase
        .from('odontologo')
        .select('odontologo_id')
        .eq('activo', true)
      
      if (odontologos && odontologos.length > 0) {
        // Por ahora asignamos el primero, pero aquí se podría implementar
        // una lógica más sofisticada para elegir el más disponible
        odontologoAsignado = odontologos[0].odontologo_id
      }
    }

    if (!odontologoAsignado) {
      throw new Error('No hay odontólogos disponibles')
    }

    // Buscar el próximo slot disponible
    const fechaActual = new Date()
    const fechaInicio = new Date(fechaActual.getTime() + 24 * 60 * 60 * 1000) // Mañana
    
    // Buscar en los próximos 7 días
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(fechaInicio.getTime() + i * 24 * 60 * 60 * 1000)
      const fechaString = fecha.toISOString().split('T')[0]
      
      try {
        const slots = await getAvailableSlots(odontologoAsignado, fechaString, duracionMinutos)
        
        if (slots && slots.length > 0) {
          // Tomar el primer slot disponible
          const slotDisponible = slots[0]
          const fechaHoraCompleta = new Date(`${fechaString}T${slotDisponible.hora_disponible}:00`)
          
          // Actualizar la cita con la fecha/hora asignada
          const { error: updateError } = await supabase
            .from('cita')
            .update({
              odontologo_id: odontologoAsignado,
              fecha_hora: fechaHoraCompleta.toISOString(),
              estado: 'confirmada'
            })
            .eq('id', citaId)
          
          if (updateError) throw updateError
          
          console.log(`Cita ${citaId} asignada automáticamente para ${fechaHoraCompleta}`)
          return true
        }
      } catch (error) {
        console.error(`Error buscando slots para ${fechaString}:`, error)
        continue
      }
    }
    
    // Si no se encontró slot disponible, mantener como solicitada
    console.log(`No se encontró slot disponible para la cita ${citaId}`)
    return false
    
  } catch (error) {
    console.error('Error asignando cita automáticamente:', error)
    throw error
  }
}

// Función para obtener las citas de un usuario
export const getUserAppointments = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('cita')
      .select(`
        *,
        odontologo:odontologo_id(nombre, especialidad, email),
        servicio:servicio_id(nombre, descripcion, costo)
      `)
      .eq('usuario_id', userId)
      .order('fecha_hora', { ascending: false })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error obteniendo citas del usuario:', error)
    throw error
  }
}

// Función para obtener citas por invitado (para usuarios no registrados)
export const getGuestAppointments = async (invitadoId) => {
  try {
    const { data, error } = await supabase
      .from('cita')
      .select(`
        *,
        odontologo:odontologo_id(nombre, especialidad, email),
        servicio:servicio_id(nombre, descripcion, costo)
      `)
      .eq('invitadoId', invitadoId)
      .order('fecha_hora', { ascending: false })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error obteniendo citas del invitado:', error)
    throw error
  }
}

// Función para cancelar una cita
export const cancelAppointment = async (appointmentId) => {
  try {
    const { data, error } = await supabase
      .from('cita')
      .update({ estado: 'cancelada' })
      .eq('id', appointmentId)
      .select()
    
    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error cancelando cita:', error)
    throw error
  }
}

// Función para obtener horarios de un odontólogo
export const getDoctorSchedule = async (odontologoId) => {
  try {
    const { data, error } = await supabase
      .from('horario')
      .select('*')
      .eq('odontologo_id', odontologoId)
      .eq('disponible', true)
      .order('fecha_hora_inicio')
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error obteniendo horario del doctor:', error)
    throw error
  }
}

// Función para obtener servicios por odontólogo
export const getDoctorServices = async () => {
  try {
    const { data, error } = await supabase
      .rpc('get_odontologo_services')
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error obteniendo servicios por doctor:', error)
    throw error
  }
}

// Función para obtener citas solicitadas (para administradores)
export const getRequestedAppointments = async () => {
  try {
    const { data, error } = await supabase
      .from('cita')
      .select(`
        *,
        odontologo:odontologo_id(nombre, especialidad, email),
        servicio:servicio_id(nombre, descripcion, costo)
      `)
      .eq('estado', 'solicitada')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error obteniendo citas solicitadas:', error)
    throw error
  }
}

// Función para confirmar manualmente una cita (para administradores)
export const confirmAppointment = async (citaId, fechaHora, odontologoId) => {
  try {
    const { data, error } = await supabase
      .from('cita')
      .update({
        fecha_hora: fechaHora,
        odontologo_id: odontologoId,
        estado: 'confirmada'
      })
      .eq('id', citaId)
      .select()
    
    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error confirmando cita:', error)
    throw error
  }
} 