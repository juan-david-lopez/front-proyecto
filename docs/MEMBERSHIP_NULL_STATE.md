# 🎯 Manejo del Estado "Sin Membresía"

## 📋 Resumen

Este documento explica cómo el sistema maneja correctamente el estado **"sin membresía"** como un estado válido del usuario, no como un error.

---

## ✅ Filosofía del Diseño

### Antes ❌
```typescript
// Trataba "sin membresía" como ERROR
try {
  const membership = await membershipService.getMembershipDetails(userId)
  // Solo llega aquí si hay membresía
} catch (error) {
  // "Sin membresía" caía aquí como error
  showError("No tienes membresía")
}
```

### Ahora ✅
```typescript
// Trata "sin membresía" como ESTADO VÁLIDO
const membership = await membershipService.getMembershipDetails(userId)

if (membership === null) {
  // Usuario no tiene membresía - Mostrar UI para comprar
  showPurchaseMembershipUI()
} else {
  // Usuario tiene membresía - Mostrar detalles
  showMembershipDetails(membership)
}
```

---

## 🔧 Implementación

### 1. Servicio de Membresías

**Archivo:** `services/membershipService.ts`

```typescript
/**
 * Obtiene los detalles de la membresía de un usuario
 * @returns MembershipInfo | null
 * - null = Usuario no tiene membresía (estado válido, no error)
 * - MembershipInfo = Usuario tiene membresía activa
 */
async getMembershipDetails(userId: number): Promise<MembershipInfo | null> {
  try {
    // Validar userId
    if (!userId || isNaN(userId) || userId === 0) {
      console.warn("⚠️ Invalid userId:", userId)
      return null
    }

    const response = await this.request<ApiResponse<MembershipInfo>>(`/memberships/${userId}`)
    
    // Si no hay datos o membresía es NONE
    if (!response.data || response.data.membershipType === MembershipTypeName.NONE) {
      console.log(`ℹ️ Usuario ${userId} no tiene membresía activa`)
      return null
    }

    return response.data
    
  } catch (error: any) {
    // 404 = No tiene membresía (estado válido)
    if (error.message?.includes('404')) {
      console.log(`ℹ️ Usuario ${userId} no tiene membresía (404)`)
      return null
    }
    
    // Otros errores también retornan null
    console.error("❌ Error técnico:", error)
    return null
  }
}
```

**Estados que retornan `null`:**
- Usuario válido sin membresía (404)
- Membresía con tipo `NONE`
- Membresía inactiva
- UserId inválido (0, null, NaN)
- Errores de red/servidor

---

### 2. Componentes que lo Usan

#### A. Dashboard de Membresía

**Archivo:** `app/dashboard/membresia/page.tsx`

```typescript
const loadMembershipData = async () => {
  try {
    setLoading(true)
    const userData = userService.getCurrentUser()
    
    if (!userData || !userData.idUser) {
      showError("Error", "No se pudo obtener la información del usuario")
      router.push('/login')
      return
    }

    const userIdNumber = Number(userData.idUser)
    setUserId(userIdNumber)

    // getMembershipDetails retorna null si no hay membresía
    const membershipData = await membershipManagementService.getMembershipDetails(userIdNumber)
    
    if (membershipData === null) {
      // Usuario no tiene membresía - ESTADO VÁLIDO
      console.log('ℹ️ Usuario no tiene membresía activa - mostrar UI de compra')
      setMembership(null)
    } else {
      // Usuario tiene membresía
      console.log('✅ Membresía encontrada:', membershipData)
      setMembership(membershipData)
    }
  } catch (error) {
    // Solo errores TÉCNICOS llegan aquí (red caída, servidor caído, etc.)
    console.error('❌ Error técnico:', error)
    showError("Error", "Hubo un problema al cargar la información")
    setMembership(null)
  } finally {
    setLoading(false)
  }
}
```

**UI Condicional:**
```tsx
{!membership && (
  <div className="space-y-6">
    {/* Mensaje de bienvenida */}
    <Card className="bg-gradient-to-br from-[#ff6b00] to-red-600">
      <CardContent className="py-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-3">
          ¡Bienvenido a FitZone!
        </h2>
        <p className="text-white/90 text-lg">
          Actualmente no tienes una membresía activa. 
          Selecciona el plan perfecto para ti.
        </p>
        <Link href="/membresias">
          <Button size="lg" className="bg-white text-[#ff6b00]">
            Ver Planes Disponibles
          </Button>
        </Link>
      </CardContent>
    </Card>
    
    {/* Beneficios, FAQs, etc. */}
  </div>
)}

{membership && (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Detalles de membresía activa */}
  </div>
)}
```

---

## 🎨 Experiencia del Usuario

### Escenario 1: Usuario sin Membresía

1. **Accede a `/dashboard/membresia`**
2. **Ve:**
   - ✅ Mensaje de bienvenida amigable
   - ✅ Botón destacado "Ver Planes Disponibles"
   - ✅ Beneficios de FitZone
   - ✅ Preguntas frecuentes
   - ✅ Opción de volver al dashboard

3. **NO ve:**
   - ❌ Mensajes de error
   - ❌ Pantallas rojas de advertencia
   - ❌ "Error 404"

### Escenario 2: Usuario con Membresía

