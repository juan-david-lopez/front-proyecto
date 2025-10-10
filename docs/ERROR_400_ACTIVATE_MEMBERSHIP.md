# 🔴 Error 400: activate-membership - Guía de Troubleshooting

## 📅 Fecha: 10 de octubre de 2025

---

## 🚨 **Error Actual**

```
POST http://localhost:8080/api/v1/payments/pi_3SGpJJ2MVzuTqurJ0zhI3cxL/activate-membership?userId=20&membershipType=PREMIUM 400 (Bad Request)
```

---

## 🔍 **Diagnóstico**

### **Error 400 = Bad Request**

El backend está rechazando la petición porque:

1. ❌ Los parámetros están mal formateados
2. ❌ Falta algún parámetro requerido
3. ❌ El tipo de datos no es el esperado
4. ❌ El Payment Intent no es válido
5. ❌ El usuario no existe
6. ❌ El endpoint tiene validación que falla

---

## 🔧 **Mejoras Implementadas en el Frontend**

### **1. Logging Mejorado**

**Archivo:** `services/paymentService.ts`

```typescript
// ANTES ❌
console.log('🔄 Activando membresía...', { paymentIntentId, userId, membershipType })

// DESPUÉS ✅
console.log('🔄 Activando membresía...')
console.log('📋 Parámetros:', { 
  paymentIntentId, 
  userId, 
  membershipType,
  userIdType: typeof userId,
  membershipTypeType: typeof membershipType 
})
console.log('🌐 URL completa:', `${this.baseURL}${endpoint}`)
```

**Ahora verás en consola:**

```javascript
🔄 Activando membresía...
📋 Parámetros: {
  paymentIntentId: "pi_3SGpJJ2MVzuTqurJ0zhI3cxL",
  userId: 20,
  membershipType: "PREMIUM",
  userIdType: "number",
  membershipTypeType: "string"
}
🌐 URL completa: http://localhost:8080/api/v1/payments/pi_3SGpJJ2MVzuTqurJ0zhI3cxL/activate-membership?userId=20&membershipType=PREMIUM
```

---

### **2. Manejo de Errores Mejorado**

```typescript
// ANTES ❌
const data = await response.json()
if (!response.ok) {
  throw new Error(data.message || `Error ${response.status}`)
}

// DESPUÉS ✅
let data
try {
  data = await response.json()
} catch (parseError) {
  const text = await response.text()
  console.error('📄 Response text:', text)
  throw new Error(`Error ${response.status}: ${response.statusText}`)
}

console.log('📥 Response data:', data)

if (!response.ok) {
  const errorMessage = data.error || data.message || data.details || 
                      `Error ${response.status}: ${response.statusText}`
  console.error('❌ Error message from backend:', errorMessage)
  console.error('❌ Full error data:', data)
  throw new Error(errorMessage)
}
```

**Ahora verás el mensaje COMPLETO del backend en la consola.**

---

## 🧪 **Cómo Probar con el Logging Mejorado**

1. **Hacer un pago de prueba**
2. **Abrir consola del navegador (F12)**
3. **Buscar estos logs:**

```javascript
// Logs esperados:
🔄 Activando membresía...
📋 Parámetros: { paymentIntentId: "pi_...", userId: 20, membershipType: "PREMIUM" }
🌐 URL completa: http://localhost:8080/api/v1/payments/pi_.../activate-membership?...
📡 [PaymentService] Response status: 400
📥 [PaymentService] Response data: { ... } // ✅ AQUÍ VERÁS EL ERROR REAL
❌ [PaymentService] Error message from backend: "Mensaje detallado del backend"
❌ [PaymentService] Full error data: { ... }
```

---

## 📊 **Posibles Causas del Error 400**

### **Causa 1: Payment Intent No Válido**

**Síntoma:**
```json
{
  "error": "Payment intent not found",
  "message": "El payment intent no existe o no está en estado succeeded"
}
```

**Solución Backend:**
```java
// Verificar que el PI existe y está en succeeded
PaymentIntent pi = stripeService.retrievePaymentIntent(paymentIntentId);
if (!"succeeded".equals(pi.getStatus())) {
    throw new BadRequestException("Payment intent no completado");
}
```

---

### **Causa 2: Usuario No Existe**

**Síntoma:**
```json
{
  "error": "User not found",
  "message": "Usuario con ID 20 no encontrado"
}
```

**Solución Backend:**
```java
User user = userRepository.findById(userId)
    .orElseThrow(() -> new BadRequestException("Usuario no encontrado"));
```

---

### **Causa 3: Tipo de Membresía Inválido**

**Síntoma:**
```json
{
  "error": "Invalid membership type",
  "message": "PREMIUM no es un tipo válido. Valores permitidos: BASIC, PREMIUM, ELITE"
}
```

**Solución Backend:**
```java
if (!Arrays.asList("BASIC", "PREMIUM", "ELITE").contains(membershipType)) {
    throw new BadRequestException("Tipo de membresía inválido");
}
```

---

