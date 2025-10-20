/**
 * 🔍 VERIFICADOR DE LOGOUT - Script para DevTools Console
 * 
 * Copia todo el código y pégalo en la consola del navegador (F12)
 * para verificar el estado de la autenticación y logout
 */

// ============================================================================
// 1️⃣ VERIFICAR ESTADO DE localStorage ANTES DE LOGOUT
// ============================================================================
function checkAuthBeforeLogout() {
  console.log("🔍 ESTADO DE AUTENTICACIÓN - ANTES DE LOGOUT\n");
  
  const keys = [
    "accessToken",
    "refreshToken",
    "fitzone_token",
    "fitzone_user",
    "auth_token",
    "jwt_token",
    "token",
    "user",
    "user_id",
    "user_email",
    "authentication_time",
    "pendingLogin"
  ];

  console.log("📦 localStorage status:");
  console.log(`   Total items: ${localStorage.length}\n`);

  keys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      const preview = value.substring(0, 50);
      console.log(`✅ ${key}: ${preview}${value.length > 50 ? "..." : ""}`);
    } else {
      console.log(`❌ ${key}: (vacío)`);
    }
  });

  console.log(`\n📊 sessionStorage items: ${sessionStorage.length}`);
  if (sessionStorage.length > 0) {
    console.log("Contenido:");
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      console.log(`  - ${key}: ${sessionStorage.getItem(key)?.substring(0, 30)}...`);
    }
  }
}

// ============================================================================
// 2️⃣ VERIFICAR ESTADO DE localStorage DESPUÉS DE LOGOUT
// ============================================================================
function checkAuthAfterLogout() {
  console.log("\n🔍 ESTADO DE AUTENTICACIÓN - DESPUÉS DE LOGOUT\n");
  
  const keys = [
    "accessToken",
    "refreshToken",
    "fitzone_token",
    "fitzone_user",
    "auth_token",
    "jwt_token",
    "token",
    "user",
    "user_id",
    "user_email",
    "authentication_time",
    "pendingLogin"
  ];

  console.log("📦 localStorage status:");
  console.log(`   Total items: ${localStorage.length}\n`);

  let cleanCount = 0;
  keys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      console.log(`❌ ${key}: AÚN EXISTE (${value.substring(0, 30)}...)`);
    } else {
      console.log(`✅ ${key}: limpio`);
      cleanCount++;
    }
  });

  console.log(`\n📊 Verificación:`);
  console.log(`   ✅ Limpios: ${cleanCount}/${keys.length}`);
  console.log(`   localStorage.length: ${localStorage.length}`);

  if (localStorage.length === 0) {
    console.log("\n✅✅✅ LOGOUT EXITOSO - localStorage COMPLETAMENTE LIMPIO");
  } else {
    console.warn(`\n⚠️ localStorage aún contiene ${localStorage.length} items`);
  }

  console.log(`\n📊 sessionStorage items: ${sessionStorage.length}`);
  if (sessionStorage.length > 0) {
    console.warn("⚠️ sessionStorage no está limpio:");
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      console.log(`  ❌ ${key}: ${sessionStorage.getItem(key)?.substring(0, 30)}...`);
    }
  } else {
    console.log("✅ sessionStorage limpio");
  }
}

// ============================================================================
// 3️⃣ VERIFICAR SI EL USUARIO ESTÁ AUTENTICADO
// ============================================================================
function isUserAuthenticated() {
  console.log("\n🔐 VERIFICACIÓN DE AUTENTICACIÓN\n");
  
  const token = localStorage.getItem("accessToken");
  const user = localStorage.getItem("user");
  
  console.log(`📝 Token presente: ${token ? "✅ SÍ" : "❌ NO"}`);
  console.log(`👤 User presente: ${user ? "✅ SÍ" : "❌ NO"}`);
  
  if (token && user) {
    console.log("\n✅ USUARIO AUTENTICADO");
    try {
      const userData = JSON.parse(user);
      console.log(`   Email: ${userData.email}`);
      console.log(`   ID: ${userData.id}`);
    } catch (e) {
      console.log("   (No se pudo parsear user data)");
    }
    return true;
  } else {
    console.log("\n❌ USUARIO NO AUTENTICADO");
    return false;
  }
}

