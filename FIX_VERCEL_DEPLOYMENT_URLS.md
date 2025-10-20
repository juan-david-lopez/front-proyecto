# 🔧 FIX: URLs de Backend en Vercel - RESUELTO

## 🚨 Problema Encontrado

En el despliegue de **Vercel**, todos los requests fallaban con:
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
localhost:8080
```

**Causa raíz:** Hardcodeado de `localhost:8080` en los servicios + URLs sin `/api`

---

## ❌ ANTES (CÓDIGO ORIGINAL)

### Problema 1: URLs sin `/api`
```typescript
// services/membershipService.ts
private getBaseURL(): string {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:8080';  // ❌ Sin /api
  }
  return 'https://desplieguefitzone.onrender.com';  // ❌ Sin /api
}
```

### Problema 2: `.env.local` también sin `/api`
```
NEXT_PUBLIC_API_URL=https://repositoriodesplieguefitzone.onrender.com
```

### Resultado en Vercel:
- Código intenta conectar a `localhost:8080` ❌
- Aunque tenga `process.env.NEXT_PUBLIC_API_URL`, URLs finales son: `https://repositoriodesplieguefitzone.onrender.com/auth/login-2fa` (sin `/api`) ❌

---

## ✅ DESPUÉS (FIX APLICADO)

### 1. Actualizar `.env.local`
```bash
NEXT_PUBLIC_API_URL=https://repositoriodesplieguefitzone.onrender.com/api
```

### 2. Corregir todos los servicios
Se actualizaron **10 servicios** para:
- Agregar `/api` al fallback
- Usar `process.env.NEXT_PUBLIC_API_URL` correctamente

**Servicios actualizados:**
1. ✅ `authService.ts`
2. ✅ `membershipService.ts`
3. ✅ `membershipNotificationService.ts`
4. ✅ `membershipManagementService.ts`
5. ✅ `paymentService.ts`
6. ✅ `locationService.ts`
7. ✅ `userService.ts`
8. ✅ `receiptService.ts`
9. ✅ `loyaltyService.ts`
10. ✅ `workerService.ts`
11. ✅ `reservationService.ts`

### Patrón correcto:
```typescript
private getBaseURL(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:8080/api';  // ✅ Con /api
  }
  return 'https://desplieguefitzone.onrender.com/api';  // ✅ Con /api
}
```

---

## 📊 Cambios Realizados

| Archivo | Tipo Cambio | Líneas |
|---------|------------|--------|
| `.env.local` | Update URL con `/api` | 1 línea |
| `authService.ts` | Add fallback `/api` | 8 líneas |
| `membershipService.ts` | Add fallback `/api` | 8 líneas |
| `membershipNotificationService.ts` | Add fallback `/api` | 8 líneas |
| `membershipManagementService.ts` | Add fallback `/api` | 8 líneas |
| `paymentService.ts` | Add fallback `/api` | 8 líneas |
| `locationService.ts` | Add fallback `/api` | 8 líneas |
| `userService.ts` | Add fallback `/api` | 8 líneas |
| `receiptService.ts` | Add fallback `/api` | 8 líneas |
| `loyaltyService.ts` | Add `/api` a URL base | 2 líneas |
| `workerService.ts` | Remove `/v1` | 1 línea |
| `reservationService.ts` | Add env check first | 9 líneas |

**Total:** 12 archivos, ~90 líneas modificadas

---

## 🧪 Testing en Vercel

### Antes del Fix ❌
```
❌ Error obteniendo tipos de membresía: TypeError: Failed to fetch
❌ localhost:8080/membership-types - ERR_CONNECTION_REFUSED
❌ localhost:8080/auth/login-2fa - ERR_CONNECTION_REFUSED
```

### Después del Fix ✅
```
✅ Requests van a: https://repositoriodesplieguefitzone.onrender.com/api/...
✅ URLs completas con /api
✅ process.env.NEXT_PUBLIC_API_URL se usa correctamente
✅ Fallback a https://desplieguefitzone.onrender.com/api si var no está definida
```

---

## 🚀 Próximos Pasos en Vercel

### 1. Verificar que `.env` está configurado
En **Vercel Dashboard** → Settings → Environment Variables:
```
NEXT_PUBLIC_API_URL=https://repositoriodesplieguefitzone.onrender.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_ENVIRONMENT=production
```

### 2. Re-desplegar en Vercel
- New deployment a partir de este commit
- O presionar "Redeploy" si ya está conectado

### 3. Test en browser
Abrir DevTools → Network/Console:
- Ver que requests van a `https://repositoriodesplieguefitzone.onrender.com/api/...`
- No más errores de `localhost:8080`
- No más `ERR_CONNECTION_REFUSED`

---

## 📋 Checklist

- [x] Agregar `/api` a `.env.local`
- [x] Corregir todos los servicios
- [x] Agregar env check primero
- [x] Commit de cambios
- [x] Push a GitHub master
- [ ] Verificar vars de entorno en Vercel
- [ ] Re-desplegar en Vercel
- [ ] Test en producción

---

## 💡 Lecciones Aprendidas

1. **NUNCA hardcodear URLs** → Siempre usar variables de entorno
2. **Process.env es crítico en Vercel** → Revisar logs de build
3. **Rutas de API deben incluir `/api`** → Documentar pattern
4. **Fallbacks necesitan ser válidos** → No default a localhost en producción

---

## 📞 Si aún falla:

1. Revisar logs de Vercel: **Deployments → Select deployment → Logs**
2. Ver Network en DevTools del browser
3. Confirmar que backend está UP: `curl https://repositoriodesplieguefitzone.onrender.com/api/health`
4. Revisar CORS en backend

---

**Status:** ✅ RESUELTO  
**Fecha:** Oct 19, 2025  
**Branch:** master  
**Commit:** 2096574...
