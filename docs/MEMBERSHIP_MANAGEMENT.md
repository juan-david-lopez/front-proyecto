# Sistema de Gestión de Membresías - FitZone

## 📋 Descripción General

El sistema de gestión de membresías permite a los usuarios administrar completamente su suscripción a FitZone, incluyendo renovación, suspensión temporal, reactivación y cancelación definitiva.

## 🎯 Funcionalidades Implementadas

### 1. **Página Principal de Membresías** (`/dashboard/membresia`)

#### Características:
- **Vista sin membresía**: 
  - Detecta si el usuario necesita asignar ubicación principal
  - Muestra llamado a acción para comprar membresía
  - Información de beneficios y preguntas frecuentes
  
- **Vista con membresía**:
  - Tarjeta visual con información del plan (Básico, Premium, Elite)
  - Estado actual (Activa, Suspendida, Expirada, Cancelada, Inactiva)
  - Fechas de inicio y vencimiento
  - Contador de días restantes
  - Alertas especiales para suspensión y expiración
  
- **Acciones disponibles**:
  - ✅ **Renovar**: Extender membresía por 30 días más
  - ⏸️ **Suspender**: Pausar temporalmente (15-90 días)
  - ▶️ **Reactivar**: Volver a activar membresía suspendida
  - ❌ **Cancelar**: Terminar suscripción definitivamente

#### Lógica de permisos:
```typescript
// Puede renovar si está activa, suspendida o expirada (no cancelada/inactiva)
const canRenew = [ACTIVE, SUSPENDED, EXPIRED].includes(status)

// Puede suspender solo si está activa
const canSuspend = status === ACTIVE

// Puede reactivar solo si está suspendida
const canReactivate = status === SUSPENDED

// Puede cancelar si está activa o suspendida
const canCancel = [ACTIVE, SUSPENDED].includes(status)
```

### 2. **Página de Renovación** (`/dashboard/membresia/renovar`)

#### Proceso:
1. **Validación inicial**:
   - Verifica que el usuario tenga membresía
   - Comprueba que no esté cancelada
   
2. **Información mostrada**:
   - Plan actual con icono y color personalizado
   - Fecha de vencimiento actual
   - Nueva fecha de vencimiento calculada (+30 días)
   - Precio de renovación (mismo que el plan actual)
   - Beneficios que se mantienen
   
3. **Cálculo de nueva fecha**:
   ```typescript
   // Si ya expiró: suma desde hoy
   // Si aún está activa: suma desde fecha de vencimiento
   const startFrom = endDate > today ? endDate : today
   newDate = startFrom + 30 días
   ```
   
4. **Confirmación**:
   - Botón verde "Confirmar Renovación"
   - Opción de cancelar y volver
   - Feedback con loading state
   
5. **Integración con servicio**:
   ```typescript
   await membershipManagementService.renewMembership({
     userId,
     membershipId,
     newEndDate
   })
   ```

### 3. **Página de Suspensión** (`/dashboard/membresia/suspender`)

#### Proceso:
1. **Validaciones**:
   - Membresía debe estar ACTIVA
   - Usuario no debe haber agotado las 2 suspensiones anuales
   - Servicio verifica elegibilidad con `canSuspendMembership()`
   
2. **Configuración de suspensión**:
   - **Selector de duración**: Slider de 15-90 días
   - **Fecha de reactivación**: Calculada automáticamente
   - **Nueva fecha de vencimiento**: Original + días de suspensión
   - **Motivo**: Campo de texto obligatorio (500 caracteres max)
   
3. **Información importante**:
   - Máximo 2 suspensiones por año
   - Los días de suspensión extienden la membresía
   - Sin acceso durante la suspensión
   - Reactivación automática al finalizar
   
4. **Validaciones de formulario**:
   ```typescript
   // Días entre 15 y 90
   if (suspensionDays < 15 || suspensionDays > 90) return error
   
   // Motivo obligatorio
   if (!reason.trim()) return error
   ```
   
