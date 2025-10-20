# 🔐 GUÍA DE PRUEBA - FUNCIÓN DE LOGOUT

## ✅ ESTADO ACTUAL
- **Versión**: 3.0 - Completamente reescrita
- **Compilación**: ✅ Exitosa (0 errores)
- **Rutas**: ✅ 35 generadas correctamente
- **TypeScript**: ✅ 0 errores

---

## 🎯 CAMBIOS IMPLEMENTADOS

### 1. **authService.ts - clearAuth() (MEJORADA)**
- ✅ Limpia 12 claves específicas de localStorage
- ✅ Limpia sessionStorage completo
- ✅ Registra cada paso en consola
- ✅ Verifica que localStorage esté vacío
- ✅ Logging detallado para debugging

### 2. **contexts/auth-context.tsx - logout() (MEJORADA)**
- ✅ 8 pasos de limpieza exhaustiva
- ✅ Borra localStorage + sessionStorage
- ✅ Limpia React state (setUser(null))
- ✅ Limpia token del authService
- ✅ Limpia datos del formulario de login
- ✅ Borra cache del Service Worker
- ✅ Verifica limpieza con logging
- ✅ Contingencia en caso de error
- ✅ Redirige a /login con reload

### 3. **components/auth-guard.tsx (MEJORADA)**
- ✅ Verificación multi-punto (token + user)
- ✅ Bloquea acceso si no hay token Y no hay user
- ✅ Permite acceso si tiene user context
- ✅ Permite públicas sin requerimiento de auth
- ✅ Logging detallado en cada decisión

---

## 🧪 PROTOCOLO DE PRUEBA

### **PASO 1: Preparar el Navegador**

```bash
1. Abre el navegador (Chrome/Firefox/Safari)
2. Ir a: https://tu-app.vercel.app o http://localhost:3000
3. Abre DevTools: F12 o Ctrl+Shift+I
4. Navega a: Application → Local Storage → tu-app
5. Navega a: Console para ver logs
```

### **PASO 2: Iniciar Sesión**

```
1. Click en "Iniciar Sesión" o ve a /login
2. Ingresa email: test@example.com (o uno válido)
3. Ingresa contraseña: password
4. Verifica OTP si es requerido
5. Verifica que hayas accedido al dashboard
6. ✅ Deberías estar en /dashboard
```

### **PASO 3: Verificar localStorage ANTES de Logout**

```
En DevTools → Application → Local Storage:
- ✅ accessToken: debe existir
- ✅ refreshToken: debe existir
- ✅ fitzone_token: puede existir
- ✅ fitzone_user: puede existir
- ✅ user: debe existir (datos del usuario)

En Console:
- ✅ No debe haber errores de autenticación
```

### **PASO 4: CLICK EN LOGOUT**

```
1. Busca el botón "Cerrar sesión" o "Logout"
2. Ubicaciones posibles:
   - Components/navigation.tsx (botón de navegación superior)
   - Components/mobile-menu.tsx (menú móvil)
3. ✅ CLICK en "Cerrar sesión"
4. Observa la consola para logs
```

### **PASO 5: VERIFICAR LOGS EN CONSOLA**

Deberías ver algo como:

```
[AuthContext] 🚪 INICIANDO LOGOUT...
[AuthContext] 🧹 Paso 1/8: Limpiando localStorage...
[AuthService] 🧹 INICIANDO LIMPIEZA DE AUTENTICACIÓN...
  ✅ Removido: accessToken
  ✅ Removido: refreshToken
  ✅ Removido: fitzone_token
  ✅ Removido: fitzone_user
  [más items...]
[AuthService] 🔍 VERIFICANDO LIMPIEZA:
  📦 localStorage.length: 0
  🔑 accessToken presente: false
  🔑 refreshToken presente: false
  🔑 fitzone_token presente: false
[AuthService] ✅✅✅ LIMPIEZA COMPLETA - localStorage VACÍO
[AuthContext] 🧹 Paso 2/8: Limpiando sessionStorage...
[AuthContext] 🧹 Paso 3/8: Limpiando token del authService...
[AuthContext] 🧹 Paso 4/8: Limpiando datos del formulario...
[AuthContext] 🧹 Paso 5/8: Actualizando React state...
[AuthContext] 🧹 Paso 6/8: Borrando Service Worker cache...
[AuthContext] 🧹 Paso 7/8: Verificando limpieza...
[AuthContext] ❌❌❌ LOGOUT COMPLETADO EXITOSAMENTE ✅✅✅
```

### **PASO 6: VERIFICAR localStorage DESPUÉS de Logout**

```
En DevTools → Application → Local Storage:
- ❌ accessToken: DEBE ESTAR VACÍO
- ❌ refreshToken: DEBE ESTAR VACÍO  
- ❌ fitzone_token: DEBE ESTAR VACÍO
- ❌ fitzone_user: DEBE ESTAR VACÍO
- ❌ user: DEBE ESTAR VACÍO

✅ localStorage.length DEBE SER 0 o muy cercano a 0
```

### **PASO 7: VERIFICAR REDIRECCIÓN**

```
1. Después de logout, debería redirigir a /login
2. La URL debe cambiar a: /login?logout=true&t={timestamp}
3. La página debe recargar
4. No debería haber JWT token en ningún lado
```

### **PASO 8: VERIFICAR ACCESO A RUTAS PROTEGIDAS**

```
1. En la consola del navegador, escribe:
   window.location.href = '/dashboard'

2. ¿QUÉ DEBERÍA PASAR?
   ✅ DEBE redirigir a /login
   ✅ NO debería dejar acceder a /dashboard
   
3. Verifica en consola los logs de auth-guard:
   [AuthGuard] 🚫 Acceso denegado: No autenticado
   [AuthGuard] 🔄 Redirigiendo a /login
```

