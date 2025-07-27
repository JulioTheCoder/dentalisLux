-- Políticas RLS para el sistema dental
-- Este archivo contiene todas las políticas de seguridad a nivel de fila
-- VERSIÓN CORREGIDA - Tipos de datos compatibles

-- =============================================
-- 1. POLÍTICAS PARA LA TABLA usuario
-- =============================================

-- Habilitar RLS
ALTER TABLE public.usuario ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver solo su propio perfil
CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.usuario
    FOR SELECT USING (auth.uid() = id);

-- Política: Los usuarios pueden actualizar solo su propio perfil
CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON public.usuario
    FOR UPDATE USING (auth.uid() = id);

-- Política: Los administradores pueden ver todos los usuarios
CREATE POLICY "Administradores pueden ver todos los usuarios" ON public.usuario
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política: Los administradores pueden crear usuarios
CREATE POLICY "Administradores pueden crear usuarios" ON public.usuario
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política: Los administradores pueden actualizar cualquier usuario
CREATE POLICY "Administradores pueden actualizar cualquier usuario" ON public.usuario
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- =============================================
-- 2. POLÍTICAS PARA LA TABLA odontologo
-- =============================================

-- Habilitar RLS
ALTER TABLE public.odontologo ENABLE ROW LEVEL SECURITY;

-- Política: Solo administradores pueden ver todos los odontólogos
CREATE POLICY "Solo administradores pueden ver odontólogos" ON public.odontologo
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política: Solo administradores pueden crear odontólogos
CREATE POLICY "Solo administradores pueden crear odontólogos" ON public.odontologo
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política: Solo administradores pueden actualizar odontólogos
CREATE POLICY "Solo administradores pueden actualizar odontólogos" ON public.odontologo
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política: Solo administradores pueden eliminar odontólogos
CREATE POLICY "Solo administradores pueden eliminar odontólogos" ON public.odontologo
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- =============================================
-- 3. POLÍTICAS PARA LA TABLA servicio
-- =============================================

-- Habilitar RLS
ALTER TABLE public.servicio ENABLE ROW LEVEL SECURITY;

-- Política: Todos los usuarios autenticados pueden ver servicios
CREATE POLICY "Usuarios autenticados pueden ver servicios" ON public.servicio
    FOR SELECT USING (auth.role() = 'authenticated');

-- Política: Solo administradores pueden crear servicios
CREATE POLICY "Solo administradores pueden crear servicios" ON public.servicio
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política: Solo administradores pueden actualizar servicios
CREATE POLICY "Solo administradores pueden actualizar servicios" ON public.servicio
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política: Solo administradores pueden eliminar servicios
CREATE POLICY "Solo administradores pueden eliminar servicios" ON public.servicio
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- =============================================
-- 4. POLÍTICAS PARA LA TABLA cita
-- =============================================

