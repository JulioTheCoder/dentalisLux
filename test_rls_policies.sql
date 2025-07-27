-- Script de prueba para verificar las políticas RLS
-- Este script debe ejecutarse después de implementar las políticas

-- =============================================
-- CONFIGURACIÓN INICIAL
-- =============================================

-- Crear usuarios de prueba (esto debe hacerse desde la aplicación)
-- Nota: Estos INSERTs son solo para referencia, no se ejecutarán aquí

/*
-- Usuario administrador de prueba
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'admin@clinic.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now()
);

INSERT INTO public.usuario (id, name, phone, rol, numero_identificacion)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Administrador Principal',
    '3001234567',
    'administrador',
    '1234567890'
);

-- Usuario odontólogo de prueba
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    'dr.garcia@clinic.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now()
);

INSERT INTO public.usuario (id, name, phone, rol, numero_identificacion)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    'Dr. Carlos García',
    '3001234568',
    'usuario',
    '1234567891'
);

INSERT INTO public.odontologo (nombre, email, especialidad, activo)
VALUES (
    'Dr. Carlos García',
    'dr.garcia@clinic.com',
    'Ortodoncia',
    true
);

-- Usuario regular de prueba
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    '33333333-3333-3333-3333-333333333333',
    'paciente@email.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now()
);

INSERT INTO public.usuario (id, name, phone, rol, numero_identificacion)
VALUES (
    '33333333-3333-3333-3333-333333333333',
    'Juan Pérez',
    '3001234569',
    'usuario',
    '1234567892'
);
*/

-- =============================================
-- FUNCIONES DE PRUEBA
-- =============================================

-- Función para simular un usuario específico
CREATE OR REPLACE FUNCTION test_as_user(user_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Esta función simula cambiar el contexto de usuario
    -- En un entorno real, esto se maneja a través de auth.uid()
    RAISE NOTICE 'Simulando usuario: %', user_id;
END;
$$ LANGUAGE plpgsql;

-- Función para probar políticas de usuario
CREATE OR REPLACE FUNCTION test_user_policies()
RETURNS TABLE(test_name TEXT, result TEXT) AS $$
BEGIN
    -- Probar función is_admin()
    RETURN QUERY SELECT 
        'is_admin() para admin'::TEXT,
        CASE 
            WHEN is_admin() THEN 'PASS' 
            ELSE 'FAIL' 
        END::TEXT;
    
    -- Probar función is_dentist()
    RETURN QUERY SELECT 
        'is_dentist() para admin'::TEXT,
        CASE 
            WHEN is_dentist() THEN 'PASS' 
            ELSE 'FAIL' 
        END::TEXT;
    
    -- Probar acceso a tabla usuario
    RETURN QUERY SELECT 
        'SELECT usuario como admin'::TEXT,
        CASE 
            WHEN EXISTS(SELECT 1 FROM public.usuario LIMIT 1) THEN 'PASS' 
            ELSE 'FAIL' 
        END::TEXT;
    
    -- Probar acceso a tabla odontologo
    RETURN QUERY SELECT 
        'SELECT odontologo como admin'::TEXT,
        CASE 
            WHEN EXISTS(SELECT 1 FROM public.odontologo LIMIT 1) THEN 'PASS' 
            ELSE 'FAIL' 
        END::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- CONSULTAS DE VERIFICACIÓN
-- =============================================

-- 1. Verificar que RLS esté habilitado en todas las tablas
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'usuario', 'odontologo', 'servicio', 'cita', 
    'horario', 'invitados', 'pago', 'resultado_cita', 
    'metodopago', 'appointments'
)
ORDER BY tablename;

-- 2. Verificar que las políticas estén creadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 3. Verificar que las funciones auxiliares existan
SELECT 
    proname as function_name,
    prosrc as function_source
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND proname IN ('is_admin', 'is_dentist', 'get_current_dentist_id')
ORDER BY proname;

-- 4. Verificar que los triggers estén creados
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 5. Verificar que los índices estén creados
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- =============================================
-- PRUEBAS ESPECÍFICAS POR ROL
-- =============================================

-- Nota: Estas pruebas requieren que el usuario esté autenticado
-- En un entorno real, estas se ejecutarían con diferentes contextos de usuario

/*
-- PRUEBA COMO ADMINISTRADOR
-- Simular contexto de administrador
SET LOCAL ROLE authenticated;
-- Aquí se establecería auth.uid() al ID del administrador

-- Probar acceso completo a odontólogos
SELECT 'Admin puede ver odontólogos' as test,
       COUNT(*) as result
FROM public.odontologo;

-- Probar acceso completo a citas
SELECT 'Admin puede ver todas las citas' as test,
       COUNT(*) as result
FROM public.cita;

-- Probar acceso completo a usuarios
SELECT 'Admin puede ver todos los usuarios' as test,
       COUNT(*) as result
FROM public.usuario;

-- PRUEBA COMO ODONTÓLOGO
-- Simular contexto de odontólogo
-- SET LOCAL auth.uid() = '22222222-2222-2222-2222-222222222222';

-- Probar acceso limitado a citas
SELECT 'Odontólogo ve solo sus citas' as test,
       COUNT(*) as result
FROM public.cita;

-- Probar acceso a sus horarios
SELECT 'Odontólogo ve sus horarios' as test,
       COUNT(*) as result
FROM public.horario;

-- PRUEBA COMO USUARIO REGULAR
-- Simular contexto de usuario regular
-- SET LOCAL auth.uid() = '33333333-3333-3333-3333-333333333333';

-- Probar acceso limitado a citas
SELECT 'Usuario ve solo sus citas' as test,
       COUNT(*) as result
FROM public.cita;

-- Probar acceso a servicios
SELECT 'Usuario puede ver servicios' as test,
       COUNT(*) as result
FROM public.servicio;
*/

