# Guía de Implementación Backend - FitZone

## 🎯 Resumen Ejecutivo

Este documento proporciona una guía completa para el equipo de backend sobre cómo implementar todos los endpoints necesarios para que el frontend de FitZone funcione completamente.

**Estado actual**: El frontend está 100% implementado y listo. Todos los servicios, componentes y páginas están conectados para consumir la API REST.

**Acción requerida**: Implementar 34 endpoints documentados en `API_SPECIFICATION.md`.

---

## 📊 Dashboard de Progreso

### Endpoints por Implementar: 34 Total

| Categoría | Endpoints | Prioridad | Estado |
|-----------|-----------|-----------|--------|
| 🧾 Recibos | 8 | Alta | ⏳ Pendiente |
| 🔔 Notificaciones | 11 | Alta | ⏳ Pendiente |
| 🔄 Auto-Renovación | 6 | Media | ⏳ Pendiente |
| 📊 Reportes Admin | 7 | Baja | ⏳ Pendiente |
| 🔐 Autenticación | 2 | ✅ | Completado |

---

## 🚀 Plan de Implementación por Sprints

### Sprint 1: Core Funcional (Prioridad ALTA) - 2 semanas

**Objetivo**: Habilitar funcionalidades básicas de recibos y notificaciones.

#### Endpoints a Implementar:

1. **POST /api/v1/receipts** - Crear recibos de pago
   - Frontend: `receiptService.generateReceipt()`
   - Componente: Checkout page, payment confirmation
   - Impacto: ⭐⭐⭐⭐⭐ (crítico para pagos)

2. **GET /api/v1/users/{userId}/receipts** - Listar recibos de usuario
   - Frontend: `receiptService.getUserReceipts()`
   - Componente: Historial de pagos
   - Impacto: ⭐⭐⭐⭐⭐ (crítico para historial)

3. **GET /api/v1/receipts/{receiptId}** - Obtener recibo específico
   - Frontend: `receiptService.getReceiptById()`
   - Componente: Vista detalle de recibo
   - Impacto: ⭐⭐⭐⭐ (importante para detalles)

4. **GET /api/v1/notifications/{userId}** - Listar notificaciones
   - Frontend: `membershipNotificationService.getNotifications()`
   - Componente: Centro de notificaciones
   - Impacto: ⭐⭐⭐⭐⭐ (crítico para comunicación)

5. **PATCH /api/v1/notifications/{notificationId}/read** - Marcar como leída
   - Frontend: `membershipNotificationService.markAsRead()`
   - Componente: Lista de notificaciones
   - Impacto: ⭐⭐⭐⭐ (importante para UX)

6. **POST /api/v1/notifications** - Crear notificación
   - Frontend: `membershipNotificationService.createNotification()`
   - Componente: Sistema de alertas
   - Impacto: ⭐⭐⭐⭐ (importante para comunicación)

#### Criterios de Aceptación:
- [ ] Usuarios pueden generar recibos al pagar
- [ ] Usuarios pueden ver historial de pagos
- [ ] Usuarios reciben notificaciones de vencimiento
- [ ] Usuarios pueden marcar notificaciones como leídas
- [ ] Todas las respuestas siguen el esquema JSON documentado
- [ ] Autenticación JWT funciona en todos los endpoints
- [ ] Tests unitarios con cobertura > 80%

---

### Sprint 2: Auto-Renovación (Prioridad MEDIA) - 1.5 semanas

**Objetivo**: Habilitar sistema de renovación automática de membresías.

#### Endpoints a Implementar:

7. **GET /api/v1/users/{userId}/membership/auto-renewal-preferences**
   - Frontend: `membershipManagementService.getAutoRenewalPreferences()`
   - Componente: `AutoRenewalSettings.tsx`
   - Impacto: ⭐⭐⭐⭐ (importante para retención)