### **Causa 4: Usuario Ya Tiene Membresía Activa**

**Síntoma:**
```json
{
  "error": "User already has active membership",
  "message": "El usuario ya tiene una membresía activa"
}
```

**Solución:** Esto NO debería ser un error 400. El backend debería:
- Devolver 200 si la membresía ya está activa
- O actualizar la fecha de expiración

---

### **Causa 5: Parámetros Mal Formateados**

**Síntoma:**
```json
{
  "error": "Invalid parameters",
  "message": "userId debe ser un número, membershipType debe ser un string"
}
```

**Verificar en consola:**
```javascript
📋 Parámetros: {
  userId: 20,                    // ✅ Debe ser number
  membershipType: "PREMIUM",     // ✅ Debe ser string
  userIdType: "number",          // ✅ Verificar tipo
  membershipTypeType: "string"   // ✅ Verificar tipo
}
```

---

## 🔍 **Debugging Paso a Paso**

### **Paso 1: Ver Parámetros Enviados**

En la consola, busca:
```javascript
📋 Parámetros: { ... }
```

Verifica que:
- `paymentIntentId` empieza con `pi_`
- `userId` es un número
- `membershipType` es un string (`BASIC`, `PREMIUM` o `ELITE`)

---

### **Paso 2: Ver URL Completa**

```javascript
🌐 URL completa: http://localhost:8080/api/v1/payments/pi_.../activate-membership?userId=20&membershipType=PREMIUM
```

**Verifica:**
- URL tiene formato correcto
- Parámetros en query string están presentes
- No hay caracteres raros o espacios

---

### **Paso 3: Ver Respuesta del Backend**

```javascript
📥 [PaymentService] Response data: { ... }
❌ [PaymentService] Error message from backend: "..."
❌ [PaymentService] Full error data: { ... }
```

**Aquí verás el mensaje REAL del backend.**

---

### **Paso 4: Verificar con Postman**

```bash
POST http://localhost:8080/api/v1/payments/{paymentIntentId}/activate-membership
Query Params:
  - userId: 20
  - membershipType: PREMIUM
Headers:
  - Authorization: Bearer {TOKEN}
  - Content-Type: application/json
```

**Respuesta esperada (200):**
```json
{
  "success": true,
  "data": {
    "membershipId": 123,
    "userId": 20,
    "membershipType": "PREMIUM",
    "startDate": "2025-10-10",
    "endDate": "2026-10-10"
  }
}
```

**Respuesta de error (400):**
```json
{
  "success": false,
  "error": "Mensaje detallado del error",
  "timestamp": 1728518400000
}
```

---

## 📝 **Checklist de Verificación**

### **Frontend:**

- [x] Logging mejorado implementado
- [x] Manejo de errores mejorado
- [x] Parámetros validados antes de enviar
- [ ] Ver logs en consola después de probar

### **Backend:**

- [ ] Endpoint existe: `POST /api/v1/payments/{paymentIntentId}/activate-membership`
- [ ] Acepta query params: `userId` y `membershipType`
- [ ] Valida Payment Intent existe y está succeeded
- [ ] Valida usuario existe
- [ ] Valida membershipType es válido
- [ ] Devuelve error 400 con mensaje descriptivo
- [ ] Actualiza `user.membershipType` en BD

---

## 🚀 **Próximos Pasos**

### **1. Probar con Logging Mejorado**

Hacer un nuevo pago y **capturar todos los logs de la consola**, especialmente:

```javascript
📥 [PaymentService] Response data: { ... }
❌ [PaymentService] Error message from backend: "..."
```

### **2. Compartir Logs con Backend**

El mensaje de error completo del backend te dirá exactamente qué está mal.

### **3. Verificar en Backend**

Revisar el controlador `PaymentController.java` método `activateMembershipAfterPayment` para ver:
- Qué validaciones tiene
- Qué errores devuelve
- Por qué rechaza la petición

---

## 🎯 **Resultado Esperado**

Después de probar con el logging mejorado, deberías ver algo como:

```javascript
// Caso Exitoso:
📥 Response data: { success: true, data: { membershipId: 123, ... } }
✅ Membresía activada exitosamente

// Caso Error (con mensaje detallado):
📥 Response data: { 
  success: false, 
  error: "Usuario ya tiene membresía activa",
  details: "El usuario 20 ya tiene una membresía PREMIUM activa"
}
❌ Error message from backend: "Usuario ya tiene membresía activa"
```

---

## 📞 **Información para el Backend**

Cuando compartas el error con el backend, incluye:

1. **Payment Intent ID:** `pi_3SGpJJ2MVzuTqurJ0zhI3cxL`
2. **User ID:** `20`
3. **Membership Type:** `PREMIUM`
4. **Status Code:** `400`
5. **Error Message:** (el que aparezca en los nuevos logs)
6. **Timestamp:** Cuando ocurrió el error

---

**Estado:** ✅ Frontend mejorado con mejor logging  
**Acción:** Probar nuevo pago y capturar logs completos  
**Objetivo:** Identificar mensaje exacto del error 400
