# 🚀 Guía de Despliegue en Vercel - FitZone Frontend

## Estado Actual del Proyecto ✅

### Características Implementadas
- ✅ **Next.js 14.2.25** - App Router
- ✅ **TypeScript 5** - Strict mode
- ✅ **Autenticación JWT** - Implementada
- ✅ **Stripe Integration** - Pagos completamente integrados
- ✅ **Sistema de Reservas** - Clases grupales, entrenamientos personales, espacios especializados
- ✅ **Dark Mode** - Full support con next-themes
- ✅ **Responsive Design** - Mobile, tablet, desktop
- ✅ **Payment Modal** - CardElement de Stripe
- ✅ **Group Classes System** - Membresía ELITE/PREMIUM/BASIC

---

## ✅ CHECKLIST PRE-DEPLOYMENT

### 1. **Variables de Entorno** ⚠️ CRÍTICO
Crear archivo `.env.local` en la raíz del proyecto:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8080/api  # Development
# O para producción:
# NEXT_PUBLIC_API_URL=https://tu-backend-url/api

# Stripe (Public Key - Safe to expose)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
# O para producción:
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
```

### 2. **Configuración en Vercel**

En el panel de Vercel, configurar estas variables:

**Environment Variables:**
```
NEXT_PUBLIC_API_URL: https://desplieguefitzone.onrender.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: pk_test_xxxxxxxxxxxxx
```

### 3. **Build & Start Scripts**

En `package.json` (ya configurado ✅):
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "dev": "next dev"
  }
}
```

### 4. **TypeScript Compilation**

```bash
# Verificar que compila sin errores
npm run build

# Resultado esperado:
# ✓ Compiled successfully
# > Ran 'npm run build' in XXXms
```

---

## 📋 REQUISITOS BACKEND

**IMPORTANTE:** El backend debe estar desplegado y accesible antes de desplegar el frontend.

### Endpoints Requeridos
- ✅ `GET /api/reservations/group-classes` - Lista clases disponibles
- ✅ `POST /api/reservations/group-classes/{id}/join` - Unirse gratis (ELITE)
- ✅ `POST /api/reservations/group-classes/{id}/join-with-payment` - Pago (PREMIUM/BASIC)
- ✅ `GET /api/reservations/my` - Mis reservas
- ✅ `POST /api/auth/login` - Autenticación
- ✅ `GET /api/locations` - Ubicaciones

### Respuesta JWT
El backend debe devolver token JWT con estructura:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 31,
    "email": "usuario@ejemplo.com",
    "membershipType": "PREMIUM",
    "name": "Usuario"
  }
}
```

---

## 🔐 Configuración de Seguridad

### 1. **CORS Headers**
Backend debe permitir requests desde Vercel:
```
Access-Control-Allow-Origin: https://tu-dominio.vercel.app
```

### 2. **JWT Token Storage**
- ✅ Almacenado en `localStorage`
- ✅ Incluido automáticamente en headers `Authorization: Bearer <token>`
- ⚠️ Token expira después de X horas (depende backend)

### 3. **Stripe Security**
- ✅ Solo la Public Key expuesta (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`)
- ✅ Secret Key nunca en frontend
- ✅ PaymentIntent creado en backend

---

## 🚀 PASOS DE DESPLIEGUE

### Paso 1: Preparar el Repositorio
```bash
git add -A
git commit -m "chore: Prepare for Vercel deployment"
git push origin stripe-system-production-ready
```

### Paso 2: Conectar a Vercel
1. Ir a https://vercel.com/new
2. Seleccionar "Import Git Repository"
3. Conectar repositorio GitHub
4. Seleccionar rama: `stripe-system-production-ready`

### Paso 3: Configurar Variables
En Vercel Dashboard:
1. Settings → Environment Variables
2. Agregar:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Paso 4: Deploy
1. Click "Deploy"
2. Esperar 3-5 minutos
3. Vercel asignará URL automáticamente