8. **PUT /api/v1/users/{userId}/membership/auto-renewal-preferences**
   - Frontend: `membershipManagementService.updateAutoRenewalPreferences()`
   - Componente: `AutoRenewalSettings.tsx`
   - Impacto: ⭐⭐⭐⭐ (importante para retención)

9. **GET /api/v1/users/{userId}/membership/check-expiration**
   - Frontend: `membershipManagementService.checkExpiringMemberships()`
   - Componente: Dashboard alerts
   - Impacto: ⭐⭐⭐⭐ (importante para prevención)

10. **POST /api/v1/users/{userId}/membership/generate-renewal-notifications**
    - Frontend: `membershipManagementService.generateRenewalNotifications()`
    - Componente: Sistema automático (cron job)
    - Impacto: ⭐⭐⭐⭐ (importante para comunicación)

11. **POST /api/v1/users/{userId}/membership/auto-renew**
    - Frontend: `membershipManagementService.processAutoRenewal()`
    - Componente: Sistema automático (cron job)
    - Impacto: ⭐⭐⭐⭐⭐ (crítico para renovación)

12. **GET /api/v1/users/{userId}/membership/renewal-history**
    - Frontend: `membershipManagementService.getRenewalHistory()`
    - Componente: Historial de renovaciones
    - Impacto: ⭐⭐⭐ (bueno tener)

#### Criterios de Aceptación:
- [ ] Usuarios pueden configurar preferencias de auto-renovación
- [ ] Sistema detecta membresías próximas a vencer
- [ ] Genera notificaciones automáticas N días antes
- [ ] Procesa renovaciones automáticas si está habilitado
- [ ] Usuarios ven historial de renovaciones
- [ ] Integración con pasarela de pagos funciona
- [ ] Tests de integración de flujo completo

#### Tareas Backend Adicionales:
- [ ] Implementar cron job para verificar expiraciones diarias
- [ ] Implementar cron job para procesar auto-renovaciones
- [ ] Configurar webhooks de pasarela de pagos
- [ ] Implementar sistema de retry para pagos fallidos

---

### Sprint 3: Reportes Administrativos (Prioridad BAJA) - 1 semana

**Objetivo**: Habilitar dashboard administrativo con analytics.

#### Endpoints a Implementar:

13. **GET /api/v1/admin/reports/kpis** - KPIs generales
    - Frontend: Admin reports page
    - Componente: `app/dashboard/admin/reportes/page.tsx`
    - Impacto: ⭐⭐⭐ (importante para administradores)

14. **GET /api/v1/admin/reports/revenue** - Ingresos mensuales
    - Frontend: Admin reports page
    - Componente: LineChart de recharts
    - Impacto: ⭐⭐⭐ (importante para análisis)

15. **GET /api/v1/admin/reports/memberships** - Distribución membresías
    - Frontend: Admin reports page
    - Componente: PieChart de recharts
    - Impacto: ⭐⭐⭐ (importante para estrategia)

16. **GET /api/v1/admin/reports/payment-methods** - Métodos de pago
    - Frontend: Admin reports page
    - Componente: BarChart de recharts
    - Impacto: ⭐⭐ (bueno tener)

17. **GET /api/v1/admin/reports/renewals** - Tasas de renovación
    - Frontend: Admin reports page
    - Componente: LineChart de recharts
    - Impacto: ⭐⭐⭐ (importante para retención)

18. **GET /api/v1/admin/reports/export** - Exportar reportes
    - Frontend: Admin reports page
    - Componente: Export button
    - Impacto: ⭐⭐ (bueno tener)

19. **GET /api/v1/admin/reports/dashboard** - Dashboard completo
    - Frontend: Admin reports page
    - Componente: Vista completa de reportes
    - Impacto: ⭐⭐⭐ (importante para admins)

#### Criterios de Aceptación:
- [ ] Administradores ven KPIs en tiempo real
- [ ] Gráficos muestran datos correctos
- [ ] Performance adecuado (< 2 segundos)
- [ ] Caché implementado correctamente
- [ ] Exportación a CSV/JSON funciona
- [ ] Solo usuarios con rol ADMIN pueden acceder
- [ ] Tests de queries de agregación

