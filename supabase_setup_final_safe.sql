-- =====================================================
-- CONFIGURACIÓN FINAL SEGURA PARA SISTEMA DE AGENDAMIENTO INTELIGENTE
-- ADAPTADO A LA ESTRUCTURA REAL DE LA BASE DE DATOS CON ENUM CORRECTO
-- MANEJA DATOS EXISTENTES DE FORMA SEGURA
-- =====================================================

-- 1. DIAGNÓSTICO INICIAL
-- =====================================================

-- Mostrar estructura actual de las tablas principales
SELECT 'ESTRUCTURA ACTUAL DE TABLA CITA:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'cita'
ORDER BY ordinal_position;

-- Mostrar valores del ENUM de especialidad
SELECT 'VALORES DEL ENUM ESPECIALIDAD:' as info;
SELECT unnest(enum_range(NULL::"especialidadType")) as especialidad_valor;

-- Mostrar odontólogos existentes
SELECT 'ODONTÓLOGOS EXISTENTES:' as info;
SELECT odontologo_id, nombre, especialidad::text, email FROM odontologo ORDER BY odontologo_id;

-- 2. ACTUALIZAR TABLA CITA
-- =====================================================

-- Agregar columnas faltantes a la tabla cita
ALTER TABLE cita ADD COLUMN IF NOT EXISTS motivo TEXT;
ALTER TABLE cita ADD COLUMN IF NOT EXISTS notas TEXT;
ALTER TABLE cita ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE cita ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Modificar el campo estado para incluir 'solicitada'
DO $$
BEGIN
    -- Intentar eliminar la restricción si existe
    BEGIN
        ALTER TABLE cita DROP CONSTRAINT cita_estado_check;
    EXCEPTION
        WHEN undefined_object THEN
            -- La restricción no existe, continuar
            NULL;
    END;
    
    -- Agregar la nueva restricción
    ALTER TABLE cita ADD CONSTRAINT cita_estado_check 
        CHECK (estado IN ('solicitada', 'confirmada', 'pendiente', 'pagada', 'completada', 'cancelada'));
    
    -- Establecer estado por defecto como 'solicitada'
    ALTER TABLE cita ALTER COLUMN estado SET DEFAULT 'solicitada';
    
    -- Permitir que fecha_hora sea NULL
    ALTER TABLE cita ALTER COLUMN fecha_hora DROP NOT NULL;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error actualizando tabla cita: %', SQLERRM;
END $$;

-- 3. ACTUALIZAR TABLA ODONTOLOGO
-- =====================================================

-- Agregar campo activo si no existe
ALTER TABLE odontologo ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

-- Actualizar odontólogos existentes para que tengan activo = true
UPDATE odontologo SET activo = true WHERE activo IS NULL;

-- 4. ACTUALIZAR TABLA SERVICIO
-- =====================================================

-- Agregar campo duracion si no existe
ALTER TABLE servicio ADD COLUMN IF NOT EXISTS duracion INTEGER DEFAULT 60;

-- Actualizar duraciones basadas en los servicios existentes
UPDATE servicio SET duracion = 45 WHERE nombre = 'Limpieza Dental';
UPDATE servicio SET duracion = 60 WHERE nombre = 'Blanqueamiento Dental';
UPDATE servicio SET duracion = 90 WHERE nombre = 'Ortodoncia';
UPDATE servicio SET duracion = 60 WHERE nombre = 'Extracción de caries';
UPDATE servicio SET duracion = 90 WHERE nombre = 'Endodoncia';

-- 5. CREAR ÍNDICES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_cita_usuario ON cita(usuario_id);
CREATE INDEX IF NOT EXISTS idx_cita_odontologo ON cita(odontologo_id);
CREATE INDEX IF NOT EXISTS idx_cita_fecha_hora ON cita(fecha_hora);
CREATE INDEX IF NOT EXISTS idx_cita_estado ON cita(estado);
CREATE INDEX IF NOT EXISTS idx_cita_created_at ON cita(created_at);
CREATE INDEX IF NOT EXISTS idx_odontologo_activo ON odontologo(activo);
CREATE INDEX IF NOT EXISTS idx_servicio_duracion ON servicio(duracion);