5. **Integración con servicio**:
   ```typescript
   await membershipManagementService.suspendMembership({
     userId,
     membershipId,
     suspensionDays,
     reason
   })
   ```

#### Contadores:
- Muestra suspensiones usadas: "X / 2"
- Indica suspensiones restantes

### 4. **Reactivación de Membresía**

#### Características:
- **Ubicación**: Botón en página principal (no página dedicada)
- **Disponibilidad**: Solo visible si `status === SUSPENDED`
- **Proceso**: Un clic → confirmación → reactivación
- **Feedback**: Toast de éxito/error

#### Flujo:
```typescript
const handleReactivate = async () => {
  await membershipManagementService.reactivateMembership(userId, membershipId)
  toast({ title: '¡Reactivada!', description: 'Tu membresía está activa nuevamente' })
  loadMembershipData() // Refrescar
}
```

### 5. **Página de Cancelación** (`/dashboard/membresia/cancelar`)

#### Proceso (más riguroso por ser destructivo):

1. **Validaciones**:
   - Membresía no debe estar ya cancelada
   - Usuario debe estar autenticado
   
2. **Advertencias destacadas**:
   - ⚠️ Acción permanente e irreversible
   - Lista de consecuencias:
     - Pérdida inmediata de acceso
     - No puede reservar clases
     - Datos conservados 90 días
     - Necesitará nueva membresía para volver
   
3. **Alternativas sugeridas**:
   - 💤 Suspender temporalmente
   - 📉 Cambiar a plan más económico
   - 🎯 Contactar soporte para soluciones
   
4. **Formulario de confirmación**:
   - **Motivo de cancelación**: Textarea obligatorio (500 caracteres)
   - **Checkbox 1**: "Entiendo que perderé acceso inmediato..."
   - **Checkbox 2**: "Confirmo que deseo cancelar definitivamente..."
   
5. **Validaciones estrictas**:
   ```typescript
   // Todos estos deben ser true
   const canCancel = 
     reason.trim() !== '' && 
     understood === true && 
     confirmed === true
   ```
   
6. **Botones de acción**:
   - Botón rojo: "Confirmar Cancelación" (deshabilitado hasta confirmar todo)
   - Botón verde: "No, Mantener Mi Membresía" (regresa a membresías)
   
7. **Resumen visual**:
   - Plan actual y beneficios
   - Lista de lo que se perderá (con ✗ roja)
   - Información de contacto para dudas

## 🎨 Diseño Visual

### Colores por Plan:
- **Básico**: `from-blue-600 to-blue-700` + icono Zap ⚡
- **Premium**: `from-purple-600 to-purple-700` + icono Crown 👑
- **Elite**: `from-amber-600 to-amber-700` + icono Sparkles ✨

### Estados de Membresía:
- **ACTIVE**: Badge verde "Activa"
- **SUSPENDED**: Badge amarillo "Suspendida"
- **EXPIRED**: Badge rojo "Expirada"
- **CANCELLED**: Badge gris "Cancelada"
- **INACTIVE**: Badge gris oscuro "Inactiva"

### Paleta de colores por acción:
- **Renovar**: Verde (`from-green-600 to-green-700`)
- **Suspender**: Amarillo (`from-yellow-600 to-yellow-700`)
- **Reactivar**: Azul (`from-blue-600 to-blue-700`)
- **Cancelar**: Rojo (`from-red-600 to-red-700`)

## 🔧 Servicio Backend

### Clase: `membershipManagementService`

#### Métodos disponibles:

```typescript
// 1. Obtener detalles de membresía
getMembershipDetails(userId: number): Promise<MembershipDetailsResponse>
// Retorna: { hasMembership: boolean, membership?: MembershipInfo, ... }

// 2. Renovar membresía
renewMembership(request: RenewMembershipRequest): Promise<MembershipOperationResponse>
// Request: { userId, membershipId, newEndDate }

// 3. Suspender membresía
suspendMembership(request: SuspendMembershipRequest): Promise<MembershipOperationResponse>
// Request: { userId, membershipId, suspensionDays, reason }
// Validación: 15-90 días

// 4. Reactivar membresía
reactivateMembership(userId: number, membershipId: number): Promise<MembershipOperationResponse>

// 5. Cancelar membresía
cancelMembership(request: CancelMembershipRequest): Promise<MembershipOperationResponse>
// Request: { userId, membershipId, reason }

// 6. Verificar elegibilidad de suspensión
canSuspendMembership(userId: number): Promise<{canSuspend: boolean, message: string}>
// Verifica límite de 2 suspensiones por año
```

#### Endpoints API:
```
Base URL: 
- Development: http://localhost:8080
- Production: https://desplieguefitzone.onrender.com

GET  /memberships/details/{userId}
POST /memberships/renew
POST /memberships/suspend
POST /memberships/reactivate
POST /memberships/cancel
GET  /memberships/can-suspend/{userId}
```

#### Headers:
```typescript
{
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${accessToken}`
}
```

## 📊 Tipos TypeScript

```typescript
// Enums
enum MembershipStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  INACTIVE = 'INACTIVE'
}

enum MembershipTypeName {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ELITE = 'ELITE'
}

// Interfaces
interface MembershipInfo {
  id: number
  userId: number
  startDate: string
  endDate: string
  status: MembershipStatus
  suspensionReason?: string
  suspensionEndDate?: string
  suspensionsUsed?: number
  daysRemaining?: number
  type: {
    id: number
    name: MembershipTypeName
    description: string
    price: number
    accessToAllLocation: boolean
    groupClassesSessionsIncluded: number // -1 = ilimitado
    personalTrainingIncluded: number
    specializedClassesIncluded: boolean
  }
}

interface MembershipDetailsResponse {
  hasMembership: boolean
  membership?: MembershipInfo
  message?: string
  needsLocation?: boolean
}

interface MembershipOperationResponse {
  success: boolean
  message: string
  membership?: MembershipInfo
}
```

## 🔐 Seguridad y Validaciones

### Frontend:
1. **AuthGuard**: Todas las páginas requieren autenticación
2. **Validación de estado**: Verifica estado de membresía antes de mostrar opciones
3. **Validación de permisos**: Deshabilita acciones no permitidas
4. **Confirmaciones**: Checkboxes obligatorios para acciones destructivas
5. **Loading states**: Previene múltiples envíos

### Backend (esperado):
1. **JWT Authorization**: Token Bearer requerido
2. **Validación de usuario**: Verifica que el userId coincida con el token
3. **Validación de estado**: Backend verifica que la operación sea válida
4. **Límites de suspensión**: Máximo 2 por año
5. **Rango de días**: 15-90 días para suspensión

## 🚀 Flujos de Usuario

### Flujo 1: Renovar Membresía
```
Dashboard → Membresías → Renovar → 
  Ver detalles → 
  Confirmar → 
  ✅ Éxito → Volver a membresías
```

### Flujo 2: Suspender Membresía
```
Dashboard → Membresías → Suspender → 
  Seleccionar días (slider 15-90) → 
  Escribir motivo → 
  Confirmar → 
  ✅ Éxito → Volver a membresías (ahora con estado SUSPENDED)
```

### Flujo 3: Reactivar Membresía
```
Dashboard → Membresías → 
  (Ver botón "Reactivar" si está suspendida) → 
  Click → 
  ✅ Éxito inmediato → Refrescar (estado ACTIVE)
```

### Flujo 4: Cancelar Membresía
```
Dashboard → Membresías → Cancelar → 
  Leer advertencias → 
  Considerar alternativas → 
  Escribir motivo → 
  ✓ Entiendo consecuencias → 
  ✓ Confirmo cancelación → 
  Confirmar (botón rojo) → 
  ✅ Éxito → Volver a membresías (estado CANCELLED)