// ============================================================================
// 4️⃣ FORZAR LIMPIEZA MANUAL (en caso de que logout no funcione)
// ============================================================================
function forceLogoutCleanup() {
  console.log("\n🧹 FORZANDO LIMPIEZA MANUAL...\n");
  
  // Limpiar localStorage
  const keys = [
    "accessToken", "refreshToken", "fitzone_token", "fitzone_user",
    "auth_token", "jwt_token", "token", "user", "user_id", 
    "user_email", "authentication_time", "pendingLogin", "loginForm"
  ];
  
  keys.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`✅ Removido: ${key}`);
    }
  });
  
  // Limpiar sessionStorage
  sessionStorage.clear();
  console.log(`✅ sessionStorage limpiado`);
  
  // Verificar limpieza
  console.log(`\n📊 Resultado:`);
  console.log(`   localStorage.length: ${localStorage.length}`);
  console.log(`   sessionStorage.length: ${sessionStorage.length}`);
  
  if (localStorage.length === 0) {
    console.log("\n✅ LIMPIEZA COMPLETADA EXITOSAMENTE");
  }
  
  // Redirigir
  console.log("\n🔄 Redirigiendo a /login...");
  setTimeout(() => {
    window.location.href = '/login?logout=true&t=' + Date.now();
  }, 1000);
}

// ============================================================================
// 5️⃣ MONITOREAR CAMBIOS EN localStorage EN TIEMPO REAL
// ============================================================================
function monitorLocalStorage() {
  console.log("\n📊 MONITOREANDO localStorage EN TIEMPO REAL\n");
  console.log("(Esto mostrará cambios en localStorage conforme ocurran)\n");
  
  const originalSetItem = Storage.prototype.setItem;
  const originalRemoveItem = Storage.prototype.removeItem;
  const originalClear = Storage.prototype.clear;

  Storage.prototype.setItem = function(key, value) {
    console.log(`[MONITOR] ➕ SETITEM: ${key} = ${value?.substring(0, 30)}...`);
    return originalSetItem.call(this, key, value);
  };

  Storage.prototype.removeItem = function(key) {
    console.log(`[MONITOR] ➖ REMOVEITEM: ${key}`);
    return originalRemoveItem.call(this, key);
  };

  Storage.prototype.clear = function() {
    console.log(`[MONITOR] 🧹 CLEAR: localStorage borrado completamente`);
    return originalClear.call(this);
  };

  console.log("✅ Monitor activado. Ahora haz click en logout y verás todos los cambios.");
  console.log("   Escribe: monitorLocalStorageStop() para detener el monitoreo");
}

// Función para detener el monitoreo
function monitorLocalStorageStop() {
  location.reload();
  console.log("Monitor detenido y página recargada");
}