-- =============================================
-- PRUEBAS DE INTEGRIDAD
-- =============================================

-- 1. Verificar que no hay citas sin odontólogo válido
SELECT 'Citas sin odontólogo válido' as check_name,
       COUNT(*) as count
FROM public.cita c
LEFT JOIN public.odontologo o ON c.odontologo_id = o.odontologo_id
WHERE o.odontologo_id IS NULL AND c.odontologo_id IS NOT NULL;

-- 2. Verificar que no hay citas sin servicio válido
SELECT 'Citas sin servicio válido' as check_name,
       COUNT(*) as count
FROM public.cita c
LEFT JOIN public.servicio s ON c.servicio_id = s.servicio_id
WHERE s.servicio_id IS NULL AND c.servicio_id IS NOT NULL;

-- 3. Verificar que no hay horarios sin odontólogo válido
SELECT 'Horarios sin odontólogo válido' as check_name,
       COUNT(*) as count
FROM public.horario h
LEFT JOIN public.odontologo o ON h.odontologo_id = o.odontologo_id
WHERE o.odontologo_id IS NULL;

-- 4. Verificar que no hay pagos sin cita válida
SELECT 'Pagos sin cita válida' as check_name,
       COUNT(*) as count
FROM public.pago p
LEFT JOIN public.cita c ON p.cita_id = c.id
WHERE c.id IS NULL AND p.cita_id IS NOT NULL;

-- 5. Verificar que no hay resultados sin cita válida
SELECT 'Resultados sin cita válida' as check_name,
       COUNT(*) as count
FROM public.resultado_cita rc
LEFT JOIN public.cita c ON rc.cita_id = c.id
WHERE c.id IS NULL;

-- =============================================
-- PRUEBAS DE PERFORMANCE
-- =============================================

-- 1. Verificar que los índices están siendo utilizados
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM public.cita 
WHERE usuario_id = 'test-user-id';

EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM public.cita 
WHERE odontologo_id = 1;

EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM public.horario 
WHERE odontologo_id = 1 AND disponible = true;

-- 2. Verificar performance de consultas con RLS
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM public.usuario 
WHERE rol = 'administrador';

-- =============================================
-- PRUEBAS DE SEGURIDAD
-- =============================================

-- 1. Verificar que las políticas están activas
SELECT 
    'Políticas RLS activas' as check_name,
    COUNT(*) as count
FROM pg_policies 
WHERE schemaname = 'public';

-- 2. Verificar que no hay tablas sin RLS
SELECT 
    'Tablas sin RLS' as check_name,
    COUNT(*) as count
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename NOT IN ('schema_migrations', 'ar_internal_metadata')
AND rowsecurity = false;

-- 3. Verificar que las funciones de seguridad existen
SELECT 
    'Funciones de seguridad' as check_name,
    COUNT(*) as count
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND proname IN ('is_admin', 'is_dentist', 'get_current_dentist_id');

-- =============================================
-- REPORTE FINAL
-- =============================================

-- Generar reporte de estado
SELECT 
    'ESTADO DE LAS POLÍTICAS RLS' as reporte,
    now() as fecha_verificacion;

SELECT 
    'Tablas con RLS habilitado' as metric,
    COUNT(*) as value
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;

SELECT 
    'Políticas RLS creadas' as metric,
    COUNT(*) as value
FROM pg_policies 
WHERE schemaname = 'public';

SELECT 
    'Índices de optimización' as metric,
    COUNT(*) as value
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname LIKE 'idx_%';

SELECT 
    'Triggers de integridad' as metric,
    COUNT(*) as value
FROM information_schema.triggers
WHERE trigger_schema = 'public';

-- =============================================
-- INSTRUCCIONES PARA EJECUTAR PRUEBAS MANUALES
-- =============================================

/*
INSTRUCCIONES PARA PRUEBAS MANUALES:

1. Ejecutar este script en Supabase SQL Editor
2. Revisar los resultados de cada sección
3. Verificar que no hay errores en las consultas
4. Confirmar que todas las políticas están activas
5. Probar las funcionalidades desde la aplicación

PRUEBAS ADICIONALES DESDE LA APLICACIÓN:

1. Iniciar sesión como administrador:
   - Verificar que puede ver todos los odontólogos
   - Verificar que puede crear nuevos odontólogos
   - Verificar que puede ver todas las citas

2. Iniciar sesión como odontólogo:
   - Verificar que solo ve sus citas asignadas
   - Verificar que puede gestionar sus horarios
   - Verificar que no puede ver otros odontólogos

3. Iniciar sesión como usuario regular:
   - Verificar que solo ve sus propias citas
   - Verificar que puede crear citas
   - Verificar que no puede ver información de otros usuarios

4. Probar casos edge:
   - Intentar acceder a datos sin autenticación
   - Intentar modificar datos de otros usuarios
   - Verificar que los triggers funcionan correctamente
*/ 