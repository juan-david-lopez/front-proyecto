# 🚀 Instrucciones: Probar la Solución

## 📋 **Resumen**

✅ **Problema resuelto:** El dashboard ahora muestra correctamente la membresía después del pago.

**Cambios realizados:**
- Dashboard usa el contexto de autenticación
- Dashboard refresca automáticamente desde el backend
- Dashboard prioriza `user.membershipType` del contexto
- Agregado botón de recarga manual (🔄)

---

## 🧪 **Pasos para Probar**

### **1️⃣ Limpiar Datos Antiguos**

Abre la consola del navegador (F12) y ejecuta:

```javascript
localStorage.clear()
```

Luego recarga la página (F5).

---

### **2️⃣ Hacer Login**

1. Ve a `http://localhost:3000/login`
2. Ingresa tus credenciales
3. Completa el OTP si es necesario

---

### **3️⃣ Hacer un Pago de Prueba**

1. Ve a `http://localhost:3000/membresias`
2. Selecciona cualquier plan (ejemplo: Premium)
3. En el formulario de pago, usa esta tarjeta de prueba:

```
Número: 4242 4242 4242 4242
Fecha: 12/34
CVC: 123
ZIP: 12345
```

4. Click en "Pagar"
5. Espera el procesamiento (verás mensaje de éxito)

---

### **4️⃣ Verificar Dashboard**

Deberías ser redirigido automáticamente a `/dashboard`.

**✅ Resultado esperado:**

- Card muestra: **"Membresía Premium Activa"** (o el plan que elegiste)
- Badge muestra: **"Premium"** (color azul)
- Ícono de membresía en color azul
- Botones visibles: **"Gestionar Membresía"** y **"Cambiar Plan"**
- Botón de refresh (🔄) al lado del título

**Logs en consola:**

```javascript
🔄 [Dashboard] Refrescando usuario desde backend...
✅ [Dashboard] Usuario refrescado desde backend
💳 [Dashboard] MembershipType from context: "premium"
✅ [Dashboard] Usando membershipType del usuario: "premium"
```

---

### **5️⃣ Si NO Aparece la Membresía**

#### **Opción A: Usar Botón de Recarga**

1. Busca el botón 🔄 al lado de "Estado de Membresía"
2. Click en el botón
3. Espera 2-3 segundos (el ícono girará)
4. La membresía debería aparecer

#### **Opción B: Verificar en Consola**

```javascript
// Ver datos del usuario
const user = JSON.parse(localStorage.getItem('user'))
console.log('👤 Usuario:', user)
console.log('💳 Membresía:', user.membershipType)
```

**Resultado esperado:**
```
💳 Membresía: "premium"  // ✅ o "basico" / "elite"
```

**Si muestra:**
```
💳 Membresía: null  // ❌
```

Entonces ejecuta:

```javascript
// Verificar respuesta del backend
const token = localStorage.getItem('accessToken')
const userId = user.idUser

fetch(`http://localhost:8080/users/${userId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => {
  console.log('📥 Respuesta del backend:', data)
  console.log('💳 MembershipType:', data.data?.membershipType)
})
```

Si el backend devuelve `membershipType: null`, el problema está en el backend.

---

## 🔍 **Debugging**

### **Ver Logs Detallados**

Abre la consola (F12) y busca estos logs:

#### **Durante el pago:**
```javascript
🔄 Creando Payment Intent...
✅ Payment Intent creado: pi_...
🔄 Confirmando pago con Stripe...
✅ Pago confirmado en Stripe
🔄 Activando membresía en backend...
📥 Respuesta de activate-membership: {...}
✅ Membresía activada exitosamente
```

#### **En página de éxito (/checkout/success):**
```javascript
⏳ Esperando 5 segundos para procesamiento...
🔄 Refrescando información del usuario...
[AuthContext] ✅ Usuario actualizado desde backend
[AuthContext] ✅ Usuario recargado exitosamente con membresía: "premium"
```

#### **En dashboard:**
```javascript
🔄 [Dashboard] Refrescando usuario desde backend...
✅ [Dashboard] Usuario refrescado desde backend
💳 [Dashboard] MembershipType from context: "premium"
✅ [Dashboard] Usando membershipType del usuario: "premium"
```

---

## 📞 **Comandos Útiles**

### **Verificar Usuario Actual**

```javascript
const user = JSON.parse(localStorage.getItem('user'))
console.table({
  'ID': user.idUser,
  'Nombre': user.name,
  'Email': user.email,
  'Membresía': user.membershipType,
  'Rol': user.role
})
```

### **Forzar Recarga del Usuario**

```javascript
// En la consola del navegador
location.reload()
```

O usa el botón 🔄 en la UI.

### **Limpiar Todo y Empezar de Nuevo**

```javascript
localStorage.clear()
sessionStorage.clear()
location.href = '/login'
```

---

## 🎯 **Checklist de Verificación**

Después de hacer el pago, verifica:

- [ ] Dashboard muestra "Membresía [Tipo] Activa"
- [ ] Badge muestra el tipo correcto (Premium/Básica/ELITE)
- [ ] Color del ícono es correcto (azul/verde/morado)
- [ ] Botón "Gestionar Membresía" está visible
- [ ] Botón "Cambiar Plan" está visible
- [ ] Botón de refresh (🔄) funciona
- [ ] Logs en consola son correctos
- [ ] `user.membershipType` en localStorage no es null

---

## ❓ **Preguntas Frecuentes**

### **¿Por qué debo limpiar localStorage?**

Para asegurarnos de que no haya datos antiguos o corruptos que interfieran con la prueba.

### **¿Cuánto tarda en aparecer la membresía?**

Debería aparecer inmediatamente después de la redirección al dashboard. Si no aparece en 3 segundos, usa el botón de refresh (🔄).

### **¿Qué hago si el botón de refresh no funciona?**

1. Verifica la consola por errores
2. Verifica que el backend esté corriendo
3. Usa el comando de debugging para verificar la respuesta del backend

### **¿Puedo usar otra tarjeta de prueba?**

Sí, puedes usar cualquier tarjeta de prueba de Stripe:
- `4242 4242 4242 4242` (éxito)
- `4000 0000 0000 9995` (insuficiente)
- `4000 0000 0000 0002` (declinada)

Más info: https://stripe.com/docs/testing

---

## 📝 **Reportar Problemas**

Si encuentras algún problema, por favor reporta:

1. **Logs de la consola** (captura de pantalla)
2. **Respuesta del backend** (de `activate-membership` y `GET /users/{id}`)
3. **Estado de localStorage** (`user.membershipType`)
4. **Pasos exactos** que seguiste

---

## ✅ **Éxito Esperado**

Al final del flujo deberías ver:

```
┌─────────────────────────────────────────┐
│  Membresía Premium Activa        [🔄]  │
│  Premium                                │
│  Incluye clases grupales y              │
│  entrenador personal - Vence: 10/10/26 │
│                                         │
│  [Gestionar Membresía] [Cambiar Plan]  │
└─────────────────────────────────────────┘
```

Con logs en consola:

```
✅ Usuario refrescado desde backend
💳 MembershipType: "premium"
✅ Usando membershipType del usuario: "premium"
```

---

**¡Listo para probar! 🚀**

Si todo funciona correctamente, el problema está resuelto. Si encuentras algún issue, usa los comandos de debugging arriba para investigar.