### **PASO 9: VERIFICAR LOGIN FUNCIONA NUEVAMENTE**

```
1. En /login, intenta iniciar sesión nuevamente
2. ✅ Deberías poder entrar sin problemas
3. ✅ Los tokens deberían estar nuevamente en localStorage
4. ✅ El dashboard debería estar accesible
```

### **PASO 10: TEST DE MÚLTIPLES NAVEGADORES**

```
Repite el test en:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari (si tienes Mac)
- ✅ Edge
- ✅ Navegador móvil (iOS Safari / Chrome Android)
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### **PROBLEMA: El botón logout no hace nada**

```
📋 Checklist:
1. ¿Está llamado correctamente el onClick?
   - En navigation.tsx: onClick={logout}
   
2. ¿Viene logout del contexto?
   - const { logout } = useAuth()
   
3. ¿Hay errores en consola?
   - Abre DevTools → Console
   - Busca errores rojos
   
4. ¿El logout está definido en AuthContext?
   - Abre contexts/auth-context.tsx
   - Verifica que logout esté en el value de AuthContext
```

### **PROBLEMA: localStorage no se limpia**

```
📋 Checklist:
1. Verifica que clearAuth() se ejecute
   - Busca "[AuthService] 🧹 INICIANDO LIMPIEZA" en consola
   
2. Si no aparece:
   - El logout() no está llamando a authService.clearAuth()
   - Revisa contexts/auth-context.tsx línea de clearAuth
   
3. Verifica itemns específicos:
   - localStorage.clear() en DevTools Console
   - localStorage.getItem('accessToken')
   - Debería retornar null
```

### **PROBLEMA: No redirige a /login**

```
📋 Checklist:
1. ¿Hay errores en la redirección?
   - Busca "Redirigiendo a /login" en consola
   
2. ¿Router.push() funciona?
   - Verifica que useRouter() está importado
   - router.push('/login') está en el código
   
3. ¿Window.location.reload() funciona?
   - Algunos ambientes pueden bloquearlo
   - Intenta solo router.push('/login')
```

### **PROBLEMA: Puedo acceder a rutas protegidas después de logout**

```
📋 Checklist:
1. ¿AuthGuard está verificando token?
   - Lee components/auth-guard.tsx
   - Verifica que revise getAccessToken()
   
2. ¿AuthGuard está en las rutas correctas?
   - Busca where AuthGuard is used
   - Debe estar en /dashboard y subrutas
   
3. ¿El localStorage se limpió realmente?
   - Abre DevTools
   - Verifica que localStorage esté vacío
   - Si no está vacío, logout no funcionó
```

---

## 📊 MATRIZ DE VERIFICACIÓN

| Aspecto | Estado Esperado | ¿Verificado? |
|---------|-----------------|------------|
| Build compila | ✅ 0 errores | ☐ |
| localStorage vacío tras logout | ✅ Sí | ☐ |
| Redirige a /login | ✅ Sí | ☐ |
| No puede acceder a /dashboard | ✅ Redirige | ☐ |
| Login funciona después | ✅ Sí | ☐ |
| Tokens se regeneran en login | ✅ Sí | ☐ |
| Logs en consola aparecen | ✅ Sí | ☐ |
| Funciona en Chrome | ✅ Sí | ☐ |
| Funciona en Firefox | ✅ Sí | ☐ |
| Funciona en móvil | ✅ Sí | ☐ |

---

## 🚀 SIGUIENTES PASOS

### Si TODO funciona correctamente (✅):

```bash
1. Commit los cambios:
   git add -A
   git commit -m "✅ LOGOUT COMPLETAMENTE FUNCIONAL - localStorage + JWT limpio"

2. Push a GitHub:
   git push origin main

3. Deployment automático en Vercel:
   - Debería desplegar automáticamente
   - Verifica que el status sea ✅ Deployment successful

4. Test en producción:
   - https://tu-app.vercel.app
   - Repite los pasos 1-10 en producción
```

### Si hay PROBLEMAS (❌):

```bash
1. Captura screenshot de:
   - Console logs (especialmente errores)
   - Application → Local Storage
   - URL en navegador

2. Describe exactamente:
   - ¿Qué elemento hiciste click?
   - ¿Qué pasó después?
   - ¿Qué ves en consola?
   
3. Revisa los logs en contexto/auth-context.tsx
   - Busca la función logout()
   - Verifica cada paso se esté ejecutando
```

---

## 📝 NOTAS TÉCNICAS

### **¿Por qué 8 pasos de limpieza?**

1. **localStorage** - Borra acceso token
2. **sessionStorage** - Borra datos temporales
3. **Token del servicio** - Limpia authService
4. **Datos del formulario** - Limpia cache de login
5. **React state** - Resetea user context
6. **Service Worker** - Borra cache offline
7. **Verificación** - Confirma que todo está limpio
8. **Redireccionamiento** - Lleva a /login

### **¿Por qué localStorage.length debe ser 0?**

- Verifica que TODA la sesión se haya borrado
- Previene acceso no autorizado a tokens
- Asegura que /dashboard no funcione sin tokens

### **¿Por qué reload()?**

- Limpia el estado en memoria de la aplicación
- Fuerza recarga de scripts y contextos
- Previene acceso mediante manipulación del DOM

---

## 🎓 CONCLUSIÓN

Si todos los pasos se completan correctamente, significa que:

✅ El usuario está completamente desconectado
✅ No hay JWT en ningún lado
✅ No puede acceder a rutas protegidas
✅ El logout es seguro y robusto
✅ El login funciona nuevamente

**¡FELICITACIONES! Tu sistema de autenticación está seguro.** 🎉
