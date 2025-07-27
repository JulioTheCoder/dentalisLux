# Guía de Políticas RLS para el Sistema Dental

## Resumen Ejecutivo

Este documento describe las políticas de Row Level Security (RLS) implementadas en el sistema dental para garantizar que cada usuario solo pueda acceder a los datos que le corresponden según su rol.

## Estructura de Roles

### 1. Administrador
- **Acceso completo** a todas las tablas
- **Único responsable** de crear y asignar odontólogos
- Puede gestionar servicios, métodos de pago y configuraciones del sistema
- Puede ver todas las citas, pagos y resultados de todos los usuarios

### 2. Odontólogo
- Puede ver y gestionar **sus propias citas asignadas**
- Puede crear y gestionar **sus horarios de disponibilidad**
- Puede crear **resultados para sus citas**
- **No puede** ver información de otros odontólogos

### 3. Usuario Regular
- Puede ver y gestionar **sus propias citas**
- Puede ver **servicios disponibles**
- Puede ver **sus propios pagos y resultados**
- Puede crear citas como **invitado** (sin registro)

## Políticas por Tabla

### 📋 Tabla `usuario`

| Acción | Usuario Regular | Odontólogo | Administrador |
|--------|----------------|------------|---------------|
| Ver perfil propio | ✅ | ✅ | ✅ |
| Actualizar perfil propio | ✅ | ✅ | ✅ |
| Ver todos los usuarios | ❌ | ❌ | ✅ |
| Crear usuarios | ❌ | ❌ | ✅ |
| Actualizar cualquier usuario | ❌ | ❌ | ✅ |

**Políticas clave:**
- Los usuarios solo ven su propio perfil
- Los administradores tienen acceso completo a todos los usuarios

### 🦷 Tabla `odontologo`

| Acción | Usuario Regular | Odontólogo | Administrador |
|--------|----------------|------------|---------------|
| Ver odontólogos | ❌ | ❌ | ✅ |
| Crear odontólogos | ❌ | ❌ | ✅ |
| Actualizar odontólogos | ❌ | ❌ | ✅ |
| Eliminar odontólogos | ❌ | ❌ | ✅ |

**Políticas clave:**
- **Solo administradores** pueden gestionar odontólogos
- Los odontólogos no pueden ver información de otros odontólogos

### 🏥 Tabla `cita`

| Acción | Usuario Regular | Odontólogo | Administrador |
|--------|----------------|------------|---------------|
| Ver propias citas | ✅ | ❌ | ✅ |
| Ver citas asignadas | ❌ | ✅ | ✅ |
| Ver todas las citas | ❌ | ❌ | ✅ |
| Crear propias citas | ✅ | ❌ | ✅ |
| Crear cualquier cita | ❌ | ❌ | ✅ |
| Actualizar propias citas | ✅ | ❌ | ✅ |
| Actualizar citas asignadas | ❌ | ✅ | ✅ |
| Actualizar cualquier cita | ❌ | ❌ | ✅ |
| Cancelar propias citas | ✅ | ❌ | ✅ |
| Eliminar citas | ❌ | ❌ | ✅ |

**Políticas clave:**
- Los usuarios ven solo sus propias citas
- Los odontólogos ven solo las citas asignadas a ellos
- Los administradores ven todas las citas
- Los usuarios pueden cancelar sus propias citas

### ⏰ Tabla `horario`

| Acción | Usuario Regular | Odontólogo | Administrador |
|--------|----------------|------------|---------------|
| Ver propios horarios | ❌ | ✅ | ✅ |
| Ver todos los horarios | ❌ | ❌ | ✅ |
| Crear propios horarios | ❌ | ✅ | ✅ |
| Crear cualquier horario | ❌ | ❌ | ✅ |
| Actualizar propios horarios | ❌ | ✅ | ✅ |
| Actualizar cualquier horario | ❌ | ❌ | ✅ |
| Eliminar propios horarios | ❌ | ✅ | ✅ |
| Eliminar cualquier horario | ❌ | ❌ | ✅ |