-- 6. ELIMINAR FUNCIONES EXISTENTES DE FORMA SEGURA
-- =====================================================

DO $$
BEGIN
    -- Eliminar funciones si existen
    DROP FUNCTION IF EXISTS get_available_slots(INTEGER, DATE, INTEGER);
    DROP FUNCTION IF EXISTS check_availability(INTEGER, TIMESTAMP WITH TIME ZONE, INTEGER);
    DROP FUNCTION IF EXISTS get_odontologo_services();
    DROP FUNCTION IF EXISTS update_updated_at_column();
    
    RAISE NOTICE 'Funciones existentes eliminadas correctamente';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error eliminando funciones: %', SQLERRM;
END $$;

-- 7. CREAR FUNCIONES SQL ADAPTADAS
-- =====================================================

-- Función para obtener slots disponibles
CREATE OR REPLACE FUNCTION get_available_slots(
    p_odontologo_id INTEGER,
    p_fecha DATE,
    p_duracion_minutos INTEGER DEFAULT 60
)
RETURNS TABLE (
    hora_disponible TIME,
    slot_disponible BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    WITH horario_base AS (
        SELECT 
            generate_series(
                '09:00'::time,
                '17:00'::time,
                '30 minutes'::interval
            )::time AS hora
    ),
    citas_existentes AS (
        SELECT 
            fecha_hora::time AS hora_inicio,
            (fecha_hora + (duracion || ' minutes')::interval)::time AS hora_fin
        FROM cita c
        JOIN servicio s ON c.servicio_id = s.servicio_id
        WHERE c.odontologo_id = p_odontologo_id
        AND DATE(c.fecha_hora) = p_fecha
        AND c.estado NOT IN ('cancelada')
        AND c.fecha_hora IS NOT NULL
    ),
    slots_disponibles AS (
        SELECT 
            h.hora,
            NOT EXISTS (
                SELECT 1 
                FROM citas_existentes ce
                WHERE h.hora >= ce.hora_inicio 
                AND h.hora < ce.hora_fin
            ) AS disponible
        FROM horario_base h
    )
    SELECT 
        s.hora,
        s.disponible
    FROM slots_disponibles s
    WHERE s.disponible = true
    AND (s.hora + (p_duracion_minutos || ' minutes')::interval)::time <= '17:00'::time
    ORDER BY s.hora;
END;
$$ LANGUAGE plpgsql;

-- Función para verificar disponibilidad
CREATE OR REPLACE FUNCTION check_availability(
    p_odontologo_id INTEGER,
    p_fecha_hora TIMESTAMP WITH TIME ZONE,
    p_duracion_minutos INTEGER DEFAULT 60
)
RETURNS BOOLEAN AS $$
DECLARE
    conflict_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM cita c
        JOIN servicio s ON c.servicio_id = s.servicio_id
        WHERE c.odontologo_id = p_odontologo_id
        AND c.estado NOT IN ('cancelada')
        AND c.fecha_hora IS NOT NULL
        AND (
            (p_fecha_hora >= c.fecha_hora AND p_fecha_hora < (c.fecha_hora + (s.duracion || ' minutes')::interval))
            OR
            ((p_fecha_hora + (p_duracion_minutos || ' minutes')::interval) > c.fecha_hora AND (p_fecha_hora + (p_duracion_minutos || ' minutes')::interval) <= (c.fecha_hora + (s.duracion || ' minutes')::interval))
            OR
            (p_fecha_hora <= c.fecha_hora AND (p_fecha_hora + (p_duracion_minutos || ' minutes')::interval) >= (c.fecha_hora + (s.duracion || ' minutes')::interval))
        )
    ) INTO conflict_exists;
    
    RETURN NOT conflict_exists;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener servicios por odontólogo (con ENUM correcto)