#### Optimizaciones Requeridas:
- [ ] Implementar Redis para caché de reportes (15-30 min TTL)
- [ ] Crear índices en tablas para queries de agregación
- [ ] Considerar vistas materializadas para reportes complejos
- [ ] Implementar paginación en exportación

---

## 🗄️ Modelos de Base de Datos

### Tabla: receipts

```sql
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
  membership_duration INTEGER,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  email_sent BOOLEAN DEFAULT false
);

-- Índices para performance
CREATE INDEX idx_receipts_user_created ON receipts(user_id, created_at DESC);
CREATE INDEX idx_receipts_status_date ON receipts(transaction_status, created_at DESC);
CREATE INDEX idx_receipts_number ON receipts(receipt_number);
CREATE INDEX idx_receipts_created_date ON receipts(created_at DESC);
```

### Tabla: notifications

```sql
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
  deleted_at TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, read, created_at DESC)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_notifications_user_type ON notifications(user_id, type)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

### Tabla: auto_renewal_preferences

```sql
CREATE TABLE auto_renewal_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id),
  enabled BOOLEAN DEFAULT false,
  notification_days INTEGER DEFAULT 7,
  payment_method VARCHAR(50),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsquedas frecuentes
CREATE INDEX idx_auto_renewal_user ON auto_renewal_preferences(user_id);
CREATE INDEX idx_auto_renewal_enabled ON auto_renewal_preferences(enabled) WHERE enabled = true;
```

### Tabla: renewal_history

```sql
CREATE TABLE renewal_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  membership_id UUID REFERENCES memberships(id),
  previous_end_date TIMESTAMP NOT NULL,
  new_end_date TIMESTAMP NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para historial
CREATE INDEX idx_renewal_history_user_date ON renewal_history(user_id, created_at DESC);
CREATE INDEX idx_renewal_history_status ON renewal_history(status, created_at DESC);
```

### Vista Materializada: monthly_revenue_stats (Opcional)

```sql
CREATE MATERIALIZED VIEW monthly_revenue_stats AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as transaction_count,
  SUM(total) as total_revenue,
  AVG(total) as avg_ticket,
  COUNT(DISTINCT user_id) as unique_users
FROM receipts
WHERE transaction_status = 'COMPLETED'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Índice para búsquedas rápidas
CREATE INDEX idx_monthly_revenue_month ON monthly_revenue_stats(month DESC);

