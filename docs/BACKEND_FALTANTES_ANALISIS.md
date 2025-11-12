# 📊 ANÁLISIS: Lo que le falta al Backend según el Frontend

**Fecha de análisis:** 7 de noviembre de 2025  
**Proyecto:** FitZone - Sistema de Gestión de Gimnasios  
**Frontend:** Next.js 14 + TypeScript  
**Backend:** Spring Boot 3.5.4 + Java 21

---

## 📋 Tabla de Contenidos

- [Resumen Ejecutivo](#resumen-ejecutivo)
- [Lo que YA tiene el Backend](#lo-que-ya-tiene-el-backend)
- [Lo que le FALTA al Backend](#lo-que-le-falta-al-backend)
  - [1. Sistema de Recibos](#1-sistema-de-recibos-8-endpoints)
  - [2. Notificaciones de Membresía](#2-notificaciones-de-membresía-11-endpoints)
  - [3. Auto-renovación Avanzada](#3-auto-renovación-avanzada-6-endpoints)
  - [4. Gestión Detallada de Membresías](#4-gestión-detallada-de-membresías-6-endpoints)
  - [5. Recuperación de Contraseña](#5-recuperación-de-contraseña-completa)
  - [6. Ubicaciones/Sedes](#6-ubicacionessedes-3-endpoints)
  - [7. Reportes Administrativos](#7-reportes-administrativos-7-endpoints)
  - [8. Trabajadores/Staff](#8-trabajadoresstaff-6-endpoints)
  - [9. Reservas Extendidas](#9-reservas-extendidas-4-endpoints)
  - [10. Perfil de Usuario Extendido](#10-perfil-de-usuario-extendido-4-endpoints)
- [Resumen por Prioridad](#resumen-por-prioridad)
- [Plan de Implementación](#plan-de-implementación)
- [Notas Importantes](#notas-importantes)

---

## 🎯 Resumen Ejecutivo

El backend de FitZone tiene implementadas **las funcionalidades core** del sistema (autenticación, fidelización, pagos básicos con Stripe, membresías y reservas). Sin embargo, **faltan 56 endpoints** que el frontend ya está preparado para consumir, divididos en:

- **26 endpoints CRÍTICOS** 🔴 - Bloquean funcionalidades principales
- **16 endpoints IMPORTANTES** 🟠 - Funcionalidades relevantes
- **14 endpoints SECUNDARIOS** 🟡 - Mejoras y módulos adicionales

---

## ✅ Lo que YA tiene el Backend

### 1. **Autenticación Básica** ✅
- ✅ Login con JWT
- ✅ Registro de usuarios
- ✅ Verificación OTP (2FA)
- ✅ Refresh tokens
- ✅ Forgot password (solicitud)

### 2. **Sistema de Fidelización COMPLETO** ✅
- ✅ **14 endpoints de fidelización**
- ✅ 4 niveles (Bronce, Plata, Oro, Platino)
- ✅ 12 recompensas canjeables
- ✅ Sistema de puntos y actividades
- ✅ Canjes con códigos únicos
- ✅ Dashboard de fidelización
- ✅ Tareas programadas (cron jobs)

### 3. **Membresías Básicas** ✅
- ✅ CRUD de tipos de membresía
- ✅ Gestión de membresías activas
- ✅ Sistema de renovación automática básico
- ✅ Consulta de estado de membresía

### 4. **Reservas** ✅
- ✅ Sistema de reservas de clases
- ✅ Timeslots (horarios disponibles)
- ✅ Gestión de horarios
- ✅ Consulta de reservas por usuario

### 5. **Pagos con Stripe** ✅
- ✅ Crear Payment Intents
- ✅ Procesar pagos
- ✅ Crear Checkout Sessions
- ✅ Confirmar pagos
- ✅ Webhooks de Stripe (7 eventos)
- ✅ Guardar métodos de pago
- ✅ Listar/eliminar métodos de pago

### 6. **Infraestructura** ✅
- ✅ Base de datos PostgreSQL (16 tablas)
- ✅ Vistas optimizadas (5 vistas)
- ✅ Índices de rendimiento
- ✅ Spring Security
- ✅ Integración SendGrid (emails)
- ✅ CORS configurado

---

## ❌ Lo que le FALTA al Backend

### 🔴 **1. SISTEMA DE RECIBOS (8 endpoints)**

**Estado:** ❌ **NO IMPLEMENTADO**  
**Prioridad:** 🔥 **CRÍTICA**  
**Servicio Frontend:** `receiptService.ts`

El frontend tiene un servicio completo de recibos que consume estos endpoints:

#### Endpoints Faltantes:

```typescript
❌ POST   /api/v1/receipts
❌ GET    /api/v1/users/{userId}/receipts
❌ GET    /api/v1/receipts/{receiptId}
❌ GET    /api/v1/users/{userId}/transactions
❌ GET    /api/v1/users/{userId}/payment-stats
❌ PATCH  /api/v1/receipts/{receiptId}/mark-sent
❌ POST   /api/v1/receipts/{receiptId}/pdf
❌ POST   /api/v1/receipts/{receiptId}/email
```

#### Detalle de Endpoints:

**1.1. Crear Recibo**
```http
POST /api/v1/receipts
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "userId": 123,
  "transactionType": "MEMBERSHIP_PURCHASE",
  "membershipType": "PREMIUM",
  "membershipStartDate": "2025-11-07",
  "membershipEndDate": "2025-12-07",
  "amount": 250000,
  "paymentMethod": "CREDIT_CARD",
  "paymentInfo": {
    "method": "CREDIT_CARD",
    "cardLastFour": "4242",
    "cardBrand": "Visa",
    "transactionId": "pi_123456789",
    "authorizationCode": "AUTH123"
  },
  "billingInfo": {
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+57 300 123 4567",
    "address": "Calle 123 #45-67",
    "city": "Bogotá",
    "country": "Colombia"
  },
  "notes": "Pago membresía mensual"
}

Response (201):
{
  "success": true,
  "message": "Recibo generado exitosamente",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "receiptNumber": "REC-2025-00001",
    "userId": 123,
    "transactionType": "MEMBERSHIP_PURCHASE",
    "transactionStatus": "COMPLETED",
    "transactionDate": "2025-11-07T10:30:00Z",
    "items": [...],
    "subtotal": 210084.03,
    "tax": 39915.97,
    "total": 250000,
    "currency": "COP"
  }
}
```

**1.2. Obtener Recibos de Usuario**
```http
GET /api/v1/users/{userId}/receipts?status=COMPLETED&dateFrom=2025-01-01
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "receiptNumber": "REC-2025-00001",
      "transactionDate": "2025-11-07T10:30:00Z",
      "amount": 250000,
      "status": "COMPLETED"
    }
  ]
}
```

**1.3. Obtener Recibo por ID**
```http
GET /api/v1/receipts/{receiptId}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "receiptNumber": "REC-2025-00001",
    // ... todos los campos del recibo
  }
}
```

**1.4. Obtener Resumen de Transacciones**
```http
GET /api/v1/users/{userId}/transactions
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "receiptNumber": "REC-2025-00001",
      "date": "2025-11-07T10:30:00Z",
      "type": "MEMBERSHIP_PURCHASE",
      "status": "COMPLETED",
      "amount": 250000,
      "currency": "COP"
    }
  ]
}
```

**1.5. Obtener Estadísticas de Pagos**
```http
GET /api/v1/users/{userId}/payment-stats
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "totalTransactions": 15,
    "totalAmount": 3750000,
    "successfulTransactions": 14,
    "failedTransactions": 1,
    "averageTransactionAmount": 250000,
    "byPaymentMethod": {
      "CREDIT_CARD": 2500000,
      "DEBIT_CARD": 750000
    }
  }
}
```

**1.6. Marcar Recibo como Enviado**
```http
PATCH /api/v1/receipts/{receiptId}/mark-sent
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Recibo marcado como enviado"
}
```

**1.7. Generar PDF del Recibo**
```http
POST /api/v1/receipts/{receiptId}/pdf
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "pdfUrl": "https://fitzone.com/receipts/REC-2025-00001.pdf"
}
```

**1.8. Enviar Recibo por Email**
```http
POST /api/v1/receipts/{receiptId}/email
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "email": "usuario@example.com"
}

Response (200):
{
  "success": true,
  "message": "Recibo enviado exitosamente"
}
```

#### Impacto sin implementación:
- ❌ El usuario no puede ver su historial de pagos
- ❌ No se pueden descargar recibos en PDF
- ❌ No se pueden enviar recibos por email
- ❌ No hay trazabilidad de transacciones
- ❌ Problemas legales por falta de facturación

#### Entidad sugerida:
```java
@Entity
@Table(name = "receipts")
public class Receipt {
    @Id
    private String id; // UUID
    
    private String receiptNumber; // REC-2025-00001
    private Long userId;
    private String transactionType; // MEMBERSHIP_PURCHASE, RENEWAL, etc.
    private String transactionStatus; // COMPLETED, PENDING, FAILED
    private LocalDateTime transactionDate;
    
    private String membershipType;
    private LocalDate membershipStartDate;
    private LocalDate membershipEndDate;
    
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal discount;
    private BigDecimal total;
    private String currency;
    
    @Embedded
    private PaymentInfo paymentInfo;
    
    @Embedded
    private BillingInfo billingInfo;
    
    private String notes;
    private String pdfUrl;
    private Boolean emailSent;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

---

### 🔴 **2. NOTIFICACIONES DE MEMBRESÍA (11 endpoints)**

**Estado:** ❌ **NO IMPLEMENTADO**  
**Prioridad:** 🔥 **CRÍTICA**  
**Servicio Frontend:** `membershipNotificationService.ts`

#### Endpoints Faltantes:

```typescript
❌ GET    /api/v1/users/{userId}/notifications
❌ GET    /api/v1/users/{userId}/notifications?unread=true
❌ GET    /api/v1/users/{userId}/notifications/{id}
❌ POST   /api/v1/users/{userId}/notifications
❌ PUT    /api/v1/users/{userId}/notifications/{id}
❌ DELETE /api/v1/users/{userId}/notifications/{id}
❌ PATCH  /api/v1/users/{userId}/notifications/{id}/mark-read
❌ PATCH  /api/v1/users/{userId}/notifications/mark-all-read
❌ GET    /api/v1/users/{userId}/notifications/unread-count
❌ POST   /api/v1/users/{userId}/notifications/{id}/send
❌ GET    /api/v1/users/{userId}/notifications/settings
```

#### Detalle de Endpoints:

**2.1. Listar Notificaciones**
```http
GET /api/v1/users/{userId}/notifications
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 123,
      "type": "EXPIRATION_WARNING",
      "priority": "HIGH",
      "title": "Tu membresía vence pronto",
      "message": "Tu membresía Premium vence en 3 días",
      "isRead": false,
      "createdAt": "2025-11-07T10:00:00Z",
      "expiresAt": "2025-12-07T10:00:00Z"
    }
  ]
}
```

**2.2. Notificaciones No Leídas**
```http
GET /api/v1/users/{userId}/notifications?unread=true
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": [...]
}
```

**2.3. Obtener Notificación Específica**
```http
GET /api/v1/users/{userId}/notifications/{id}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 123,
    "type": "EXPIRATION_WARNING",
    // ... campos completos
  }
}
```

**2.4. Crear Notificación**
```http
POST /api/v1/users/{userId}/notifications
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "type": "RENEWAL_REMINDER",
  "priority": "MEDIUM",
  "title": "Recuerda renovar tu membresía",
  "message": "Tu membresía vence en 7 días",
  "actionUrl": "/membresias",
  "actionLabel": "Renovar ahora",
  "expiresAt": "2025-12-07T10:00:00Z"
}

Response (201):
{
  "success": true,
  "message": "Notificación creada exitosamente",
  "data": { ... }
}
```

**2.5. Marcar como Leída**
```http
PATCH /api/v1/users/{userId}/notifications/{id}/mark-read
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Notificación marcada como leída"
}
```

**2.6. Marcar Todas como Leídas**
```http
PATCH /api/v1/users/{userId}/notifications/mark-all-read
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Todas las notificaciones marcadas como leídas"
}
```

**2.7. Contador de No Leídas**
```http
GET /api/v1/users/{userId}/notifications/unread-count
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

**2.8. Enviar Notificación**
```http
POST /api/v1/users/{userId}/notifications/{id}/send
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Notificación enviada exitosamente"
}
```

#### Tipos de Notificación:
```typescript
enum NotificationType {
  EXPIRATION_WARNING,     // Membresía por vencer
  EXPIRED,               // Membresía vencida
  RENEWAL_REMINDER,      // Recordatorio renovación
  PAYMENT_SUCCESS,       // Pago exitoso
  PAYMENT_FAILED,        // Pago fallido
  AUTO_RENEWAL_SUCCESS,  // Renovación automática exitosa
  AUTO_RENEWAL_FAILED,   // Renovación automática fallida
  MEMBERSHIP_ACTIVATED,  // Membresía activada
  GENERAL_ANNOUNCEMENT   // Anuncio general
}

enum NotificationPriority {
  LOW,
  MEDIUM,
  HIGH,
  URGENT
}
```

#### Impacto sin implementación:
- ❌ El usuario no recibe alertas de vencimiento
- ❌ No hay notificaciones de pagos exitosos/fallidos
- ❌ Sistema de campana de notificaciones no funciona
- ❌ No hay recordatorios de renovación

---

### 🔴 **3. AUTO-RENOVACIÓN AVANZADA (6 endpoints)**

**Estado:** ⚠️ **PARCIALMENTE IMPLEMENTADO**  
**Prioridad:** 🔥 **CRÍTICA**  
**Servicio Frontend:** `membershipManagementService.ts`

El backend tiene renovación automática básica, pero faltan endpoints de configuración avanzada:

#### Endpoints Faltantes:

```typescript
❌ GET    /api/v1/users/{userId}/membership/auto-renewal-preferences
❌ PUT    /api/v1/users/{userId}/membership/auto-renewal-preferences
❌ POST   /api/v1/users/{userId}/membership/auto-renewal/enable
❌ POST   /api/v1/users/{userId}/membership/auto-renewal/disable
❌ GET    /api/v1/users/{userId}/membership/check-expiration
❌ POST   /api/v1/users/{userId}/membership/auto-renewal/test
```

#### Detalle de Endpoints:

**3.1. Obtener Preferencias de Auto-renovación**
```http
GET /api/v1/users/{userId}/membership/auto-renewal-preferences
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "enabled": true,
    "daysBeforeRenewal": 7,
    "paymentMethodId": "pm_123456789",
    "notifyBeforeRenewal": true,
    "notificationDays": 3,
    "autoRenewOnExpiration": true,
    "maxRetryAttempts": 3
  }
}
```

**3.2. Actualizar Preferencias**
```http
PUT /api/v1/users/{userId}/membership/auto-renewal-preferences
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "enabled": true,
  "daysBeforeRenewal": 7,
  "paymentMethodId": "pm_123456789",
  "notifyBeforeRenewal": true,
  "notificationDays": 3
}

Response (200):
{
  "success": true,
  "message": "Preferencias actualizadas exitosamente",
  "data": { ... }
}
```

**3.3. Activar Auto-renovación**
```http
POST /api/v1/users/{userId}/membership/auto-renewal/enable
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "paymentMethodId": "pm_123456789",
  "daysBeforeRenewal": 7
}

Response (200):
{
  "success": true,
  "message": "Auto-renovación activada exitosamente"
}
```

**3.4. Desactivar Auto-renovación**
```http
POST /api/v1/users/{userId}/membership/auto-renewal/disable
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Auto-renovación desactivada exitosamente"
}
```

**3.5. Verificar Vencimiento**
```http
GET /api/v1/users/{userId}/membership/check-expiration
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "isExpiring": true,
    "expirationDate": "2025-11-10T00:00:00Z",
    "daysRemaining": 3,
    "autoRenewalEnabled": true,
    "willAutoRenew": true,
    "nextRenewalDate": "2025-11-03T00:00:00Z"
  }
}
```

**3.6. Probar Renovación (Testing)**
```http
POST /api/v1/users/{userId}/membership/auto-renewal/test
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Prueba de renovación exitosa",
  "data": {
    "canRenew": true,
    "paymentMethodValid": true,
    "sufficientFunds": true,
    "estimatedAmount": 250000
  }
}
```

#### Impacto sin implementación:
- ❌ El usuario no puede configurar auto-renovación desde la UI
- ❌ No hay validación antes de intentar renovar
- ❌ No se pueden ajustar días de anticipación
- ❌ Difícil diagnosticar problemas de renovación

---

### 🔴 **4. GESTIÓN DETALLADA DE MEMBRESÍAS (6 endpoints)**

**Estado:** ⚠️ **PARCIALMENTE IMPLEMENTADO**  
**Prioridad:** 🔥 **CRÍTICA**  
**Servicio Frontend:** `membershipManagementService.ts`

#### Endpoints Faltantes:

```typescript
❌ GET    /memberships/details/{userId}
❌ POST   /memberships/renew
❌ POST   /memberships/suspend
❌ POST   /memberships/reactivate
❌ POST   /memberships/cancel
❌ GET    /memberships/history/{userId}
```

#### Detalle de Endpoints:

**4.1. Obtener Detalles Completos de Membresía**
```http
GET /memberships/details/{userId}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "hasMembership": true,
    "userId": 123,
    "membershipId": 456,
    "status": "ACTIVE",
    "membershipType": "PREMIUM",
    "startDate": "2025-10-07",
    "endDate": "2025-11-07",
    "daysRemaining": 3,
    "canSuspend": true,
    "canCancel": true,
    "suspensionsUsed": 1,
    "maxSuspensions": 2,
    "autoRenewalEnabled": true,
    "location": {
      "id": 1,
      "name": "Sede Norte"
    }
  }
}
```

**4.2. Renovar Membresía**
```http
POST /memberships/renew
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "userId": 123,
  "membershipType": "PREMIUM",
  "durationMonths": 1,
  "paymentMethodId": "pm_123456789"
}

Response (200):
{
  "success": true,
  "message": "Membresía renovada exitosamente",
  "data": {
    "membershipId": 456,
    "newEndDate": "2025-12-07",
    "amount": 250000
  }
}
```

**4.3. Suspender Membresía**
```http
POST /memberships/suspend
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "userId": 123,
  "reason": "VACACIONES",
  "startDate": "2025-11-10",
  "endDate": "2025-11-20",
  "notes": "Vacaciones familiares"
}

Response (200):
{
  "success": true,
  "message": "Membresía suspendida exitosamente",
  "data": {
    "suspensionId": 789,
    "daysExtended": 10
  }
}
```

**4.4. Reactivar Membresía**
```http
POST /memberships/reactivate
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "userId": 123,
  "membershipId": 456
}

Response (200):
{
  "success": true,
  "message": "Membresía reactivada exitosamente"
}
```

**4.5. Cancelar Membresía**
```http
POST /memberships/cancel
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "userId": 123,
  "reason": "MUDANZA",
  "feedback": "Me mudo de ciudad",
  "requestRefund": false
}

Response (200):
{
  "success": true,
  "message": "Membresía cancelada exitosamente",
  "data": {
    "effectiveDate": "2025-11-07",
    "refundAmount": 0
  }
}
```

**4.6. Historial de Membresías**
```http
GET /memberships/history/{userId}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 456,
      "type": "PREMIUM",
      "status": "ACTIVE",
      "startDate": "2025-10-07",
      "endDate": "2025-11-07",
      "amount": 250000
    },
    {
      "id": 455,
      "type": "BASICO",
      "status": "EXPIRED",
      "startDate": "2025-09-07",
      "endDate": "2025-10-07",
      "amount": 150000
    }
  ]
}
```

#### Impacto sin implementación:
- ❌ El botón "Gestionar Membresía" no funciona
- ❌ No se puede suspender temporalmente la membresía
- ❌ No hay historial de cambios de membresía
- ❌ Cancelaciones sin seguimiento

---

### 🔴 **5. RECUPERACIÓN DE CONTRASEÑA COMPLETA**

**Estado:** ⚠️ **PARCIALMENTE IMPLEMENTADO**  
**Prioridad:** 🔥 **CRÍTICA**

#### Endpoints:

```typescript
✅ POST   /auth/forgot-password              // YA EXISTE
❌ POST   /auth/reset-password               // FALTA
❌ POST   /auth/verify-reset-token           // FALTA
```

#### Detalle del Endpoint Faltante:

**5.1. Resetear Contraseña**
```http
POST /auth/reset-password
Content-Type: application/json

Body:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "NuevaPassword123!",
  "confirmPassword": "NuevaPassword123!"
}

Response (200):
{
  "success": true,
  "message": "Contraseña restablecida exitosamente"
}
```

**5.2. Verificar Token de Reseteo**
```http
POST /auth/verify-reset-token
Content-Type: application/json

Body:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (200):
{
  "success": true,
  "valid": true,
  "expiresAt": "2025-11-07T12:00:00Z"
}
```

#### Impacto sin implementación:
- ❌ Los usuarios pueden solicitar recuperación pero no completar el proceso
- ❌ Tokens de reseteo no se validan correctamente
- ❌ Pérdida de cuentas por contraseñas olvidadas

---

### 🟠 **6. UBICACIONES/SEDES (3 endpoints)**

**Estado:** ❌ **NO IMPLEMENTADO**  
**Prioridad:** ⚠️ **ALTA**  
**Servicio Frontend:** `locationService.ts`

#### Endpoints Faltantes:

```typescript
❌ GET    /api/v1/locations
❌ GET    /api/v1/locations/{id}
❌ GET    /api/v1/locations/by-city/{city}
```

#### Detalle de Endpoints:

**6.1. Listar Todas las Sedes**
```http
GET /api/v1/locations
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sede Norte",
      "address": "Calle 123 #45-67",
      "city": "Bogotá",
      "phone": "+57 300 123 4567",
      "email": "norte@fitzone.com",
      "amenities": ["Pesas", "Cardio", "Clases Grupales"],
      "operatingHours": {
        "Lunes": { "open": "06:00", "close": "22:00" },
        "Martes": { "open": "06:00", "close": "22:00" }
      },
      "capacity": 200,
      "isActive": true
    }
  ]
}
```

**6.2. Obtener Sede por ID**
```http
GET /api/v1/locations/{id}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Sede Norte",
    // ... campos completos
  }
}
```

**6.3. Sedes por Ciudad**
```http
GET /api/v1/locations/by-city/{city}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": [...]
}
```

#### Impacto sin implementación:
- ❌ El selector de sedes en registro no funciona
- ❌ No se pueden filtrar sedes por ciudad
- ❌ Información de sedes estática (hardcoded)

---

### 🟠 **7. REPORTES ADMINISTRATIVOS (7 endpoints)**

**Estado:** ❌ **NO IMPLEMENTADO**  
**Prioridad:** ⚠️ **ALTA**  
**Servicio Frontend:** `workerService.ts` (sección admin)

#### Endpoints Faltantes:

```typescript
❌ GET    /api/v1/admin/reports/kpis
❌ GET    /api/v1/admin/reports/revenue
❌ GET    /api/v1/admin/reports/memberships
❌ GET    /api/v1/admin/reports/attendance
❌ GET    /api/v1/admin/reports/retention
❌ POST   /api/v1/admin/reports/export
❌ GET    /api/v1/admin/dashboard
```

#### Detalle de Endpoints:

**7.1. KPIs Generales**
```http
GET /api/v1/admin/reports/kpis?period=month&startDate=2025-10-01&endDate=2025-10-31
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "totalMembers": 1250,
    "activeMembers": 1100,
    "newMembers": 85,
    "churnRate": 3.5,
    "revenue": 312500000,
    "averageRevenuePerMember": 250000,
    "attendanceRate": 72.5,
    "memberSatisfaction": 4.5
  }
}
```

**7.2. Reporte de Ingresos**
```http
GET /api/v1/admin/reports/revenue?period=month
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "totalRevenue": 312500000,
    "byMembershipType": {
      "BASICO": 75000000,
      "PREMIUM": 187500000,
      "ELITE": 50000000
    },
    "byPaymentMethod": {
      "CREDIT_CARD": 200000000,
      "DEBIT_CARD": 75000000,
      "CASH": 37500000
    },
    "projectedRevenue": 325000000
  }
}
```

**7.3. Reporte de Membresías**
```http
GET /api/v1/admin/reports/memberships
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "total": 1250,
    "active": 1100,
    "suspended": 50,
    "expired": 100,
    "byType": {
      "BASICO": 500,
      "PREMIUM": 625,
      "ELITE": 125
    },
    "expiringIn7Days": 45,
    "expiringIn30Days": 120
  }
}
```

**7.4. Reporte de Asistencia**
```http
GET /api/v1/admin/reports/attendance?startDate=2025-10-01&endDate=2025-10-31
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "totalCheckIns": 23450,
    "averagePerDay": 756,
    "peakHours": ["18:00-20:00", "06:00-08:00"],
    "byLocation": {
      "Sede Norte": 12500,
      "Sede Sur": 10950
    }
  }
}
```

**7.5. Reporte de Retención**
```http
GET /api/v1/admin/reports/retention
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "retentionRate": 87.5,
    "churnRate": 12.5,
    "averageMembershipDuration": 8.5,
    "renewalRate": 75.0,
    "membersByTenure": {
      "0-3months": 250,
      "3-6months": 200,
      "6-12months": 350,
      "12+months": 450
    }
  }
}
```

**7.6. Exportar Reportes**
```http
POST /api/v1/admin/reports/export
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "reportType": "revenue",
  "format": "PDF",
  "startDate": "2025-10-01",
  "endDate": "2025-10-31"
}

Response (200):
{
  "success": true,
  "fileUrl": "https://fitzone.com/reports/revenue-2025-10.pdf"
}
```

**7.7. Dashboard Administrativo**
```http
GET /api/v1/admin/dashboard
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "kpis": { ... },
    "recentTransactions": [ ... ],
    "expiringMemberships": [ ... ],
    "alerts": [ ... ]
  }
}
```

#### Impacto sin implementación:
- ❌ Administradores no pueden ver estadísticas
- ❌ No hay reportes de ingresos
- ❌ No se puede exportar data
- ❌ Difícil tomar decisiones basadas en datos

---

### 🟡 **8. TRABAJADORES/STAFF (6 endpoints)**

**Estado:** ❌ **NO IMPLEMENTADO**  
**Prioridad:** 📋 **MEDIA**  
**Servicio Frontend:** `workerService.ts`

#### Endpoints Faltantes:

```typescript
❌ GET    /api/workers
❌ POST   /api/workers
❌ GET    /api/workers/{id}
❌ PUT    /api/workers/{id}
❌ GET    /api/instructors/{id}/schedule
❌ GET    /api/instructors/{id}/classes
```

#### Impacto sin implementación:
- ❌ Módulo de instructores no funciona
- ❌ No se pueden asignar clases a instructores
- ❌ No hay gestión de personal

---

### 🟡 **9. RESERVAS EXTENDIDAS (4 endpoints)**

**Estado:** ⚠️ **PARCIALMENTE IMPLEMENTADO**  
**Prioridad:** 📋 **MEDIA**  
**Servicio Frontend:** `reservationService.ts`

#### Endpoints Faltantes:

```typescript
❌ GET    /api/reservations/available
❌ GET    /api/group-classes
❌ GET    /api/instructors
❌ GET    /api/specialized-spaces
```

#### Impacto sin implementación:
- ❌ Sistema de reservas incompleto
- ❌ No se muestran clases grupales disponibles
- ❌ No se pueden reservar espacios especializados

---

### 🟡 **10. PERFIL DE USUARIO EXTENDIDO (4 endpoints)**

**Estado:** ⚠️ **PARCIALMENTE IMPLEMENTADO**  
**Prioridad:** 📋 **MEDIA**  
**Servicio Frontend:** `userService.ts`

#### Endpoints Faltantes:

```typescript
❌ GET    /users/by-email?email={email}
❌ GET    /users/by-document?documentNumber={doc}
❌ PUT    /users/{id}/profile-picture
❌ PUT    /users/{id}/preferences
```

#### Impacto sin implementación:
- ❌ No se puede buscar usuario por email/documento
- ❌ No se puede actualizar foto de perfil
- ❌ Preferencias no se guardan en backend

---

## 📊 Resumen por Prioridad

### 🔥 **PRIORIDAD CRÍTICA** (Bloquea funcionalidades principales)

| # | Categoría | Endpoints | Estado |
|---|-----------|-----------|--------|
| 1 | Sistema de Recibos | 8 | ❌ No implementado |
| 2 | Notificaciones de Membresía | 11 | ❌ No implementado |
| 3 | Gestión Detallada de Membresías | 6 | ⚠️ Parcial |
| 4 | Reset Password | 1 | ⚠️ Parcial |

**Total: 26 endpoints críticos** 🔴

---

### ⚠️ **PRIORIDAD ALTA** (Funcionalidades importantes)

| # | Categoría | Endpoints | Estado |
|---|-----------|-----------|--------|
| 5 | Auto-renovación Avanzada | 6 | ⚠️ Parcial |
| 6 | Ubicaciones/Sedes | 3 | ❌ No implementado |
| 7 | Reportes Administrativos | 7 | ❌ No implementado |

**Total: 16 endpoints importantes** 🟠

---

### 📋 **PRIORIDAD MEDIA** (Mejoras y módulos adicionales)

| # | Categoría | Endpoints | Estado |
|---|-----------|-----------|--------|
| 8 | Trabajadores/Staff | 6 | ❌ No implementado |
| 9 | Reservas Extendidas | 4 | ⚠️ Parcial |
| 10 | Perfil Extendido | 4 | ⚠️ Parcial |

**Total: 14 endpoints secundarios** 🟡

---

## 🎯 **TOTAL DE ENDPOINTS FALTANTES: 56**

| Prioridad | Cantidad | Porcentaje |
|-----------|----------|------------|
| 🔴 **Críticos** | 26 | 46% |
| 🟠 **Importantes** | 16 | 29% |
| 🟡 **Secundarios** | 14 | 25% |
| **TOTAL** | **56** | **100%** |

---

## 📅 Plan de Implementación

### **FASE 1 - Semana 1** (Prioridad Crítica) 🔴

**Objetivo:** Desbloquear funcionalidades principales del frontend

#### Tareas:
1. ✅ **Sistema de Recibos** (8 endpoints)
   - Crear entidad `Receipt`
   - Implementar `ReceiptController`
   - Implementar `ReceiptService`
   - Generación de PDF con JasperReports o iText
   - Envío de emails con SendGrid
   - **Estimado:** 3 días

2. ✅ **Notificaciones de Membresía** (11 endpoints)
   - Crear entidad `MembershipNotification`
   - Implementar `NotificationController`
   - Implementar `NotificationService`
   - Sistema de push notifications
   - **Estimado:** 3 días

3. ✅ **Gestión Detallada de Membresías** (6 endpoints)
   - Extender `MembershipService`
   - Implementar suspensión/reactivación
   - Implementar cancelación con razones
   - Historial de cambios
   - **Estimado:** 2 días

4. ✅ **Reset Password** (1 endpoint)
   - Implementar endpoint de reseteo
   - Validación de tokens
   - **Estimado:** 1 día

**Total Fase 1:** 26 endpoints en 9 días laborales

---

### **FASE 2 - Semana 2** (Prioridad Alta) 🟠

**Objetivo:** Implementar funcionalidades importantes

#### Tareas:
1. ✅ **Auto-renovación Avanzada** (6 endpoints)
   - Extender `AutoRenewalService`
   - Configuración avanzada
   - Testing de renovación
   - **Estimado:** 2 días

2. ✅ **Ubicaciones/Sedes** (3 endpoints)
   - Crear entidad `Location` (si no existe)
   - Implementar `LocationController`
   - **Estimado:** 1 día

3. ✅ **Reportes Administrativos** (7 endpoints)
   - Crear `ReportController`
   - Implementar `ReportService`
   - Queries de agregación
   - Exportación a PDF/Excel
   - **Estimado:** 3 días

**Total Fase 2:** 16 endpoints en 6 días laborales

---

### **FASE 3 - Semana 3** (Prioridad Media) 🟡

**Objetivo:** Completar módulos adicionales

#### Tareas:
1. ✅ **Trabajadores/Staff** (6 endpoints)
   - Crear entidad `Worker`/`Instructor`
   - Implementar `WorkerController`
   - Gestión de horarios
   - **Estimado:** 2 días

2. ✅ **Reservas Extendidas** (4 endpoints)
   - Extender `ReservationService`
   - Clases grupales
   - Espacios especializados
   - **Estimado:** 2 días

3. ✅ **Perfil Extendido** (4 endpoints)
   - Extender `UserController`
   - Búsqueda por email/documento
   - Upload de imágenes
   - **Estimado:** 1 día

**Total Fase 3:** 14 endpoints en 5 días laborales

---

### **📊 Cronograma Completo**

| Fase | Duración | Endpoints | Prioridad |
|------|----------|-----------|-----------|
| **Fase 1** | 9 días | 26 | 🔴 Crítica |
| **Fase 2** | 6 días | 16 | 🟠 Alta |
| **Fase 3** | 5 días | 14 | 🟡 Media |
| **TOTAL** | **20 días** | **56** | - |

**Tiempo estimado total: 4 semanas** (considerando 1 desarrollador backend full-time)

---

## 📝 Notas Importantes

### ✅ **Lo que YA funciona bien:**

1. **Sistema de Fidelización** 🎁
   - ✅ 100% implementado
   - ✅ 14 endpoints funcionando
   - ✅ 4 niveles + 12 recompensas
   - ✅ Tareas programadas

2. **Pagos con Stripe** 💳
   - ✅ Payment Intents
   - ✅ Checkout Sessions
   - ✅ Webhooks configurados
   - ✅ Métodos de pago guardados

3. **Autenticación** 🔐
   - ✅ Login con JWT
   - ✅ 2FA con OTP
   - ✅ Refresh tokens
   - ✅ Registro de usuarios

4. **Infraestructura** 🏗️
   - ✅ PostgreSQL con 16 tablas
   - ✅ Spring Security
   - ✅ CORS configurado
   - ✅ SendGrid integrado

---

### ⚠️ **Consideraciones Técnicas:**

1. **Base de Datos**
   - Algunas entidades nuevas necesitarán migraciones
   - Crear índices para queries de reportes
   - Considerar particionamiento para tablas grandes (receipts, notifications)

2. **Performance**
   - Implementar caché para reportes (Redis)
   - Paginación en todos los endpoints de listado
   - Queries optimizadas con JPA Specifications

3. **Seguridad**
   - Validar permisos por rol en todos los endpoints
   - Sanitización de inputs
   - Rate limiting en endpoints públicos
   - Encriptación de datos sensibles

4. **Testing**
   - Tests unitarios para servicios
   - Tests de integración para controllers
   - Tests E2E para flujos críticos

---

### 🔄 **Integración Frontend-Backend:**

El frontend ya está 100% listo y espera estos endpoints. Una vez implementados:

1. **No se requieren cambios en el frontend** ✅
2. Los servicios ya están configurados con las URLs correctas
3. Manejo de errores ya implementado
4. Tipos TypeScript ya definidos

---

### 📚 **Documentación de Referencia:**

Consultar estos archivos para detalles de implementación:

- `docs/API_SPECIFICATION.md` - Especificación completa de endpoints
- `docs/BACKEND_IMPLEMENTATION_GUIDE.md` - Guía de implementación
- `docs/FRONTEND_BACKEND_INTEGRATION.md` - Guía de integración
- `services/*.ts` - Servicios del frontend (ejemplos de uso)

---

### 🎯 **Próximos Pasos Recomendados:**

1. **Priorizar Fase 1** (Crítica) 🔥
   - Sin recibos, el sistema no cumple requisitos legales
   - Sin notificaciones, la experiencia de usuario se degrada
   - Sin gestión de membresías, el botón principal no funciona

2. **Configurar Entorno de Desarrollo**
   - Asegurar que PostgreSQL tenga espacio para nuevas tablas
   - Configurar SendGrid para emails de recibos
   - Configurar almacenamiento para PDFs (S3, local, etc.)

3. **Definir Sprints**
   - Sprint 1: Recibos + Reset Password (4 días)
   - Sprint 2: Notificaciones (3 días)
   - Sprint 3: Gestión Membresías + Auto-renovación (4 días)

4. **Testing Continuo**
   - Probar cada endpoint con el frontend
   - Documentar en Postman/Swagger
   - Validar con casos de uso reales

---

## 🎓 **Conclusión**

El backend de FitZone tiene una base sólida con:
- ✅ Sistema de fidelización completo
- ✅ Pagos con Stripe funcionando
- ✅ Autenticación robusta

**Faltan 56 endpoints** divididos en:
- 🔴 26 críticos (46%)
- 🟠 16 importantes (29%)
- 🟡 14 secundarios (25%)

**Tiempo estimado de implementación:** 4 semanas (1 desarrollador)

Una vez completados, el sistema estará 100% funcional y el frontend podrá operar sin limitaciones.

---

**Elaborado por:** Equipo de Desarrollo FitZone  
**Fecha:** 7 de noviembre de 2025  
**Versión:** 1.0.0