CREATE OR REPLACE FUNCTION get_odontologo_services()
RETURNS TABLE (
    odontologo_id INTEGER,
    odontologo_nombre VARCHAR(100),
    servicio_id INTEGER,
    servicio_nombre VARCHAR(100),
    especialidad VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.odontologo_id,
        o.nombre AS odontologo_nombre,
        s.servicio_id,
        s.nombre AS servicio_nombre,
        o.especialidad::text AS especialidad
    FROM odontologo o
    CROSS JOIN servicio s
    WHERE o.activo = true OR o.activo IS NULL
    ORDER BY o.nombre, s.nombre;
END;
$$ LANGUAGE plpgsql;

-- 8. CREAR TRIGGERS
-- =====================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en cita
DROP TRIGGER IF EXISTS update_cita_updated_at ON cita;
CREATE TRIGGER update_cita_updated_at
    BEFORE UPDATE ON cita
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 9. INSERTAR DATOS DE EJEMPLO DE FORMA SEGURA
-- =====================================================

-- Insertar odontólogos de ejemplo solo si no existen
DO $$
DECLARE
    odontologo_count INTEGER;
BEGIN
    -- Contar odontólogos existentes
    SELECT COUNT(*) INTO odontologo_count FROM odontologo;
    
    -- Solo insertar si no hay odontólogos
    IF odontologo_count = 0 THEN
        INSERT INTO odontologo (nombre, especialidad, email, activo) VALUES
        ('Dr. Carlos Sánchez', 'Ortodoncista'::"especialidadType", 'carlos@dentalcare.com', true),
        ('Dra. Laura Martínez', 'General'::"especialidadType", 'laura@dentalcare.com', true),
        ('Dra. Ana López', 'Ortopediatra'::"especialidadType", 'ana@dentalcare.com', true),
        ('Dr. Juan Pérez', 'Endodoncista'::"especialidadType", 'juan@dentalcare.com', true),
        ('Dr. Miguel Torres', 'Prostodoncista'::"especialidadType", 'miguel@dentalcare.com', true);
        
        RAISE NOTICE 'Odontólogos de ejemplo insertados';
    ELSE
        RAISE NOTICE 'Ya existen % odontólogos, no se insertaron datos de ejemplo', odontologo_count;
    END IF;
END $$;

-- 10. VERIFICACIÓN FINAL
-- =====================================================

-- Mostrar estructura final de la tabla cita
SELECT 'ESTRUCTURA FINAL DE TABLA CITA:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'cita'
ORDER BY ordinal_position;

-- Verificar que las funciones se crearon correctamente
SELECT 'VERIFICACIÓN DE FUNCIONES:' as info;
SELECT 
    'get_available_slots' as function_name,
    CASE WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_available_slots') 
         THEN 'CREATED' ELSE 'FAILED' END as status
UNION ALL
SELECT 
    'check_availability' as function_name,
    CASE WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'check_availability') 
         THEN 'CREATED' ELSE 'FAILED' END as status
UNION ALL
SELECT 
    'get_odontologo_services' as function_name,
    CASE WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_odontologo_services') 
         THEN 'CREATED' ELSE 'FAILED' END as status;

-- Verificar que los índices se crearon
SELECT 'VERIFICACIÓN DE ÍNDICES:' as info;
SELECT 
    indexname,
    tablename
FROM pg_indexes 
WHERE tablename IN ('cita', 'odontologo', 'servicio')
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- Mostrar datos de ejemplo
SELECT 'DATOS DE EJEMPLO:' as info;
SELECT 'SERVICIOS:' as tipo, COUNT(*) as total FROM servicio
UNION ALL
SELECT 'ODONTÓLOGOS:' as tipo, COUNT(*) as total FROM odontologo
UNION ALL
SELECT 'CITAS:' as tipo, COUNT(*) as total FROM cita;

-- Mostrar odontólogos finales
SELECT 'ODONTÓLOGOS FINALES:' as info;
SELECT odontologo_id, nombre, especialidad::text, email, activo FROM odontologo ORDER BY odontologo_id;

-- Mostrar servicios con duración
SELECT 'SERVICIOS CON DURACIÓN:' as info;
SELECT servicio_id, nombre, duracion, costo FROM servicio ORDER BY servicio_id;

-- Mostrar mensaje de éxito
SELECT 'CONFIGURACIÓN COMPLETADA EXITOSAMENTE' as mensaje; 