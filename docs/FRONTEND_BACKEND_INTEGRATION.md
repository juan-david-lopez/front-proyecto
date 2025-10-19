# Guía de Integración Frontend-Backend - FitZone

## 🔗 Cómo Conectar Frontend con Backend

Esta guía te muestra paso a paso cómo conectar el frontend (que ya está 100% implementado) con el backend una vez que esté listo.

---

## 📋 Prerrequisitos

### Backend Debe Estar Listo:
- [ ] API REST funcionando en `http://localhost:8080` o producción
- [ ] Todos los 34 endpoints implementados según `API_SPECIFICATION.md`
- [ ] Base de datos configurada con las tablas necesarias
- [ ] Autenticación JWT funcionando
- [ ] CORS configurado para permitir el frontend

### Frontend Ya Está Listo:
- ✅ Todos los servicios implementados
- ✅ Componentes UI conectados
- ✅ Autenticación configurada
- ✅ Manejo de errores implementado

---

## ⚙️ Configuración Automática de URLs

El frontend ya está configurado para **detectar automáticamente** la URL del backend:

```typescript
// En receiptService.ts y otros servicios
private getBaseURL(): string {
  // 1. Si existe variable de entorno, usarla
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  
  // 2. Si estamos en localhost, usar backend local
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:8080';
  }
  
  // 3. En producción, usar backend de producción
  return 'https://desplieguefitzone.onrender.com';
}
```

### Opcional: Configurar variables de entorno

Si quieres controlar manualmente las URLs, crea `.env.local`:

```env
# .env.local (opcional)
NEXT_PUBLIC_API_URL=http://localhost:8080

# Para producción:
# NEXT_PUBLIC_API_URL=https://desplieguefitzone.onrender.com
```

---

## 🚀 Pasos para Conectar

### Paso 1: Verificar que el Backend Esté Corriendo

```bash
# Verificar que el backend responda
curl http://localhost:8080/api/v1/health

# O abrir en navegador:
# http://localhost:8080/api/v1/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-02T...",
  "version": "1.0.0"
}
```

### Paso 2: Configurar CORS en Backend

El backend debe permitir requests desde el frontend:

```javascript
// Ejemplo para Express.js
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',  // Desarrollo
    'https://fitzone-frontend.vercel.app'  // Producción
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Paso 3: Probar Autenticación

```typescript
// El frontend ya tiene configurado:
// 1. Login automático al cargar la app
// 2. Tokens JWT en localStorage
// 3. Headers Authorization en todas las requests

// Para probar manualmente:
const token = localStorage.getItem('accessToken');
console.log('Token JWT:', token);
```

### Paso 4: Iniciar Frontend

```bash
# En el directorio del frontend
pnpm install
pnpm dev
```

### Paso 5: Verificar Conexión

1. **Abrir** `http://localhost:3000`
2. **Hacer login** con un usuario válido
3. **Verificar en DevTools > Network** que las requests van al backend correcto
4. **Verificar en Console** que no hay errores de CORS

---

## 🧪 Testing de Integración

### Tests Automatizados

El frontend incluye funciones de testing en cada servicio:

```typescript
// Ejemplo de testing manual
import { receiptService } from '@/services/receiptService';

// Test 1: Crear recibo
const testCreateReceipt = async () => {
  try {
    const receipt = await receiptService.generateReceipt({
      userId: 'test-user-id',
      transactionType: 'MEMBERSHIP_PAYMENT',
      amount: 250000,
      paymentMethod: 'CREDIT_CARD',
      membershipType: 'PREMIUM'
    });
    console.log('✅ Recibo creado:', receipt);
  } catch (error) {
    console.error('❌ Error creando recibo:', error);
  }
};

// Test 2: Listar recibos
const testGetReceipts = async () => {
  try {
    const receipts = await receiptService.getUserReceipts('test-user-id');
    console.log('✅ Recibos obtenidos:', receipts);
  } catch (error) {
    console.error('❌ Error obteniendo recibos:', error);
  }
};
```

### Tests Manuales por Funcionalidad

#### 1. Sistema de Recibos
- [ ] **Crear recibo**: Hacer un pago y verificar que se genere recibo
- [ ] **Ver historial**: Ir a historial de pagos y verificar que aparezcan
- [ ] **Descargar PDF**: Click en "Descargar PDF" y verificar descarga
- [ ] **Exportar datos**: Usar botón "Exportar" y verificar CSV/Excel

#### 2. Sistema de Notificaciones  
- [ ] **Ver notificaciones**: Verificar que aparezcan en el centro de notificaciones
- [ ] **Marcar como leída**: Click en notificación y verificar que se marque
- [ ] **Notificaciones automáticas**: Verificar que lleguen por vencimiento

#### 3. Auto-Renovación
- [ ] **Configurar preferencias**: Ir a Configuración > Auto-renovación
- [ ] **Habilitar auto-renovación**: Toggle switch y guardar
- [ ] **Configurar días de notificación**: Seleccionar 7 días antes
- [ ] **Seleccionar método de pago**: Elegir tarjeta de crédito

#### 4. Reportes Administrativos (Solo Admins)
- [ ] **Dashboard admin**: Ir a `/dashboard/admin/reportes`
- [ ] **Ver KPIs**: Verificar que muestren datos reales
- [ ] **Gráficos interactivos**: Verificar Recharts con datos del backend
- [ ] **Exportar reportes**: Usar botón exportar en dashboard

---

## 🔧 Solución de Problemas Comunes

### Problema: CORS Error