```

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**:
  - `sm`: 640px - Botones apilados verticalmente
  - `md`: 768px - Grid de 2 columnas para acciones
  - `lg`: 1024px - Layout de 3 columnas (contenido + sidebar)
- **Touch-friendly**: Botones grandes (py-6), áreas de toque amplias
- **Texto adaptativo**: Tamaños de fuente ajustados por viewport

## 🎯 Mejores Prácticas Implementadas

1. **UX**:
   - Feedback inmediato con toasts
   - Loading states claros
   - Confirmaciones para acciones destructivas
   - Alternativas antes de cancelar
   - Información contextual y ayuda

2. **Código**:
   - Componentes reutilizables (Badge, Button, Card)
   - Tipos TypeScript estrictos
   - Error handling completo
   - Separación de concerns (service layer)
   - Código DRY (Don't Repeat Yourself)

3. **Accesibilidad**:
   - Labels semánticos
   - Contraste de colores adecuado
   - Estados de foco visibles
   - Mensajes descriptivos

4. **Performance**:
   - Carga lazy de datos
   - Estados de loading
   - Prevención de re-renders innecesarios

## 🐛 Manejo de Errores

```typescript
// Patrón general
try {
  const result = await service.operation(params)
  
  if (result.success) {
    toast({ title: 'Éxito', description: result.message })
    router.push('/dashboard/membresia')
  } else {
    toast({ 
      title: 'Error', 
      description: result.message, 
      variant: 'destructive' 
    })
  }
} catch (error) {
  console.error('Error:', error)
  toast({ 
    title: 'Error', 
    description: 'Ocurrió un error inesperado',
    variant: 'destructive'
  })
}
```

## 🔄 Estados de Carga

Todas las páginas implementan 3 estados:

1. **Loading**: Spinner con mensaje "Cargando información..."
2. **Error/No disponible**: Card con ícono de alerta y mensaje
3. **Success**: Contenido principal con datos

## 📞 Soporte

Información de contacto mostrada en todas las páginas:
- 📧 Email: soporte@fitzone.com
- 📞 Teléfono: +57 300 123 4567
- 🕒 Horario: Lun-Vie 8AM-8PM, Sáb 9AM-2PM

## ✅ Testing Checklist

### Funcionalidad:
- [ ] Renovar membresía activa
- [ ] Renovar membresía expirada
- [ ] Suspender membresía (15 días)
- [ ] Suspender membresía (90 días)
- [ ] Verificar límite de 2 suspensiones
- [ ] Reactivar membresía suspendida
- [ ] Cancelar membresía activa
- [ ] Intentar cancelar membresía ya cancelada

### Validaciones:
- [ ] Suspensión con menos de 15 días (debe fallar)
- [ ] Suspensión con más de 90 días (debe fallar)
- [ ] Operaciones sin motivo (debe fallar)
- [ ] Cancelación sin confirmaciones (botón deshabilitado)
- [ ] Operaciones sin autenticación (redirige a login)

### UI/UX:
- [ ] Loading states funcionan
- [ ] Toasts se muestran correctamente
- [ ] Botones "Volver" funcionan
- [ ] Responsive en móvil
- [ ] Colores según plan correctos
- [ ] Estados (badges) correctos

## 🚀 Próximas Mejoras Sugeridas

1. **Notificaciones**:
   - Email cuando se renueva
   - Recordatorio antes de expirar (7 días)
   - Notificación cuando se reactiva suspensión

2. **Analytics**:
   - Tracking de razones de cancelación
   - Métricas de retención
   - Análisis de suspensiones

3. **Funcionalidades**:
   - Cambio de plan (upgrade/downgrade)
   - Historial de operaciones
   - Programar renovación automática
   - Método de pago actualizable

4. **Experiencia**:
   - Tour guiado para nuevos usuarios
   - Comparador de planes
   - Calculadora de ahorro anual
   - Programa de referidos

---

**Documentación creada**: ${new Date().toLocaleDateString('es-ES')}
**Versión**: 1.0.0
**Autor**: Sistema FitZone