-- Configurar refresh automático (cada hora)
CREATE OR REPLACE FUNCTION refresh_monthly_revenue_stats()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_revenue_stats;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_refresh_monthly_revenue
AFTER INSERT OR UPDATE ON receipts
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_monthly_revenue_stats();
```

---

## 🔒 Seguridad y Autorización

### Middleware de Autenticación

```typescript
// Pseudocódigo - Implementar según framework
function authenticateJWT(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer {token}
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

### Middleware de Autorización

```typescript
function requireRole(allowedRoles: string[]) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions' 
      });
    }
    next();
  };
}

// Uso:
app.get('/api/v1/admin/reports/kpis', 
  authenticateJWT, 
  requireRole(['ADMIN', 'SUPER_ADMIN']), 
  getKPIs
);
```

### Verificación de Ownership

```typescript
function verifyOwnership(req, res, next) {
  const { userId } = req.params;
  
  // Admin puede acceder a todo
  if (req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN') {
    return next();
  }
  
  // Usuario solo puede acceder a sus propios recursos
  if (req.user.id !== userId) {
    return res.status(403).json({ 
      error: 'You can only access your own resources' 
    });
  }
  
  next();
}
```

---

## 🧪 Testing

### Configuración de Tests

```javascript
// Ejemplo con Jest + Supertest
describe('Receipt Endpoints', () => {
  let authToken;
  let userId;
  
  beforeAll(async () => {
    // Setup: crear usuario de prueba y obtener token
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@fitzone.com', password: 'test123' });
    
    authToken = loginRes.body.token;
    userId = loginRes.body.user.id;
  });
  
  describe('POST /api/v1/receipts', () => {
    it('should create a receipt with valid data', async () => {
      const receiptData = {
        userId,
        transactionType: 'MEMBERSHIP_PAYMENT',
        amount: 250000,
        paymentMethod: 'CREDIT_CARD',
        membershipType: 'PREMIUM'
      };
      
      const res = await request(app)
        .post('/api/v1/receipts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(receiptData);
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.receiptNumber).toMatch(/^FZ-\d{8}-\d{4}$/);
      expect(res.body.transactionStatus).toBe('COMPLETED');
    });
    
    it('should return 401 without auth token', async () => {
      const res = await request(app)
        .post('/api/v1/receipts')
        .send({});
      
      expect(res.status).toBe(401);
    });
    
    it('should return 400 with invalid data', async () => {
      const res = await request(app)
        .post('/api/v1/receipts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: -100 }); // Monto negativo
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});
```

### Cobertura de Tests Requerida

- [ ] **Unitarios**: > 80% cobertura
- [ ] **Integración**: Flujos completos de usuarios
- [ ] **E2E**: Escenarios críticos (pago, renovación)
- [ ] **Carga**: Reportes con 1000+ registros
- [ ] **Seguridad**: Intentos de acceso no autorizado

---

## 📈 Performance y Optimización

### Caché con Redis

```typescript
// Ejemplo de implementación de caché para reportes
async function getKPIs(req, res) {
  const cacheKey = `kpis:${req.query.period || 'monthly'}`;
  
  // Intentar obtener del caché
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  // Si no está en caché, calcular
  const kpis = await calculateKPIs(req.query.period);
  
  // Guardar en caché por 30 minutos
  await redis.setex(cacheKey, 1800, JSON.stringify(kpis));
  
  res.json(kpis);
}
```

### Queries Optimizadas

```sql
-- Ejemplo: KPIs con una sola query
SELECT 
  -- Ingresos totales
  SUM(CASE WHEN transaction_status = 'COMPLETED' THEN total ELSE 0 END) as total_revenue,
  
  -- Total de transacciones
  COUNT(*) as total_transactions,
  
  -- Ticket promedio
  AVG(CASE WHEN transaction_status = 'COMPLETED' THEN total ELSE NULL END) as avg_ticket,
  
  -- Comparación con período anterior
  (SELECT SUM(total) 
   FROM receipts 
   WHERE transaction_status = 'COMPLETED' 
     AND created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
     AND created_at < DATE_TRUNC('month', CURRENT_DATE)
  ) as previous_month_revenue

FROM receipts
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE);
```

### Paginación

```typescript
// Ejemplo de paginación estándar
async function getUserReceipts(req, res) {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  
  const [receipts, total] = await Promise.all([
    db.receipts.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit
    }),
    db.receipts.count({ where: { userId } })
  ]);
  
  res.json({
    data: receipts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: offset + limit < total
    }
  });
}
```

---

## 🔄 Tareas Cron

### Verificación de Expiraciones (Diaria)

```typescript
// Ejecutar todos los días a las 9:00 AM
cron.schedule('0 9 * * *', async () => {
  console.log('Running daily expiration check...');
  
  // Buscar membresías que expiran en los próximos 7 días
  const expiringMemberships = await db.memberships.findMany({
    where: {
      endDate: {
        gte: new Date(),
        lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      status: 'ACTIVE'
    },
    include: {
      user: {
        include: {
          autoRenewalPreferences: true
        }
      }
    }
  });
  
  // Generar notificaciones
  for (const membership of expiringMemberships) {
    const prefs = membership.user.autoRenewalPreferences;
    const daysUntilExpiry = Math.ceil(
      (membership.endDate - Date.now()) / (1000 * 60 * 60 * 24)
    );
    
    if (prefs && prefs.enabled && prefs.notificationDays === daysUntilExpiry) {
      await createNotification({
        userId: membership.userId,
        type: 'EXPIRATION_WARNING',
        priority: 'HIGH',
        title: 'Tu membresía está por vencer',
        message: `Tu membresía ${membership.type} vence en ${daysUntilExpiry} días.`
      });
    }
  }
  
  console.log(`Processed ${expiringMemberships.length} expiring memberships`);
});
```

### Procesamiento de Auto-Renovaciones (Diaria)

```typescript
// Ejecutar todos los días a las 10:00 AM
cron.schedule('0 10 * * *', async () => {
  console.log('Running auto-renewal processor...');
  
  // Buscar membresías que expiran hoy y tienen auto-renovación habilitada
  const toRenew = await db.memberships.findMany({
    where: {
      endDate: {
        gte: startOfDay(new Date()),
        lte: endOfDay(new Date())
      },
      status: 'ACTIVE',
      user: {
        autoRenewalPreferences: {
          enabled: true
        }
      }
    },
    include: {
      user: {
        include: {
          autoRenewalPreferences: true
        }
      }
    }
  });
  
  for (const membership of toRenew) {
    try {
      // Procesar pago
      const paymentResult = await processPayment({
        userId: membership.userId,
        amount: membership.price,
        paymentMethod: membership.user.autoRenewalPreferences.paymentMethod
      });
      
      if (paymentResult.success) {
        // Renovar membresía
        await renewMembership(membership.id);
        
        // Crear recibo
        await createReceipt({
          userId: membership.userId,
          transactionType: 'RENEWAL',
          amount: membership.price,
          membershipId: membership.id
        });
        
        // Notificar éxito
        await createNotification({
          userId: membership.userId,
          type: 'PAYMENT_SUCCESS',
          priority: 'MEDIUM',
          title: 'Renovación exitosa',
          message: 'Tu membresía ha sido renovada automáticamente.'
        });
      } else {
        // Notificar fallo
        await createNotification({
          userId: membership.userId,
          type: 'PAYMENT_FAILED',
          priority: 'URGENT',
          title: 'Error en renovación',
          message: 'No se pudo procesar el pago. Por favor, actualiza tu método de pago.'
        });
      }
    } catch (error) {
      console.error(`Error renewing membership ${membership.id}:`, error);
    }
  }
  
  console.log(`Processed ${toRenew.length} auto-renewals`);
});
```

---

## 🌐 Variables de Entorno

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/fitzone
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Redis Cache
REDIS_URL=redis://localhost:6379
REDIS_TTL=1800

# API
PORT=8080
NODE_ENV=production
API_VERSION=v1
BASE_URL=https://desplieguefitzone.onrender.com

# CORS
CORS_ORIGIN=https://fitzone-frontend.vercel.app,http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Payment Gateway (ejemplo Stripe/PayU)
PAYMENT_GATEWAY_API_KEY=your-payment-gateway-key
PAYMENT_GATEWAY_SECRET=your-payment-gateway-secret
PAYMENT_GATEWAY_WEBHOOK_SECRET=your-webhook-secret

# Email Service (ejemplo SendGrid)
EMAIL_SERVICE_API_KEY=your-email-service-key
EMAIL_FROM=noreply@fitzone.com
EMAIL_FROM_NAME=FitZone

# Monitoring (opcional)
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info

# Cron Jobs
ENABLE_CRON_JOBS=true
EXPIRATION_CHECK_CRON=0 9 * * *
AUTO_RENEWAL_CRON=0 10 * * *
```

---

## 📦 Dependencias Recomendadas

### Node.js + Express

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "prisma": "^5.7.0",
    "@prisma/client": "^5.7.0",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "joi": "^17.11.0",
    "redis": "^4.6.11",
    "node-cron": "^3.0.3",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "winston": "^3.11.0",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "@types/node": "^20.10.5",
    "@types/express": "^4.17.21",
    "typescript": "^5.3.3"
  }
}
```

### Java + Spring Boot

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt</artifactId>
        <version>0.9.1</version>
    </dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
```

---

## 🚦 Endpoints por Prioridad Visual

### 🔴 Críticos - Sprint 1 (Semana 1-2)

```
POST   /api/v1/receipts
GET    /api/v1/users/{userId}/receipts
GET    /api/v1/receipts/{receiptId}
GET    /api/v1/notifications/{userId}
PATCH  /api/v1/notifications/{notificationId}/read
POST   /api/v1/notifications
```

### 🟡 Importantes - Sprint 2 (Semana 3-4)

```
GET    /api/v1/users/{userId}/membership/auto-renewal-preferences
PUT    /api/v1/users/{userId}/membership/auto-renewal-preferences
GET    /api/v1/users/{userId}/membership/check-expiration
POST   /api/v1/users/{userId}/membership/generate-renewal-notifications
POST   /api/v1/users/{userId}/membership/auto-renew
GET    /api/v1/users/{userId}/membership/renewal-history
```

### 🟢 Deseables - Sprint 3 (Semana 5)

```
GET    /api/v1/admin/reports/kpis
GET    /api/v1/admin/reports/revenue
GET    /api/v1/admin/reports/memberships
GET    /api/v1/admin/reports/payment-methods
GET    /api/v1/admin/reports/renewals
GET    /api/v1/admin/reports/export
GET    /api/v1/admin/reports/dashboard
```

---

## ✅ Checklist de Deployment

### Pre-Deployment

- [ ] Todas las variables de entorno configuradas
- [ ] Base de datos creada con todas las tablas
- [ ] Índices creados en tablas críticas
- [ ] Redis configurado y funcionando
- [ ] Secrets y API keys seguros en entorno de producción
- [ ] CORS configurado correctamente
- [ ] Rate limiting activado
- [ ] Logs configurados (Winston/Bunyan/etc)
- [ ] Monitoring configurado (Sentry/DataDog/etc)

### Testing Pre-Production

- [ ] Tests unitarios pasando (> 80% cobertura)
- [ ] Tests de integración pasando
- [ ] Tests E2E de flujos críticos pasando
- [ ] Load testing completado (500+ usuarios concurrentes)
- [ ] Security testing completado (OWASP Top 10)
- [ ] API documentation actualizada

### Deployment

- [ ] Deploy a staging environment
- [ ] Smoke tests en staging
- [ ] Frontend conectado a staging para pruebas
- [ ] Deploy a producción
- [ ] Smoke tests en producción
- [ ] Monitoring activo

### Post-Deployment

- [ ] Verificar logs de errores
- [ ] Verificar métricas de performance
- [ ] Verificar cron jobs ejecutándose
- [ ] Verificar notificaciones funcionando
- [ ] Verificar pagos procesándose
- [ ] Notificar a equipo frontend que API está lista

---

## 📞 Contacto y Soporte

**Frontend Team Lead**: [Tu nombre]  
**Email**: frontend@fitzone.com  
**Documentación completa**: `API_SPECIFICATION.md`  
**Repositorio Frontend**: https://github.com/juan-david-lopez/front-proyecto

---

## 📚 Referencias Adicionales

1. **API_SPECIFICATION.md**: Documentación completa de todos los endpoints con ejemplos
2. **Frontend Services**: 
   - `services/receiptService.ts`
   - `services/membershipNotificationService.ts`
   - `services/membershipManagementService.ts`
3. **Frontend Components**:
   - `components/auto-renewal-settings.tsx`
   - `app/dashboard/admin/reportes/page.tsx`

---

**Última actualización**: 1 de octubre de 2025  
**Versión**: 1.0.0