**Error en consola:**
```
Access to fetch at 'http://localhost:8080/api/v1/receipts' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solución:**
```javascript
// En backend, agregar CORS middleware
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));
```

### Problema: 401 Unauthorized

**Error en consola:**
```
POST http://localhost:8080/api/v1/receipts 401 (Unauthorized)
```

**Solución:**
1. Verificar que el token JWT esté en localStorage
2. Verificar que el backend valide tokens correctamente
3. Verificar formato del header Authorization

```typescript
// El frontend ya envía:
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Problema: 404 Not Found

**Error en consola:**
```
GET http://localhost:8080/api/v1/receipts 404 (Not Found)
```

**Solución:**
1. Verificar que el endpoint esté implementado en backend
2. Verificar la URL exacta en `API_SPECIFICATION.md`
3. Verificar que el servidor backend esté corriendo

### Problema: Network Error

**Error en consola:**
```
TypeError: Failed to fetch
```

**Solución:**
1. Verificar que el backend esté corriendo en el puerto correcto
2. Verificar firewall/proxy no bloquee requests
3. Verificar URL en variables de entorno

---

## 📱 Testing en Diferentes Entornos

### Desarrollo Local

```bash
# Terminal 1: Backend
cd backend
npm start  # Puerto 8080

# Terminal 2: Frontend  
cd frontend
pnpm dev   # Puerto 3000
```

**URLs:**
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- API Docs: `http://localhost:8080/api-docs` (si implementaste Swagger)

### Staging/Producción

```env
# Frontend (.env.production)
NEXT_PUBLIC_API_URL=https://desplieguefitzone.onrender.com

# Backend debe estar desplegado y accesible
```

**URLs:**
- Frontend: `https://fitzone-frontend.vercel.app`
- Backend: `https://desplieguefitzone.onrender.com`

---

## 🔍 Debugging y Monitoreo

### 1. Logs del Frontend

El frontend ya incluye logs detallados:

```typescript
// En DevTools > Console verás:
console.log('🔄 Enviando request a:', url);
console.log('📦 Datos:', data);
console.log('✅ Respuesta exitosa:', response);
console.error('❌ Error en request:', error);
```

### 2. Network Tab

En **DevTools > Network**:
- Verificar que las requests vayan a la URL correcta
- Verificar status codes (200, 201, 400, 401, etc.)
- Verificar headers (Authorization, Content-Type)
- Verificar body de requests y responses

### 3. Application Tab

En **DevTools > Application > Local Storage**:
- Verificar que `accessToken` esté presente
- Verificar que sea un JWT válido (puedes decodificar en jwt.io)

### 4. Herramientas Adicionales

```bash
# Interceptar requests con Charles/Postman
# Ver logs en tiempo real
curl -X GET "http://localhost:8080/api/v1/users/123/receipts" \
  -H "Authorization: Bearer your-jwt-token"
```

---

## 📋 Checklist de Integración Completa

### Configuración Inicial
- [ ] Backend corriendo en puerto 8080
- [ ] CORS configurado correctamente
- [ ] Base de datos con datos de prueba
- [ ] Variables de entorno configuradas

### Autenticación
- [ ] Login funciona y devuelve JWT token
- [ ] Token se guarda en localStorage
- [ ] Requests incluyen header Authorization
- [ ] Backend valida tokens correctamente

### Funcionalidades Core
- [ ] Crear recibos funciona
- [ ] Listar recibos funciona  
- [ ] Ver notificaciones funciona
- [ ] Marcar notificaciones como leídas funciona

### Funcionalidades Avanzadas
- [ ] Auto-renovación: configurar preferencias
- [ ] Auto-renovación: verificar vencimientos
- [ ] Reportes admin: KPIs se cargan
- [ ] Reportes admin: gráficos muestran datos reales

### Performance y UX
- [ ] Requests responden en < 2 segundos
- [ ] Loading states funcionan correctamente
- [ ] Error messages son claros y útiles
- [ ] No hay errores en console del navegador

### Casos Edge
- [ ] Manejo de errores 401/403
- [ ] Manejo de errores de red
- [ ] Manejo de respuestas vacías
- [ ] Manejo de timeouts

---

## 🎯 Siguientes Pasos

### 1. Una vez conectado exitosamente:

1. **Probar todos los flujos** de usuario end-to-end
2. **Cargar datos reales** en base de datos
3. **Configurar monitoreo** de errores (Sentry)
4. **Optimizar performance** si es necesario
5. **Documentar** cualquier cambio necesario

### 2. Preparar para producción:

1. **Variables de entorno** de producción
2. **HTTPS** en backend y frontend  
3. **CDN** para assets estáticos
4. **Backup** de base de datos
5. **Monitoring** y alertas

### 3. Mantenimiento continuo:

1. **Logs** de errores y performance
2. **Updates** de dependencias
3. **Security** patches
4. **Feature** requests de usuarios

---

## 📞 Soporte

Si tienes problemas con la integración:

1. **Revisar logs** en DevTools Console y Network
2. **Verificar** que todos los endpoints estén implementados según `API_SPECIFICATION.md`
3. **Consultar** `BACKEND_IMPLEMENTATION_GUIDE.md` para guía detallada
4. **Contactar** al equipo frontend para asistencia

**Documentación relacionada:**
- `docs/API_SPECIFICATION.md` - Especificación completa de API
- `docs/BACKEND_IMPLEMENTATION_GUIDE.md` - Guía para implementar backend

---

**Última actualización**: 2 de octubre de 2025  
**Versión**: 1.0.0

<function_calls>
<invoke name="read_file">
<parameter name="filePath">c:\Users\fabes\OneDrive\Github\front-proyecto\services\receiptService.ts