**Políticas clave:**
- Los odontólogos gestionan solo sus propios horarios
- Los administradores pueden gestionar todos los horarios

### 🏥 Tabla `servicio`

| Acción | Usuario Regular | Odontólogo | Administrador |
|--------|----------------|------------|---------------|
| Ver servicios | ✅ | ✅ | ✅ |
| Crear servicios | ❌ | ❌ | ✅ |
| Actualizar servicios | ❌ | ❌ | ✅ |
| Eliminar servicios | ❌ | ❌ | ✅ |

**Políticas clave:**
- Todos los usuarios autenticados pueden ver servicios
- Solo administradores pueden gestionar servicios

### 💰 Tabla `pago`

| Acción | Usuario Regular | Odontólogo | Administrador |
|--------|----------------|------------|---------------|
| Ver pagos de sus citas | ✅ | ❌ | ✅ |
| Ver todos los pagos | ❌ | ❌ | ✅ |
| Crear pagos | ❌ | ❌ | ✅ |
| Actualizar pagos | ❌ | ❌ | ✅ |
| Eliminar pagos | ❌ | ❌ | ✅ |

**Políticas clave:**
- Los usuarios ven solo los pagos de sus propias citas
- Solo administradores pueden gestionar pagos

### 📄 Tabla `resultado_cita`

| Acción | Usuario Regular | Odontólogo | Administrador |
|--------|----------------|------------|---------------|
| Ver resultados de sus citas | ✅ | ❌ | ✅ |
| Ver resultados de sus citas asignadas | ❌ | ✅ | ✅ |
| Ver todos los resultados | ❌ | ❌ | ✅ |
| Crear resultados para sus citas | ❌ | ✅ | ✅ |
| Crear cualquier resultado | ❌ | ❌ | ✅ |
| Actualizar resultados de sus citas | ❌ | ✅ | ✅ |
| Actualizar cualquier resultado | ❌ | ❌ | ✅ |
| Eliminar resultados | ❌ | ❌ | ✅ |

**Políticas clave:**
- Los usuarios ven solo los resultados de sus propias citas
- Los odontólogos ven y crean resultados para sus citas asignadas
- Los administradores tienen acceso completo

### 👥 Tabla `invitados`

| Acción | Usuario Regular | Odontólogo | Administrador |
|--------|----------------|------------|---------------|
| Ver invitados con su email | ✅ | ✅ | ✅ |
| Ver todos los invitados | ❌ | ❌ | ✅ |
| Crear invitados | ✅ | ✅ | ✅ |
| Actualizar invitados | ❌ | ❌ | ✅ |
| Eliminar invitados | ❌ | ❌ | ✅ |

**Políticas clave:**
- Los usuarios pueden ver invitados con su mismo email
- Cualquier usuario autenticado puede crear invitados
- Solo administradores pueden gestionar invitados

## Funciones Auxiliares

### `is_admin()`
```sql
-- Retorna TRUE si el usuario actual es administrador
SELECT is_admin();
```

### `is_dentist()`
```sql
-- Retorna TRUE si el usuario actual es odontólogo
SELECT is_dentist();
```

### `get_current_dentist_id()`
```sql
-- Retorna el ID del odontólogo del usuario actual
SELECT get_current_dentist_id();
```

## Triggers Implementados

### 1. `update_cita_updated_at`
- Actualiza automáticamente el campo `updated_at` en la tabla `cita`
- Se ejecuta antes de cada actualización

### 2. `update_resultado_cita_updated_at`
- Actualiza automáticamente el campo `updated_at` en la tabla `resultado_cita`
- Se ejecuta antes de cada actualización

### 3. `check_appointment_availability`
- Verifica que el odontólogo esté disponible antes de crear/actualizar una cita
- Verifica que no haya conflictos de horarios
- Se ejecuta antes de insertar o actualizar citas

## Índices Optimizados

Se han creado índices para optimizar las consultas más frecuentes:

- `idx_cita_usuario_id` - Búsqueda de citas por usuario
- `idx_cita_odontologo_id` - Búsqueda de citas por odontólogo
- `idx_cita_fecha_hora` - Búsqueda de citas por fecha/hora
- `idx_cita_estado` - Filtrado por estado de cita
- `idx_horario_odontologo_id` - Búsqueda de horarios por odontólogo
- `idx_usuario_rol` - Filtrado de usuarios por rol
- `idx_odontologo_email` - Búsqueda de odontólogos por email

## Casos de Uso Comunes

### 1. Usuario crea una cita
```sql
-- El usuario solo puede crear citas para sí mismo
INSERT INTO cita (usuario_id, odontologo_id, servicio_id, fecha_hora)
VALUES (auth.uid()::text, 1, 1, '2024-01-15 10:00:00+00');
```

### 2. Odontólogo ve sus citas
```sql
-- El odontólogo solo ve las citas asignadas a él
SELECT * FROM cita WHERE odontologo_id = get_current_dentist_id();
```

### 3. Administrador gestiona odontólogos
```sql
-- Solo administradores pueden crear odontólogos
INSERT INTO odontologo (nombre, email, especialidad)
VALUES ('Dr. García', 'dr.garcia@clinic.com', 'Ortodoncia');
```

### 4. Verificar disponibilidad
```sql
-- El trigger verifica automáticamente la disponibilidad
-- No es necesario hacer verificaciones manuales
```

## Consideraciones de Seguridad

### 1. Principio de Mínimo Privilegio
- Cada usuario tiene acceso solo a los datos que necesita
- Los permisos están restringidos al máximo posible

### 2. Verificación de Roles
- Todas las políticas verifican el rol del usuario
- No hay bypass de seguridad por defecto

### 3. Integridad de Datos
- Los triggers mantienen la integridad referencial
- Se evitan conflictos de horarios automáticamente

### 4. Auditoría
- Los campos `created_at` y `updated_at` se mantienen automáticamente
- Se puede rastrear cuándo se modificaron los datos

## Implementación

Para implementar estas políticas:

1. **Ejecutar el script SQL:**
   ```bash
   psql -h your-supabase-host -U postgres -d postgres -f supabase_rls_policies.sql
   ```

2. **Verificar las políticas:**
   ```sql
   -- Ver todas las políticas activas
   SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
   FROM pg_policies
   WHERE schemaname = 'public';
   ```

3. **Probar los permisos:**
   ```sql
   -- Probar como administrador
   SELECT is_admin();
   
   -- Probar como odontólogo
   SELECT is_dentist();
   ```

## Mantenimiento

### Agregar Nuevas Políticas
1. Identificar la tabla y operación
2. Definir qué roles deben tener acceso
3. Crear la política usando el patrón establecido
4. Probar con diferentes roles

### Modificar Políticas Existentes
1. Hacer backup de las políticas actuales
2. Modificar la política específica
3. Probar que no se rompan otras funcionalidades
4. Documentar los cambios

### Monitoreo
- Revisar logs de acceso denegado
- Monitorear performance de consultas
- Verificar que las políticas funcionen correctamente

## Troubleshooting

### Error: "new row violates row-level security policy"
- Verificar que el usuario tenga los permisos necesarios
- Revisar la política específica de la tabla
- Confirmar que el rol del usuario sea correcto

### Error: "function does not exist"
- Verificar que las funciones auxiliares estén creadas
- Ejecutar el script completo de políticas

### Performance lenta
- Verificar que los índices estén creados
- Revisar las consultas que usan las políticas
- Considerar optimizar las políticas complejas

## Conclusión

Las políticas RLS implementadas garantizan que:

1. **Los administradores** tienen control total del sistema
2. **Los odontólogos** solo acceden a sus datos relevantes
3. **Los usuarios** mantienen privacidad de sus datos
4. **La integridad** de los datos se mantiene automáticamente
5. **El rendimiento** está optimizado con índices apropiados

Este sistema de seguridad proporciona una base sólida para el manejo de datos sensibles en el sistema dental, cumpliendo con los principios de seguridad y privacidad necesarios. 