-- Habilitar RLS
ALTER TABLE public.cita ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver sus propias citas
CREATE POLICY "Usuarios pueden ver sus propias citas" ON public.cita
    FOR SELECT USING (
        usuario_id = auth.uid()::text OR
        invitado_id IN (
            SELECT id FROM public.invitados 
            WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- Política: Los odontólogos pueden ver las citas asignadas a ellos
CREATE POLICY "Odontólogos pueden ver sus citas asignadas" ON public.cita
    FOR SELECT USING (
        odontologo_id IN (
            SELECT odontologo_id FROM public.odontologo 
            WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- Política: Los administradores pueden ver todas las citas
CREATE POLICY "Administradores pueden ver todas las citas" ON public.cita
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política: Los usuarios pueden crear sus propias citas
CREATE POLICY "Usuarios pueden crear sus propias citas" ON public.cita
    FOR INSERT WITH CHECK (
        usuario_id = auth.uid()::text OR
        (is_user = false AND invitado_id IS NOT NULL)
    );

-- Política: Los administradores pueden crear cualquier cita
CREATE POLICY "Administradores pueden crear cualquier cita" ON public.cita
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política: Los usuarios pueden actualizar sus propias citas (solo estado)
CREATE POLICY "Usuarios pueden actualizar sus propias citas" ON public.cita
    FOR UPDATE USING (
        usuario_id = auth.uid()::text
    );

-- Política: Los odontólogos pueden actualizar las citas asignadas a ellos
CREATE POLICY "Odontólogos pueden actualizar sus citas asignadas" ON public.cita
    FOR UPDATE USING (
        odontologo_id IN (
            SELECT odontologo_id FROM public.odontologo 
            WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- Política: Los administradores pueden actualizar cualquier cita
CREATE POLICY "Administradores pueden actualizar cualquier cita" ON public.cita
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política: Los usuarios pueden cancelar sus propias citas
CREATE POLICY "Usuarios pueden cancelar sus propias citas" ON public.cita
    FOR UPDATE USING (
        usuario_id = auth.uid()::text
    ) WITH CHECK (
        estado = 'cancelada'
    );

-- Política: Los administradores pueden eliminar cualquier cita
CREATE POLICY "Administradores pueden eliminar cualquier cita" ON public.cita
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- =============================================
-- 5. POLÍTICAS PARA LA TABLA horario
-- =============================================

-- Habilitar RLS
ALTER TABLE public.horario ENABLE ROW LEVEL SECURITY;

-- Política: Los odontólogos pueden ver sus propios horarios
CREATE POLICY "Odontólogos pueden ver sus propios horarios" ON public.horario
    FOR SELECT USING (
        odontologo_id IN (
            SELECT odontologo_id FROM public.odontologo 
            WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- Política: Los administradores pueden ver todos los horarios
CREATE POLICY "Administradores pueden ver todos los horarios" ON public.horario
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política: Los odontólogos pueden crear sus propios horarios
CREATE POLICY "Odontólogos pueden crear sus propios horarios" ON public.horario
    FOR INSERT WITH CHECK (
        odontologo_id IN (
            SELECT odontologo_id FROM public.odontologo 
            WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- Política: Los administradores pueden crear cualquier horario
CREATE POLICY "Administradores pueden crear cualquier horario" ON public.horario
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política: Los odontólogos pueden actualizar sus propios horarios
CREATE POLICY "Odontólogos pueden actualizar sus propios horarios" ON public.horario
    FOR UPDATE USING (
        odontologo_id IN (
            SELECT odontologo_id FROM public.odontologo 
            WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- Política: Los administradores pueden actualizar cualquier horario
CREATE POLICY "Administradores pueden actualizar cualquier horario" ON public.horario
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política: Los odontólogos pueden eliminar sus propios horarios
CREATE POLICY "Odontólogos pueden eliminar sus propios horarios" ON public.horario
    FOR DELETE USING (
        odontologo_id IN (
            SELECT odontologo_id FROM public.odontologo 
            WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- Política: Los administradores pueden eliminar cualquier horario
CREATE POLICY "Administradores pueden eliminar cualquier horario" ON public.horario
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- =============================================
-- 6. POLÍTICAS PARA LA TABLA invitados
-- =============================================

-- Habilitar RLS
ALTER TABLE public.invitados ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver invitados con su mismo email
CREATE POLICY "Usuarios pueden ver invitados con su email" ON public.invitados
    FOR SELECT USING (
        email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

-- Política: Los administradores pueden ver todos los invitados
CREATE POLICY "Administradores pueden ver todos los invitados" ON public.invitados
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política: Cualquier usuario autenticado puede crear invitados
CREATE POLICY "Usuarios autenticados pueden crear invitados" ON public.invitados
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política: Los administradores pueden actualizar cualquier invitado
CREATE POLICY "Administradores pueden actualizar cualquier invitado" ON public.invitados
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política: Los administradores pueden eliminar cualquier invitado
CREATE POLICY "Administradores pueden eliminar cualquier invitado" ON public.invitados
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- =============================================
-- 7. POLÍTICAS PARA LA TABLA pago
-- =============================================

-- Habilitar RLS
ALTER TABLE public.pago ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver pagos de sus citas
CREATE POLICY "Usuarios pueden ver pagos de sus citas" ON public.pago
    FOR SELECT USING (
        cita_id IN (
            SELECT id FROM public.cita 
            WHERE usuario_id = auth.uid()::text
        )
    );

-- Política: Los administradores pueden ver todos los pagos
CREATE POLICY "Administradores pueden ver todos los pagos" ON public.pago
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política: Los administradores pueden crear pagos
CREATE POLICY "Administradores pueden crear pagos" ON public.pago
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política: Los administradores pueden actualizar pagos
CREATE POLICY "Administradores pueden actualizar pagos" ON public.pago
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política: Los administradores pueden eliminar pagos
CREATE POLICY "Administradores pueden eliminar pagos" ON public.pago
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- =============================================
-- 8. POLÍTICAS PARA LA TABLA resultado_cita
-- =============================================

-- Habilitar RLS
ALTER TABLE public.resultado_cita ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver resultados de sus citas
CREATE POLICY "Usuarios pueden ver resultados de sus citas" ON public.resultado_cita
    FOR SELECT USING (
        cita_id IN (
            SELECT id FROM public.cita 
            WHERE usuario_id = auth.uid()::text
        )
    );

-- Política: Los odontólogos pueden ver resultados de sus citas asignadas
CREATE POLICY "Odontólogos pueden ver resultados de sus citas" ON public.resultado_cita
    FOR SELECT USING (
        cita_id IN (
            SELECT c.id FROM public.cita c
            JOIN public.odontologo o ON c.odontologo_id = o.odontologo_id
            WHERE o.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- Política: Los administradores pueden ver todos los resultados
CREATE POLICY "Administradores pueden ver todos los resultados" ON public.resultado_cita
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política: Los odontólogos pueden crear resultados para sus citas
CREATE POLICY "Odontólogos pueden crear resultados" ON public.resultado_cita
    FOR INSERT WITH CHECK (
        cita_id IN (
            SELECT c.id FROM public.cita c
            JOIN public.odontologo o ON c.odontologo_id = o.odontologo_id
            WHERE o.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- Política: Los administradores pueden crear cualquier resultado
CREATE POLICY "Administradores pueden crear cualquier resultado" ON public.resultado_cita
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política: Los odontólogos pueden actualizar resultados de sus citas
CREATE POLICY "Odontólogos pueden actualizar resultados" ON public.resultado_cita
    FOR UPDATE USING (
        cita_id IN (
            SELECT c.id FROM public.cita c
            JOIN public.odontologo o ON c.odontologo_id = o.odontologo_id
            WHERE o.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- Política: Los administradores pueden actualizar cualquier resultado
CREATE POLICY "Administradores pueden actualizar cualquier resultado" ON public.resultado_cita
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política: Los administradores pueden eliminar cualquier resultado
CREATE POLICY "Administradores pueden eliminar cualquier resultado" ON public.resultado_cita
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- =============================================
-- 9. POLÍTICAS PARA LA TABLA metodopago
-- =============================================

-- Habilitar RLS
ALTER TABLE public.metodopago ENABLE ROW LEVEL SECURITY;

-- Política: Todos los usuarios autenticados pueden ver métodos de pago
CREATE POLICY "Usuarios autenticados pueden ver métodos de pago" ON public.metodopago
    FOR SELECT USING (auth.role() = 'authenticated');

-- Política: Solo administradores pueden crear métodos de pago
CREATE POLICY "Solo administradores pueden crear métodos de pago" ON public.metodopago
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política: Solo administradores pueden actualizar métodos de pago
CREATE POLICY "Solo administradores pueden actualizar métodos de pago" ON public.metodopago
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política: Solo administradores pueden eliminar métodos de pago
CREATE POLICY "Solo administradores pueden eliminar métodos de pago" ON public.metodopago
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- =============================================
-- 10. POLÍTICAS PARA LA TABLA appointments (legacy)
-- =============================================

-- Habilitar RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Política: Solo administradores pueden acceder a la tabla legacy
CREATE POLICY "Solo administradores pueden acceder a appointments" ON public.appointments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.usuario 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- =============================================
-- FUNCIONES AUXILIARES PARA VERIFICAR ROLES
-- =============================================

-- Función para verificar si el usuario actual es admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.usuario 
        WHERE id = auth.uid() AND rol = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si el usuario actual es odontólogo
CREATE OR REPLACE FUNCTION is_dentist()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.odontologo 
        WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener el ID del odontólogo del usuario actual
CREATE OR REPLACE FUNCTION get_current_dentist_id()
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT odontologo_id FROM public.odontologo 
        WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- ÍNDICES PARA OPTIMIZAR CONSULTAS
-- =============================================

-- Índices para la tabla cita
CREATE INDEX IF NOT EXISTS idx_cita_usuario_id ON public.cita(usuario_id);
CREATE INDEX IF NOT EXISTS idx_cita_odontologo_id ON public.cita(odontologo_id);
CREATE INDEX IF NOT EXISTS idx_cita_fecha_hora ON public.cita(fecha_hora);
CREATE INDEX IF NOT EXISTS idx_cita_estado ON public.cita(estado);
CREATE INDEX IF NOT EXISTS idx_cita_invitado_id ON public.cita(invitado_id);

-- Índices para la tabla horario
CREATE INDEX IF NOT EXISTS idx_horario_odontologo_id ON public.horario(odontologo_id);
CREATE INDEX IF NOT EXISTS idx_horario_fecha_hora_inicio ON public.horario(fecha_hora_inicio);
CREATE INDEX IF NOT EXISTS idx_horario_disponible ON public.horario(disponible);

-- Índices para la tabla usuario
CREATE INDEX IF NOT EXISTS idx_usuario_rol ON public.usuario(rol);
CREATE INDEX IF NOT EXISTS idx_usuario_email ON public.usuario(id);

-- Índices para la tabla odontologo
CREATE INDEX IF NOT EXISTS idx_odontologo_email ON public.odontologo(email);
CREATE INDEX IF NOT EXISTS idx_odontologo_especialidad ON public.odontologo(especialidad);
CREATE INDEX IF NOT EXISTS idx_odontologo_activo ON public.odontologo(activo);

-- Índices para la tabla pago
CREATE INDEX IF NOT EXISTS idx_pago_cita_id ON public.pago(cita_id);
CREATE INDEX IF NOT EXISTS idx_pago_estado ON public.pago(estado);

-- Índices para la tabla resultado_cita
CREATE INDEX IF NOT EXISTS idx_resultado_cita_cita_id ON public.resultado_cita(cita_id);
CREATE INDEX IF NOT EXISTS idx_resultado_cita_fecha_subida ON public.resultado_cita(fecha_subida);

-- =============================================
-- TRIGGERS PARA MANTENER INTEGRIDAD
-- =============================================

-- Trigger para actualizar updated_at en cita
CREATE OR REPLACE FUNCTION update_cita_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_cita_updated_at
    BEFORE UPDATE ON public.cita
    FOR EACH ROW
    EXECUTE FUNCTION update_cita_updated_at();

-- Trigger para actualizar updated_at en resultado_cita
CREATE OR REPLACE FUNCTION update_resultado_cita_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_resultado_cita_updated_at
    BEFORE UPDATE ON public.resultado_cita
    FOR EACH ROW
    EXECUTE FUNCTION update_resultado_cita_updated_at();

-- Trigger para verificar disponibilidad antes de crear cita
CREATE OR REPLACE FUNCTION check_appointment_availability()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar que el odontólogo esté disponible en esa fecha/hora
    IF NOT EXISTS (
        SELECT 1 FROM public.horario 
        WHERE odontologo_id = NEW.odontologo_id 
        AND fecha_hora_inicio <= NEW.fecha_hora 
        AND fecha_hora_fin > NEW.fecha_hora 
        AND disponible = true
    ) THEN
        RAISE EXCEPTION 'El odontólogo no está disponible en la fecha y hora especificada';
    END IF;
    
    -- Verificar que no haya otra cita en el mismo horario
    IF EXISTS (
        SELECT 1 FROM public.cita 
        WHERE odontologo_id = NEW.odontologo_id 
        AND fecha_hora = NEW.fecha_hora 
        AND estado NOT IN ('cancelada')
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) THEN
        RAISE EXCEPTION 'Ya existe una cita programada para el odontólogo en esa fecha y hora';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_appointment_availability
    BEFORE INSERT OR UPDATE ON public.cita
    FOR EACH ROW
    EXECUTE FUNCTION check_appointment_availability();

-- =============================================
-- COMENTARIOS FINALES
-- =============================================

/*
ESTRUCTURA DE PERMISOS IMPLEMENTADA:

1. ADMINISTRADORES:
   - Acceso completo a todas las tablas
   - Pueden crear, asignar y gestionar odontólogos
   - Pueden ver todas las citas, pagos y resultados
   - Pueden gestionar servicios y métodos de pago

2. ODONTÓLOGOS:
   - Pueden ver y gestionar sus propias citas asignadas
   - Pueden crear y gestionar sus horarios de disponibilidad
   - Pueden crear resultados para sus citas
   - No pueden ver información de otros odontólogos

3. USUARIOS REGULARES:
   - Pueden ver y gestionar sus propias citas
   - Pueden ver servicios disponibles
   - Pueden ver sus propios pagos y resultados
   - Pueden crear citas como invitados

4. SEGURIDAD:
   - Todas las tablas tienen RLS habilitado
   - Las políticas verifican roles y propiedad de datos
   - Triggers mantienen integridad referencial
   - Índices optimizan consultas frecuentes

5. CORRECCIONES APLICADAS:
   - auth.uid() se mantiene como UUID para comparar con campos UUID (usuario.id)
   - auth.uid()::text se usa para comparar con campos TEXT (cita.usuario_id)
   - Se corrigen las referencias a campos de invitados
   - Se asegura compatibilidad de tipos en todas las políticas
*/ 