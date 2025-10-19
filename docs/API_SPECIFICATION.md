# API Specification - FitZone Backend

## 📋 Tabla de Contenidos
- [Información General](#información-general)
- [Autenticación](#autenticación)
- [Endpoints de Recibos](#endpoints-de-recibos)
- [Endpoints de Notificaciones](#endpoints-de-notificaciones)
- [Endpoints de Auto-Renovación](#endpoints-de-auto-renovación)
- [Endpoints de Reportes Administrativos](#endpoints-de-reportes-administrativos)
- [Modelos de Datos](#modelos-de-datos)
- [Códigos de Estado](#códigos-de-estado)
- [Ejemplos de Uso](#ejemplos-de-uso)

---

## Información General

**Base URL**: `https://desplieguefitzone.onrender.com`  
**Versión API**: `v1`  
**Formato de Datos**: JSON  
**Autenticación**: Bearer Token (JWT)

---

## Autenticación

Todos los endpoints requieren un token JWT válido en el header:

```http
Authorization: Bearer {token}
```

El token se obtiene al hacer login y debe incluirse en todas las peticiones autenticadas.

---

## Endpoints de Recibos

### 1. Crear Recibo

Crea un nuevo recibo de pago para una transacción.

**Endpoint**: `POST /api/v1/receipts`

**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body**:
```typescript
{
  "userId": number,                    // ID del usuario
  "transactionType": string,           // "MEMBERSHIP_PURCHASE" | "MEMBERSHIP_RENEWAL" | "MEMBERSHIP_UPGRADE" | "REFUND" | "ADJUSTMENT"
  "membershipType": string,            // "BASICO" | "PREMIUM" | "ELITE"
  "membershipStartDate": string,       // ISO date (opcional)
  "membershipEndDate": string,         // ISO date (opcional)
  "amount": number,                    // Monto total de la transacción
  "paymentMethod": string,             // "CREDIT_CARD" | "DEBIT_CARD" | "CASH" | "TRANSFER" | "PSE"
  "paymentInfo": {
    "method": string,                  // Método de pago
    "cardLastFour": string,            // Últimos 4 dígitos (opcional)
    "cardBrand": string,               // Marca de tarjeta (opcional)
    "transactionId": string,           // ID de transacción de pasarela
    "authorizationCode": string,       // Código de autorización (opcional)
    "reference": string                // Referencia adicional (opcional)
  },
  "billingInfo": {
    "name": string,                    // Nombre completo
    "email": string,                   // Email de contacto
    "phone": string,                   // Teléfono (opcional)
    "address": string,                 // Dirección (opcional)
    "city": string,                    // Ciudad (opcional)
    "country": string,                 // País
    "taxId": string                    // NIT o RUT (opcional)
  },
  "notes": string                      // Notas adicionales (opcional)
}
```

**Response Success (201)**:
```typescript
{
  "success": true,
  "message": "Recibo generado exitosamente",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "receiptNumber": "REC-2025-00001",
    "userId": 123,
    "transactionType": "MEMBERSHIP_PURCHASE",
    "transactionStatus": "COMPLETED",
    "transactionDate": "2025-10-01T10:30:00Z",
    "membershipType": "PREMIUM",
    "membershipStartDate": "2025-10-01",
    "membershipEndDate": "2025-11-01",
    "items": [
      {
        "description": "Membresía Premium - 1 Mes",
        "quantity": 1,
        "unitPrice": 210084.03,
        "subtotal": 210084.03,
        "tax": 39915.97,
        "discount": 0
      }
    ],
    "subtotal": 210084.03,
    "tax": 39915.97,
    "discount": 0,
    "total": 250000,
    "currency": "COP",
    "paymentInfo": { /* ... */ },
    "billingInfo": { /* ... */ },
    "notes": null,
    "terms": null,
    "createdAt": "2025-10-01T10:30:00Z",
    "updatedAt": null,
    "pdfUrl": null,
    "emailSent": false
  }
}
```

**Response Error (400)**:
```typescript
{
  "success": false,
  "message": "Datos inválidos",
  "error": "El campo userId es requerido",
  "timestamp": 1696156200000
}
```

---

### 2. Obtener Recibos de Usuario

Obtiene todos los recibos de un usuario con filtros opcionales.

**Endpoint**: `GET /api/v1/users/{userId}/receipts`

**Headers**:
```http
Authorization: Bearer {token}
```

**Query Parameters** (opcionales):
```
status: string         // PENDING | COMPLETED | FAILED | REFUNDED | CANCELLED
type: string          // MEMBERSHIP_PURCHASE | MEMBERSHIP_RENEWAL | MEMBERSHIP_UPGRADE | REFUND | ADJUSTMENT
dateFrom: string      // ISO date
dateTo: string        // ISO date
minAmount: number     // Monto mínimo
maxAmount: number     // Monto máximo
```

**Ejemplo**: `/api/v1/users/123/receipts?status=COMPLETED&dateFrom=2025-01-01`

**Response Success (200)**:
```typescript
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "receiptNumber": "REC-2025-00001",
      // ... resto de campos del recibo
    },
    // ... más recibos
  ]
}
```

---

### 3. Obtener Recibo por ID

Obtiene un recibo específico por su ID.

**Endpoint**: `GET /api/v1/receipts/{receiptId}`

**Headers**:
```http
Authorization: Bearer {token}
```

**Response Success (200)**:
```typescript
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "receiptNumber": "REC-2025-00001",
    // ... campos completos del recibo
  }
}
```

**Response Error (404)**:
```typescript
{
  "success": false,
  "message": "Recibo no encontrado",
  "error": "No existe un recibo con el ID proporcionado"
}
```

---

### 4. Obtener Resumen de Transacciones

Obtiene un resumen de todas las transacciones de un usuario.

**Endpoint**: `GET /api/v1/users/{userId}/transactions`

**Headers**:
```http
Authorization: Bearer {token}
```

**Response Success (200)**:
```typescript
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "receiptNumber": "REC-2025-00001",
      "date": "2025-10-01T10:30:00Z",
      "type": "MEMBERSHIP_PURCHASE",
      "status": "COMPLETED",
      "amount": 250000,
      "currency": "COP",
      "membershipType": "PREMIUM",
      "paymentMethod": "CREDIT_CARD"
    },
    // ... más transacciones
  ]
}
```

---

### 5. Obtener Estadísticas de Pagos

Obtiene estadísticas agregadas de los pagos de un usuario.

**Endpoint**: `GET /api/v1/users/{userId}/payment-stats`

**Headers**:
```http
Authorization: Bearer {token}
```

**Response Success (200)**:
```typescript
{
  "success": true,
  "data": {
    "totalTransactions": 15,
    "totalAmount": 3750000,
    "successfulTransactions": 14,
    "failedTransactions": 1,
    "refundedAmount": 250000,
    "averageTransactionAmount": 250000,
    "byPaymentMethod": {
      "CREDIT_CARD": 2500000,
      "DEBIT_CARD": 750000,
      "PSE": 500000
    },
    "byMembershipType": {
      "BASICO": 1000000,
      "PREMIUM": 1500000,
      "ELITE": 1250000
    }
  }
}
```

---

### 6. Marcar Recibo como Enviado

Marca un recibo como enviado por email.

**Endpoint**: `PATCH /api/v1/receipts/{receiptId}/mark-sent`

**Headers**:
```http
Authorization: Bearer {token}
```

**Response Success (200)**:
```typescript
{
  "success": true,
  "message": "Recibo marcado como enviado"
}
```

---

### 7. Enviar Recibo por Email

Envía un recibo por correo electrónico.

**Endpoint**: `POST /api/v1/receipts/{receiptId}/send-email`

**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body**:
```typescript
{
  "email": "usuario@example.com"
}
```

**Response Success (200)**:
```typescript
{
  "success": true,
  "message": "Recibo enviado por email exitosamente"
}
```

---

### 8. Buscar Recibos

Busca recibos por número de recibo, tipo de membresía u otros criterios.

**Endpoint**: `GET /api/v1/receipts/search`

**Headers**:
```http
Authorization: Bearer {token}
```

**Query Parameters**:
```
q: string  // Término de búsqueda (requerido)
```

**Ejemplo**: `/api/v1/receipts/search?q=REC-2025`

**Response Success (200)**:
```typescript
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "receiptNumber": "REC-2025-00001",
      // ... resto de campos
    }
  ]
}
```

---

## Endpoints de Renovación Automática

### 1. Verificar Membresías por Vencer

Verifica si una membresía está próxima a vencer.

**Endpoint**: `GET /api/v1/users/{userId}/membership/check-expiration`

**Headers**:
```http
Authorization: Bearer {token}
```

**Query Parameters**:
```
days: number  // Días antes de la expiración (default: 7)
```

**Response Success (200)**:
```typescript
{
  "success": true,
  "data": {
    "needsRenewal": true,
    "daysRemaining": 5,
    "membershipType": "PREMIUM"
  }
}
```

---

### 2. Obtener Preferencias de Auto-Renovación

Obtiene la configuración de renovación automática del usuario.

**Endpoint**: `GET /api/v1/users/{userId}/auto-renewal-preferences`

**Headers**:
```http
Authorization: Bearer {token}
```

**Response Success (200)**:
```typescript
{
  "success": true,
  "data": {
    "autoRenewalEnabled": true,
    "notificationDays": 7,
    "paymentMethod": "CREDIT_CARD"
  }
}
```

---

### 3. Actualizar Preferencias de Auto-Renovación

Actualiza la configuración de renovación automática.

**Endpoint**: `PUT /api/v1/users/{userId}/auto-renewal-preferences`

**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body**:
```typescript
{
  "autoRenewalEnabled": boolean,
  "notificationDays": number,    // 3, 5, 7, 10, 14
  "paymentMethod": string        // "CREDIT_CARD" | "DEBIT_CARD" | "PSE" | etc.
}
```

**Response Success (200)**:
```typescript
{
  "success": true,
  "message": "Preferencias actualizadas exitosamente"
}
```

---

### 4. Procesar Renovación Automática

Procesa la renovación automática de una membresía.

**Endpoint**: `POST /api/v1/users/{userId}/membership/auto-renew`

**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body**:
```typescript
{
  "paymentMethod": string  // opcional, usa el predeterminado si no se especifica
}
```

**Response Success (200)**:
```typescript
{
  "success": true,
  "message": "Membresía renovada automáticamente",
  "data": {
    // MembershipInfo con la membresía renovada
    "status": "ACTIVE",
    "membershipType": "PREMIUM",
    "startDate": "2025-10-01",
    "endDate": "2025-11-01",
    // ... más campos
  }
}
```

---

### 5. Obtener Historial de Renovaciones

Obtiene el historial de renovaciones de un usuario.

**Endpoint**: `GET /api/v1/users/{userId}/renewal-history`

**Headers**:
```http
Authorization: Bearer {token}
```

**Response Success (200)**:
```typescript
{
  "success": true,
  "data": [
    {
      "id": "renewal-uuid-1",
      "date": "2025-09-01T10:00:00Z",
      "membershipType": "PREMIUM",
      "amount": 250000,
      "automatic": true,
      "status": "COMPLETED"
    },
    // ... más renovaciones
  ]
}
```

---

### 6. Programar Recordatorio de Renovación

Programa un recordatorio personalizado para renovación.

**Endpoint**: `POST /api/v1/users/{userId}/schedule-renewal-reminder`

**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body**:
```typescript
{
  "reminderDate": string  // ISO date
}
```

**Response Success (200)**:
```typescript
{
  "success": true,
  "message": "Recordatorio programado exitosamente"
}
```

---

## Endpoints de Notificaciones

### 1. Obtener Notificaciones de Usuario

Obtiene todas las notificaciones de un usuario.

**Endpoint**: `GET /api/v1/users/{userId}/notifications`

**Headers**:
```http
Authorization: Bearer {token}
```

**Query Parameters** (opcionales):
```
unread: boolean  // true para obtener solo no leídas
```

**Response Success (200)**:
```typescript
{
  "success": true,
  "data": [
    {
      "id": "notification-uuid-1",
      "userId": 123,
      "type": "EXPIRATION_WARNING",
      "priority": "HIGH",
      "title": "Tu membresía está por vencer",
      "message": "Tu membresía Premium vence en 7 días. Renuévala ahora y continúa disfrutando de todos los beneficios.",
      "actionUrl": "/membresias",
      "actionLabel": "Renovar Ahora",
      "isRead": false,
      "createdAt": "2025-09-24T10:00:00Z",
      "readAt": null,
      "expiresAt": "2025-10-08T10:00:00Z",
      "metadata": {
        "membershipType": "PREMIUM",
        "expirationDate": "2025-10-01"
      }
    },
    // ... más notificaciones
  ]
}
```

---

### 2. Obtener Contador de No Leídas

Obtiene el número de notificaciones no leídas de un usuario.

**Endpoint**: `GET /api/v1/users/{userId}/notifications/unread-count`

**Headers**:
```http
Authorization: Bearer {token}
```

**Response Success (200)**:
```typescript
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

---

### 3. Marcar Notificación como Leída

Marca una notificación específica como leída.

**Endpoint**: `PATCH /api/v1/notifications/{notificationId}/read`

**Headers**:
```http
Authorization: Bearer {token}
```

**Response Success (200)**:
```typescript
{
  "success": true,
  "message": "Notificación marcada como leída"
}
```

---

### 4. Marcar Todas como Leídas

Marca todas las notificaciones de un usuario como leídas.

**Endpoint**: `PATCH /api/v1/users/{userId}/notifications/read-all`

**Headers**:
```http
Authorization: Bearer {token}
```

**Response Success (200)**:
```typescript
{
  "success": true,
  "message": "Todas las notificaciones marcadas como leídas"
}
```

---

### 5. Crear Notificación

Crea una nueva notificación para un usuario.

**Endpoint**: `POST /api/v1/notifications`

**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body**:
```typescript
{
  "userId": number,
  "type": string,                    // "EXPIRATION_WARNING" | "RENEWAL_REMINDER" | "PAYMENT_SUCCESS" | etc.
  "priority": string,                // "LOW" | "MEDIUM" | "HIGH" | "URGENT" (opcional, default: "MEDIUM")
  "title": string,
  "message": string,
  "actionUrl": string,               // URL para acción (opcional)
  "actionLabel": string,             // Etiqueta del botón (opcional)
  "expiresAt": string,               // ISO date (opcional)
  "metadata": object                 // Datos adicionales (opcional)
}
```

**Response Success (201)**:
```typescript
{
  "success": true,
  "message": "Notificación creada exitosamente",
  "data": {
    "id": "notification-uuid-1",
    "userId": 123,
    // ... campos completos de la notificación
  }
}
```

---

### 6. Actualizar Notificación

Actualiza una notificación existente.

**Endpoint**: `PATCH /api/v1/notifications/{notificationId}`

**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body**:
```typescript
{
  "isRead": boolean,                 // opcional
  "readAt": string                   // ISO date, opcional
}
```

**Response Success (200)**:
```typescript
{
  "success": true,
  "message": "Notificación actualizada exitosamente"
}
```

---

### 7. Eliminar Notificación

Elimina una notificación específica.

**Endpoint**: `DELETE /api/v1/notifications/{notificationId}`

**Headers**:
```http
Authorization: Bearer {token}
```

**Response Success (200)**:
```typescript
{
  "success": true,
  "message": "Notificación eliminada exitosamente"
}
```

---

### 8. Eliminar Todas las Notificaciones

Elimina todas las notificaciones de un usuario.

**Endpoint**: `DELETE /api/v1/users/{userId}/notifications`

**Headers**:
```http
Authorization: Bearer {token}
```

**Response Success (200)**:
```typescript
{
  "success": true,
  "message": "Todas las notificaciones eliminadas"
}
```

---

### 9. Generar Notificaciones de Expiración

Genera automáticamente notificaciones para membresías próximas a vencer.

**Endpoint**: `POST /api/v1/users/{userId}/notifications/generate-expiration`

**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body**:
```typescript
{
  "daysBeforeExpiration": number     // Días antes de vencimiento (default: 7)
}
```

**Response Success (200)**:
```typescript
{
  "success": true,
  "message": "Notificaciones de expiración generadas",
  "data": {
    "count": 3                       // Número de notificaciones creadas
  }
}
```

---

### 10. Obtener Preferencias de Notificación

Obtiene las preferencias de notificación de un usuario.

**Endpoint**: `GET /api/v1/users/{userId}/notification-preferences`

**Headers**:
```http
Authorization: Bearer {token}
```

**Response Success (200)**:
```typescript
{
  "success": true,
  "data": {
    "emailEnabled": true,
    "pushEnabled": true,
    "smsEnabled": false,
    "expirationReminder": true,
    "renewalReminder": true,
    "promotions": true
  }
}
```

---

### 11. Actualizar Preferencias de Notificación

Actualiza las preferencias de notificación de un usuario.

**Endpoint**: `PUT /api/v1/users/{userId}/notification-preferences`

**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body**:
```typescript
{
  "emailEnabled": boolean,
  "pushEnabled": boolean,
  "smsEnabled": boolean,
  "expirationReminder": boolean,
  "renewalReminder": boolean,
  "promotions": boolean
}
```

**Response Success (200)**:
```typescript
{
  "success": true,
  "message": "Preferencias actualizadas exitosamente"
}
```

---

## Modelos de Datos

### Receipt (Recibo)
```typescript
interface Receipt {
  id: string;
  receiptNumber: string;
  userId: number;
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  transactionDate: string;
  membershipType: MembershipTypeName;
  membershipStartDate?: string;
  membershipEndDate?: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  paymentInfo: PaymentInfo;
  billingInfo: BillingInfo;
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt?: string;
  pdfUrl?: string;
  emailSent?: boolean;
}
```

### TransactionType
```typescript
enum TransactionType {
  MEMBERSHIP_PURCHASE = "MEMBERSHIP_PURCHASE",
  MEMBERSHIP_RENEWAL = "MEMBERSHIP_RENEWAL",
  MEMBERSHIP_UPGRADE = "MEMBERSHIP_UPGRADE",
  REFUND = "REFUND",
  ADJUSTMENT = "ADJUSTMENT"
}
```

### TransactionStatus
```typescript
enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  CANCELLED = "CANCELLED"
}
```

### NotificationType
```typescript
enum NotificationType {
  EXPIRATION_WARNING = "EXPIRATION_WARNING",
  RENEWAL_REMINDER = "RENEWAL_REMINDER",
  PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  MEMBERSHIP_SUSPENDED = "MEMBERSHIP_SUSPENDED",
  MEMBERSHIP_CANCELLED = "MEMBERSHIP_CANCELLED",
  MEMBERSHIP_UPGRADED = "MEMBERSHIP_UPGRADED",
  PROMOTION = "PROMOTION",
  SYSTEM_MESSAGE = "SYSTEM_MESSAGE"
}
```

### NotificationPriority
```typescript
enum NotificationPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT"
}
```

---

## Códigos de Estado

| Código | Descripción |
|--------|-------------|
| 200    | OK - Petición exitosa |
| 201    | Created - Recurso creado exitosamente |
| 204    | No Content - Operación exitosa sin contenido |
| 400    | Bad Request - Datos inválidos |
| 401    | Unauthorized - No autenticado |
| 403    | Forbidden - Sin permisos |
| 404    | Not Found - Recurso no encontrado |
| 409    | Conflict - Conflicto con el estado actual |
| 422    | Unprocessable Entity - Error de validación |
| 500    | Internal Server Error - Error del servidor |

---

## Ejemplos de Uso

### Ejemplo 1: Crear un Recibo con cURL

```bash
curl -X POST https://desplieguefitzone.onrender.com/api/v1/receipts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "userId": 123,
    "transactionType": "MEMBERSHIP_PURCHASE",
    "membershipType": "PREMIUM",
    "amount": 250000,
    "paymentMethod": "CREDIT_CARD",
    "paymentInfo": {
      "method": "CREDIT_CARD",
      "cardLastFour": "4242",
      "cardBrand": "Visa",
      "transactionId": "txn_1234567890"
    },
    "billingInfo": {
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "+57 300 1234567",
      "country": "Colombia"
    }
  }'
```

### Ejemplo 2: Obtener Notificaciones No Leídas

```bash
curl -X GET "https://desplieguefitzone.onrender.com/api/v1/users/123/notifications?unread=true" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Ejemplo 3: Marcar Notificación como Leída

```bash
curl -X PATCH "https://desplieguefitzone.onrender.com/api/v1/notifications/notification-uuid-1/read" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Endpoints de Reportes Administrativos

### 1. Obtener KPIs Generales

Obtiene los indicadores clave de rendimiento (KPIs) del negocio.

**Endpoint**: `GET /api/v1/admin/reports/kpis`

**Headers**:
```http
Authorization: Bearer {token}
```

**Query Parameters**:
```typescript
period?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'; // Período de comparación
```

**Response 200 OK**:
```typescript
{
  totalRevenue: number;           // Ingresos totales en el período
  totalMembers: number;           // Total de miembros activos
  avgTransactionValue: number;    // Ticket promedio
  renewalRate: number;            // Tasa de renovación (%)
  trends: {
    revenueChange: number;        // Cambio % vs período anterior
    membersChange: number;        // Cambio % vs período anterior
    avgTransactionChange: number; // Cambio % vs período anterior
    renewalRateChange: number;    // Cambio % vs período anterior
  }
}
```

**Ejemplo cURL**:
```bash
curl -X GET "https://desplieguefitzone.onrender.com/api/v1/admin/reports/kpis?period=monthly" \
  -H "Authorization: Bearer {token}"
```

---

### 2. Obtener Ingresos Mensuales

Obtiene los ingresos desglosados por mes para gráficos de tendencia.

**Endpoint**: `GET /api/v1/admin/reports/revenue`

**Headers**:
```http
Authorization: Bearer {token}
```

**Query Parameters**:
```typescript
period?: 'monthly' | 'quarterly' | 'yearly'; // Tipo de agrupación
months?: number;                              // Número de períodos (default: 12)
year?: number;                                // Año específico (default: actual)
```

**Response 200 OK**:
```typescript
{
  data: Array<{
    period: string;        // "Ene", "Feb", "Mar", etc. o "2025-01"
    revenue: number;       // Ingresos totales del período
    transactions: number;  // Número de transacciones
    avgTicket: number;     // Ticket promedio
  }>;
  total: {
    revenue: number;
    transactions: number;
  }
}
```

**Ejemplo cURL**:
```bash
curl -X GET "https://desplieguefitzone.onrender.com/api/v1/admin/reports/revenue?period=monthly&months=10" \
  -H "Authorization: Bearer {token}"
```

---

### 3. Obtener Estadísticas de Membresías

Obtiene la distribución de miembros por tipo de membresía.

**Endpoint**: `GET /api/v1/admin/reports/memberships`

**Headers**:
```http
Authorization: Bearer {token}
```

**Response 200 OK**:
```typescript
{
  data: Array<{
    type: 'BASICO' | 'PREMIUM' | 'ELITE';
    count: number;       // Número de miembros
    percentage: number;  // Porcentaje del total
    revenue: number;     // Ingresos generados por este tipo
  }>;
  total: {
    members: number;
    revenue: number;
  }
}
```

**Ejemplo cURL**:
```bash
curl -X GET "https://desplieguefitzone.onrender.com/api/v1/admin/reports/memberships" \
  -H "Authorization: Bearer {token}"
```

---

### 4. Obtener Estadísticas de Métodos de Pago

Obtiene la distribución de ingresos por método de pago.

**Endpoint**: `GET /api/v1/admin/reports/payment-methods`

**Headers**:
```http
Authorization: Bearer {token}
```

**Query Parameters**:
```typescript
period?: 'monthly' | 'quarterly' | 'yearly'; // Período de análisis
startDate?: string;                           // Fecha inicio (ISO 8601)
endDate?: string;                             // Fecha fin (ISO 8601)
```

**Response 200 OK**:
```typescript
{
  data: Array<{
    method: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PSE' | 'TRANSFER' | 'CASH';
    amount: number;      // Monto total
    count: number;       // Número de transacciones
    percentage: number;  // Porcentaje del total
  }>;
  total: {
    amount: number;
    count: number;
  }
}
```

**Ejemplo cURL**:
```bash
curl -X GET "https://desplieguefitzone.onrender.com/api/v1/admin/reports/payment-methods?period=monthly" \
  -H "Authorization: Bearer {token}"
```

---

### 5. Obtener Estadísticas de Renovación

Obtiene la tasa de renovación por período para análisis de retención.

**Endpoint**: `GET /api/v1/admin/reports/renewals`

**Headers**:
```http
Authorization: Bearer {token}
```

**Query Parameters**:
```typescript
groupBy?: 'monthly' | 'quarterly' | 'yearly'; // Agrupación temporal
periods?: number;                              // Número de períodos (default: 4)
```

**Response 200 OK**:
```typescript
{
  data: Array<{
    period: string;       // "Ene-Mar", "Abr-Jun", etc.
    renewals: number;     // Renovaciones exitosas
    total: number;        // Total de membresías que vencían
    rate: number;         // Tasa de renovación (%)
    revenue: number;      // Ingresos por renovaciones
  }>;
  overall: {
    renewalRate: number;  // Tasa promedio general
    totalRenewals: number;
    totalRevenue: number;
  }
}
```

**Ejemplo cURL**:
```bash
curl -X GET "https://desplieguefitzone.onrender.com/api/v1/admin/reports/renewals?groupBy=quarterly&periods=4" \
  -H "Authorization: Bearer {token}"
```

---

### 6. Obtener Reporte Completo Exportable

Obtiene datos completos para exportación a CSV/Excel/PDF.

**Endpoint**: `GET /api/v1/admin/reports/export`

**Headers**:
```http
Authorization: Bearer {token}
```

**Query Parameters**:
```typescript
reportType: 'revenue' | 'memberships' | 'transactions' | 'renewals' | 'complete';
startDate: string;   // Fecha inicio (ISO 8601)
endDate: string;     // Fecha fin (ISO 8601)
format?: 'json' | 'csv'; // Formato de respuesta (default: json)
```

**Response 200 OK** (formato JSON):
```typescript
{
  reportType: string;
  period: {
    start: string;
    end: string;
  };
  generated: string;  // Timestamp de generación
  data: {
    summary: {
      totalRevenue: number;
      totalTransactions: number;
      totalMembers: number;
      avgTicket: number;
    };
    details: Array<{
      date: string;
      type: string;
      description: string;
      amount: number;
      // ... campos adicionales según reportType
    }>;
  }
}
```

**Response 200 OK** (formato CSV):
```csv
Date,Type,Description,Amount,Status
2025-01-15,MEMBERSHIP_PAYMENT,Membresía Premium,250000,COMPLETED
2025-01-16,RENEWAL,Renovación Básica,150000,COMPLETED
...
```

**Ejemplo cURL**:
```bash
curl -X GET "https://desplieguefitzone.onrender.com/api/v1/admin/reports/export?reportType=complete&startDate=2025-01-01&endDate=2025-12-31&format=json" \
  -H "Authorization: Bearer {token}"
```

---

### 7. Obtener Dashboard Ejecutivo

Obtiene un resumen ejecutivo con todos los datos necesarios para el dashboard admin.

**Endpoint**: `GET /api/v1/admin/reports/dashboard`

**Headers**:
```http
Authorization: Bearer {token}
```

**Query Parameters**:
```typescript
period?: 'daily' | 'weekly' | 'monthly'; // Período de análisis (default: monthly)
```

**Response 200 OK**:
```typescript
{
  kpis: {
    totalRevenue: number;
    totalMembers: number;
    avgTransactionValue: number;
    renewalRate: number;
    trends: {
      revenueChange: number;
      membersChange: number;
      avgTransactionChange: number;
      renewalRateChange: number;
    }
  };
  charts: {
    monthlyRevenue: Array<{
      month: string;
      revenue: number;
      transactions: number;
    }>;
    membershipDistribution: Array<{
      type: string;
      count: number;
      percentage: number;
    }>;
    paymentMethods: Array<{
      method: string;
      amount: number;
      count: number;
    }>;
    renewalTrend: Array<{
      period: string;
      renewals: number;
      total: number;
      rate: number;
    }>;
  };
  alerts: Array<{
    type: 'warning' | 'info' | 'success';
    message: string;
    data?: any;
  }>;
}
```

**Ejemplo cURL**:
```bash
curl -X GET "https://desplieguefitzone.onrender.com/api/v1/admin/reports/dashboard?period=monthly" \
  -H "Authorization: Bearer {token}"
```

---

## Notas de Implementación

### Seguridad
- Todos los endpoints deben validar el token JWT
- Verificar que el usuario solo puede acceder a sus propios recursos
- **Endpoints de admin (`/api/v1/admin/*`) requieren rol de administrador**
- Sanitizar todas las entradas para prevenir inyecciones SQL/NoSQL
- Implementar rate limiting para prevenir abuso
- Los reportes administrativos solo deben ser accesibles por usuarios con rol ADMIN

### Base de Datos
- Usar UUID v4 para IDs de recibos y notificaciones
- Indexar campos frecuentemente consultados (userId, transactionStatus, createdAt)
- Implementar soft deletes para notificaciones
- Mantener logs de auditoría para recibos
- **Crear índices compuestos para reportes** (ej: createdAt + transactionStatus + userId)
- **Considerar tablas de agregación para estadísticas** si el volumen de datos crece

### Performance
- Implementar paginación para endpoints que devuelven listas
- Usar caché para estadísticas que no cambian frecuentemente
- Optimizar queries con JOINs para evitar N+1 queries
- **Los endpoints de reportes deben usar caché agresivo** (15-30 minutos)
- **Implementar queries agregadas optimizadas** en lugar de cálculos en aplicación
- **Considerar vistas materializadas** para reportes complejos

### Validaciones
- Validar tipos de datos según los enums definidos
- Validar formatos de email, teléfono, y fechas
- Validar montos positivos
- Validar rangos de fechas lógicos
- **En endpoints de reportes, validar que endDate >= startDate**
- **Limitar el rango de fechas máximo** (ej: no más de 2 años)

### Roles y Permisos
```typescript
enum UserRole {
  USER = 'USER',           // Usuario regular
  ADMIN = 'ADMIN',         // Administrador
  SUPER_ADMIN = 'SUPER_ADMIN' // Super administrador
}

// Matriz de permisos
- /api/v1/receipts/* → USER (solo sus propios recibos)
- /api/v1/notifications/* → USER (solo sus propias notificaciones)
- /api/v1/users/{userId}/membership/* → USER (solo su propia membresía)
- /api/v1/admin/reports/* → ADMIN o SUPER_ADMIN
```

---

## Changelog

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0.0   | 2025-10-01 | Versión inicial con endpoints de recibos y notificaciones |
| 1.1.0   | 2025-10-01 | Agregados endpoints de auto-renovación de membresías |
| 1.2.0   | 2025-10-01 | Agregados 7 endpoints de reportes administrativos con KPIs, gráficos y exportación |

---

## Resumen de Implementación

### Total de Endpoints: 34

#### Por Categoría:
- **Recibos**: 8 endpoints
- **Notificaciones**: 11 endpoints  
- **Auto-Renovación**: 6 endpoints
- **Reportes Administrativos**: 7 endpoints
- **Autenticación**: 2 endpoints (login, refresh - ya implementados)

#### Por Prioridad de Implementación:

**🔴 Prioridad ALTA (Core Funcional)**
1. POST `/api/v1/receipts` - Crear recibos
2. GET `/api/v1/users/{userId}/receipts` - Listar recibos de usuario
3. GET `/api/v1/notifications/{userId}` - Listar notificaciones
4. PATCH `/api/v1/notifications/{notificationId}/read` - Marcar como leída
5. GET `/api/v1/users/{userId}/membership/auto-renewal-preferences` - Obtener preferencias
6. PUT `/api/v1/users/{userId}/membership/auto-renewal-preferences` - Guardar preferencias

**🟡 Prioridad MEDIA (Mejoras de UX)**
7. GET `/api/v1/receipts/{receiptId}` - Obtener recibo específico
8. GET `/api/v1/users/{userId}/transaction-summaries` - Resúmenes de transacciones
9. POST `/api/v1/notifications` - Crear notificación
10. GET `/api/v1/users/{userId}/membership/check-expiration` - Verificar vencimiento
11. POST `/api/v1/users/{userId}/membership/auto-renew` - Procesar auto-renovación

**🟢 Prioridad BAJA (Analytics y Admin)**
12. GET `/api/v1/admin/reports/kpis` - KPIs generales
13. GET `/api/v1/admin/reports/revenue` - Ingresos mensuales
14. GET `/api/v1/admin/reports/memberships` - Estadísticas de membresías
15. GET `/api/v1/admin/reports/payment-methods` - Métodos de pago
16. GET `/api/v1/admin/reports/renewals` - Tasas de renovación
17. GET `/api/v1/admin/reports/dashboard` - Dashboard ejecutivo completo

### Tecnologías Recomendadas

**Backend Framework:**
- Node.js + Express + TypeScript
- Java + Spring Boot
- Python + FastAPI
- .NET Core

**Base de Datos:**
- PostgreSQL (recomendado para reportes complejos)
- MySQL
- MongoDB (si prefieren NoSQL)

**Caché:**
- Redis (altamente recomendado para reportes)

**Validación:**
- Joi / Zod (Node.js)
- Hibernate Validator (Java)
- Pydantic (Python)

### Modelos de Base de Datos Sugeridos

```sql
-- Tabla de Recibos
CREATE TABLE receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  receipt_number VARCHAR(50) UNIQUE NOT NULL,
  transaction_type VARCHAR(50) NOT NULL,
  transaction_status VARCHAR(50) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  tax DECIMAL(15,2) DEFAULT 0,
  total DECIMAL(15,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  membership_type VARCHAR(50),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  email_sent BOOLEAN DEFAULT false,
  INDEX idx_user_created (user_id, created_at DESC),
  INDEX idx_status_date (transaction_status, created_at DESC),
  INDEX idx_receipt_number (receipt_number)
);

-- Tabla de Notificaciones
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  priority VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP,
  metadata JSONB,
  deleted_at TIMESTAMP, -- soft delete
  INDEX idx_user_unread (user_id, read, created_at DESC),
  INDEX idx_user_type (user_id, type)
);

-- Tabla de Preferencias de Auto-Renovación
CREATE TABLE auto_renewal_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id),
  enabled BOOLEAN DEFAULT false,
  notification_days INTEGER DEFAULT 7,
  payment_method VARCHAR(50),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Historial de Renovaciones
CREATE TABLE renewal_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  membership_id UUID REFERENCES memberships(id),
  previous_end_date TIMESTAMP NOT NULL,
  new_end_date TIMESTAMP NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_date (user_id, created_at DESC)
);

-- Vista Materializada para Reportes (opcional, mejora performance)
CREATE MATERIALIZED VIEW monthly_revenue_stats AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as transaction_count,
  SUM(total) as total_revenue,
  AVG(total) as avg_ticket
FROM receipts
WHERE transaction_status = 'COMPLETED'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Refrescar cada hora
CREATE INDEX idx_monthly_revenue_month ON monthly_revenue_stats(month DESC);
```

### Testing Checklist

Para cada endpoint, verificar:

- [ ] Autenticación JWT funciona correctamente
- [ ] Validación de permisos (usuario solo accede a sus recursos)
- [ ] Validación de entrada (tipos, formatos, rangos)
- [ ] Manejo de errores con códigos HTTP correctos
- [ ] Respuestas con estructura JSON consistente
- [ ] Paginación funciona correctamente (donde aplique)
- [ ] Filtros y ordenamiento funcionan
- [ ] Performance bajo carga (especialmente reportes)
- [ ] Logs de auditoría se registran
- [ ] Caché funciona correctamente (reportes)

### Integración Frontend

**Servicios Frontend ya implementados:**
- ✅ `receiptService.ts` - Listo para consumir endpoints de recibos
- ✅ `membershipNotificationService.ts` - Listo para notificaciones
- ✅ `membershipManagementService.ts` - Listo para auto-renovación
- ✅ `exportService.ts` - Exportación client-side (no requiere backend)
- ✅ `pdfGeneratorService.ts` - PDF client-side (no requiere backend)

**Componentes UI ya implementados:**
- ✅ `auto-renewal-settings.tsx` - Configuración de auto-renovación
- ✅ `export-dialog.tsx` - Diálogo de exportación
- ✅ `app/dashboard/admin/reportes/page.tsx` - Dashboard de reportes

**Una vez implementados los endpoints, el frontend funcionará automáticamente.**

---

**Documentación generada por FitZone Frontend Team**  
**Última actualización**: 1 de octubre de 2025