1. **Accede a `/dashboard/membresia`**
2. **Ve:**
   - ✅ Card con su plan actual (Básico/Premium/ELITE)
   - ✅ Estado de membresía (Activa/Vencida/Suspendida)
   - ✅ Fechas de inicio y vencimiento
   - ✅ Días restantes
   - ✅ Beneficios incluidos
   - ✅ Acciones disponibles (Renovar, Suspender, Cancelar)

---

## 🔍 Casos de Uso

### Caso 1: Nuevo Usuario
```typescript
// Usuario recién registrado
const userId = 123
const membership = await membershipService.getMembershipDetails(userId)

console.log(membership) // null ✅
// Mostrar: UI de compra de membresía
```

### Caso 2: Usuario con Membresía Vencida
```typescript
// Membresía expiró hace 1 semana
const membership = await membershipService.getMembershipDetails(userId)

console.log(membership) // null ✅
// Mostrar: UI de renovación de membresía
```

### Caso 3: Usuario con Membresía Activa
```typescript
// Membresía Premium activa
const membership = await membershipService.getMembershipDetails(userId)

console.log(membership) 
// {
//   id: 456,
//   type: { name: 'PREMIUM', ... },
//   status: 'ACTIVE',
//   startDate: '2025-01-01',
//   endDate: '2025-02-01',
//   daysRemaining: 15,
//   ...
// } ✅
// Mostrar: Detalles de membresía
```

### Caso 4: Error de Red
```typescript
// Backend caído o sin conexión
try {
  const membership = await membershipService.getMembershipDetails(userId)
  console.log(membership) // null ✅
  // Mostrar: UI de compra con mensaje "No pudimos verificar tu membresía"
} catch (error) {
  // Nunca llega aquí, el servicio maneja errores internamente
}
```

---

## 📊 Comparación

| Situación | Antes (❌ Error) | Ahora (✅ Estado Válido) |
|-----------|------------------|---------------------------|
| Usuario nuevo sin membresía | `throw Error("Not found")` | `return null` |
| Membresía vencida | `throw Error("Expired")` | `return null` |
| Error 404 del backend | `throw Error("404")` | `return null` |
| UserId inválido (0) | `throw Error("Invalid")` | `return null` |
| Backend caído | `throw Error("Network")` | `return null` |
| Usuario ve | ❌ Pantalla de error roja | ✅ UI amigable de compra |

---

## 🛠️ Métodos Relacionados

### `checkMembership(userId)`
**Propósito:** Verificar estado rápido de membresía
**Retorna:** Siempre un objeto `MembershipStatusResponse`
```typescript
{
  isActive: boolean,
  status: "ACTIVE" | "INACTIVE",
  membershipType: MembershipTypeName
}
```

**Nunca retorna `null`**, siempre retorna un objeto con datos por defecto:
```typescript
{
  isActive: false,
  status: "INACTIVE",
  membershipType: MembershipTypeName.NONE
}
```

### `getMembershipDetails(userId)`
**Propósito:** Obtener detalles completos de membresía
**Retorna:** `MembershipInfo | null`
```typescript
null // Si no tiene membresía
{
  id, type, status, startDate, endDate, 
  daysRemaining, suspensionsUsed, ...
} // Si tiene membresía
```

---

## ✅ Ventajas del Nuevo Enfoque

1. **Mejor UX:**
   - Usuario ve mensajes amigables, no errores
   - UI adaptada a su situación real
   - Llamados a la acción claros

2. **Código más limpio:**
   - Sin bloques try-catch innecesarios
   - Lógica clara con `if (membership === null)`
   - Menos manejo de errores en componentes

3. **Semántica correcta:**
   - "Sin membresía" NO es un error
   - Es un estado válido y esperado
   - El sistema lo trata como tal

4. **Debugging más fácil:**
   - Logs claros: `ℹ️ Usuario no tiene membresía`
   - No confunde errores técnicos con estados válidos
   - Consola más limpia

---

## 🚀 Implementado en:

- ✅ `services/membershipService.ts`
- ✅ `services/membershipManagementService.ts`
- ✅ `app/dashboard/membresia/page.tsx`
- ✅ `app/dashboard/page.tsx` (usa `checkMembership`)

---

## 📝 Notas para Desarrolladores

### Al agregar nuevas features:

```typescript
// ✅ CORRECTO
const membership = await membershipService.getMembershipDetails(userId)
if (membership === null) {
  // Manejar caso sin membresía
} else {
  // Usar membership.type, membership.status, etc.
}

// ❌ INCORRECTO
try {
  const membership = await membershipService.getMembershipDetails(userId)
  // Asumir que siempre hay membresía
} catch (error) {
  // Tratar "sin membresía" como error
}
```

### Al hacer pruebas:

```typescript
// Caso de prueba 1: Usuario sin membresía
expect(await membershipService.getMembershipDetails(newUserId)).toBe(null)

// Caso de prueba 2: Usuario con membresía activa
const membership = await membershipService.getMembershipDetails(activeUserId)
expect(membership).not.toBe(null)
expect(membership.status).toBe('ACTIVE')
```

---

## 🎉 Resultado

Un sistema que trata a los usuarios sin membresía con respeto y claridad, guiándolos hacia la compra en lugar de mostrarles errores confusos.

**Antes:** "Error 404: Membership not found" 😵
**Ahora:** "¡Bienvenido! Selecciona tu plan perfecto" 🎉