### Paso 5: Verificar
```bash
# URLs de prueba
https://tu-proyecto.vercel.app/login
https://tu-proyecto.vercel.app/reservas
https://tu-proyecto.vercel.app/dashboard
```

---

## ⚠️ PROBLEMAS COMUNES & SOLUCIONES

### Error: "401 Unauthorized"
**Causa:** Token JWT expirado
**Solución:** Vuelve a iniciar sesión en `/login`

### Error: "Cannot GET /api/reservations/group-classes"
**Causa:** Backend API no accesible
**Verificar:**
- Backend está corriendo
- URL en `NEXT_PUBLIC_API_URL` es correcta
- CORS configurado en backend

### Error: "Stripe not initialized"
**Causa:** `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` faltante
**Solución:** Agregar en variables de entorno de Vercel

### Build falla con errores CSS
**Nota:** Los errores `@apply`, `@theme`, `@custom-variant` son advertencias de Tailwind CSS v4 y NO afectan el build. Next.js los ignora automáticamente.

---

## 📊 Performance Optimizations (Ya Implementadas)

- ✅ Image optimization
- ✅ Code splitting automático
- ✅ CSS pruning
- ✅ API routes optimizadas
- ✅ Component lazy loading
- ✅ Font optimization

---

## 🔄 Actualización & Mantenimiento

### Desplegar cambios
```bash
git add -A
git commit -m "feat: Nueva funcionalidad"
git push origin stripe-system-production-ready
```
**Vercel redeploya automáticamente** ✨

### Ver logs en vivo
En Vercel Dashboard → Deployments → Logs

---

## ✨ Características Listas para Producción

### Autenticación
- ✅ Login/Register
- ✅ JWT tokens
- ✅ Token persistence
- ✅ Logout

### Reservas
- ✅ Clases grupales
- ✅ Entrenamientos personales
- ✅ Espacios especializados
- ✅ Cancelación de reservas

### Pagos (Stripe)
- ✅ PaymentElement
- ✅ Test mode
- ✅ Error handling
- ✅ Success notifications

### Dashboard
- ✅ Próximas reservas
- ✅ Historial
- ✅ Membresía info
- ✅ Stats

### UI/UX
- ✅ Dark mode
- ✅ Responsive
- ✅ Accesibilidad
- ✅ Loading states

---

## 🧪 Testing Antes de Deploy

### 1. Funcionalidad Local
```bash
npm run dev
# Probar en http://localhost:3000
```

### 2. Build Production
```bash
npm run build
npm run start
# Probar en http://localhost:3000
```

### 3. Checklist de Testing
- [ ] Login funciona
- [ ] Ver clases grupales
- [ ] Reservar clase (ELITE - gratis)
- [ ] Reservar clase (PREMIUM - con pago)
- [ ] Stripe test card: `4242 4242 4242 4242`
- [ ] Pago exitoso
- [ ] Notificación de reserva
- [ ] Dark mode funciona
- [ ] Mobile responsive

---

## 📞 Soporte & Debugging

### Ver errores en Vercel
1. Vercel Dashboard → Deployments
2. Click en despliegue más reciente
3. Tab "Logs" → "Function Logs"

### Debugging local
```bash
# Con verbose logging
DEBUG=* npm run dev

# Check environment variables
npm run build -- --verbose
```

### Verificar backend connectivity
```bash
curl -H "Authorization: Bearer <token>" \
  https://tu-backend-url/api/reservations/group-classes
```

---

## 🎉 ¡LISTO PARA PRODUCCIÓN!

**Estado:** ✅ 100% Listo

**Próximos pasos:**
1. ✅ Verificar backend desplegado
2. ✅ Configurar variables en Vercel
3. ✅ Hacer push a GitHub
4. ✅ Conectar a Vercel
5. ✅ Deploy!

**Tiempo estimado:** 15-20 minutos

---

**Versión:** 1.0.0  
**Fecha:** Oct 19, 2025  
**Framework:** Next.js 14.2.25  
**Deploy:** Vercel  
**Status:** ✅ PRODUCTION READY