// ============================================================================
// 6️⃣ TEST COMPLETO DE LOGOUT (TODO DE UNA VEZ)
// ============================================================================
function testLogoutComplete() {
  console.clear();
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║         🧪 TEST COMPLETO DE LOGOUT - INICIANDO           ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  console.log("📋 PASO 1: Verificando estado ANTES de logout\n");
  checkAuthBeforeLogout();

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("⏳ Ahora haz click en el botón 'Cerrar sesión'\n");
  console.log("Después, ejecuta: testLogoutAfter()\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

function testLogoutAfter() {
  console.clear();
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║      🧪 TEST COMPLETO DE LOGOUT - VERIFICANDO RESULTADO   ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  console.log("📋 PASO 2: Verificando estado DESPUÉS de logout\n");
  checkAuthAfterLogout();

  console.log("\n📋 PASO 3: Verificando autenticación\n");
  isUserAuthenticated();

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("✅ TEST COMPLETADO\n");
  console.log("Si ves todos los checkmarks verdes (✅), el logout funcionó correctamente.\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

// ============================================================================
// 7️⃣ VERIFICAR ACCESO A RUTAS PROTEGIDAS
// ============================================================================
function testProtectedRoutes() {
  console.log("\n🔐 VERIFICANDO ACCESO A RUTAS PROTEGIDAS\n");
  
  const routes = [
    "/dashboard",
    "/perfil",
    "/reservas",
    "/membresias",
    "/fidelizacion"
  ];
  
  const isAuth = !!localStorage.getItem("accessToken");
  
  console.log(`Estado de autenticación: ${isAuth ? "✅ AUTENTICADO" : "❌ NO AUTENTICADO"}\n`);
  
  routes.forEach(route => {
    if (isAuth) {
      console.log(`✅ ${route} - Debería permitir acceso`);
    } else {
      console.log(`🔒 ${route} - Debería redirigir a /login`);
    }
  });
  
  console.log("\n📝 Para probar, escribe:");
  console.log("   window.location.href = '/dashboard'");
}

// ============================================================================
// 🎯 MENÚ PRINCIPAL DE AYUDA
// ============================================================================
function logoutDebugHelp() {
  console.clear();
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║          🔍 VERIFICADOR DE LOGOUT - MENÚ DE AYUDA            ║
╚════════════════════════════════════════════════════════════════╝

📋 FUNCIONES DISPONIBLES:

1️⃣  checkAuthBeforeLogout()
    → Ver estado de localStorage ANTES de hacer logout
    → Uso: checkAuthBeforeLogout()

2️⃣  checkAuthAfterLogout()
    → Ver estado de localStorage DESPUÉS de hacer logout
    → Uso: checkAuthAfterLogout()

3️⃣  isUserAuthenticated()
    → Verificar si el usuario está autenticado
    → Uso: isUserAuthenticated()

4️⃣  forceLogoutCleanup()
    → Forzar limpieza manual (en caso de que no funcione)
    → Uso: forceLogoutCleanup()

5️⃣  monitorLocalStorage()
    → Monitorear cambios en localStorage EN TIEMPO REAL
    → Uso: monitorLocalStorage()
    → Detener: monitorLocalStorageStop()

6️⃣  testLogoutComplete()
    → TEST COMPLETO (paso 1)
    → Uso: testLogoutComplete()
    → Luego haz click en Cerrar sesión
    → Finalmente ejecuta: testLogoutAfter()

7️⃣  testProtectedRoutes()
    → Verificar acceso a rutas protegidas
    → Uso: testProtectedRoutes()

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 INICIO RÁPIDO:

  Opción 1 - Test Completo (RECOMENDADO):
    1. Ejecuta: testLogoutComplete()
    2. Haz click en "Cerrar sesión"
    3. Ejecuta: testLogoutAfter()

  Opción 2 - Monitoreo en Tiempo Real:
    1. Ejecuta: monitorLocalStorage()
    2. Haz click en "Cerrar sesión"
    3. Observa los cambios en la consola

  Opción 3 - Verificación Manual:
    1. Ejecuta: checkAuthBeforeLogout()
    2. Haz click en "Cerrar sesión"
    3. Ejecuta: checkAuthAfterLogout()

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 TIPS:
  • Abre DevTools con F12 o Ctrl+Shift+I
  • Ve a la pestaña "Console"
  • Copia y pega cualquier función arriba
  • Presiona Enter para ejecutarla

❓ ¿NO FUNCIONAN LOS COMANDOS?
  • Asegúrate de estar en la pestaña "Console"
  • No en Sources, Network, o Application
  • Si aún no funcionan, actualiza la página (F5)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}

// Mostrar menú al cargar
console.log("\n🔍 VERIFICADOR DE LOGOUT CARGADO\n");
console.log("Escribe: logoutDebugHelp()\n");
console.log("O ejecuta directamente: testLogoutComplete()\n");

// Exportar funciones al window para acceso global
window.checkAuthBeforeLogout = checkAuthBeforeLogout;
window.checkAuthAfterLogout = checkAuthAfterLogout;
window.isUserAuthenticated = isUserAuthenticated;
window.forceLogoutCleanup = forceLogoutCleanup;
window.monitorLocalStorage = monitorLocalStorage;
window.monitorLocalStorageStop = monitorLocalStorageStop;
window.testLogoutComplete = testLogoutComplete;
window.testLogoutAfter = testLogoutAfter;
window.testProtectedRoutes = testProtectedRoutes;
window.logoutDebugHelp = logoutDebugHelp;

console.log("✅ Todas las funciones están disponibles en window");
