/**
 * Script de diagnóstico para verificar configuración de API
 * Ejecutar en DevTools Console para debug
 */

console.log('=== 🔍 DIAGNÓSTICO DE CONFIGURACIÓN API ===\n');

// 1. Verificar variable de entorno
console.log('1️⃣  NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL || 'NO CONFIGURADA');

// 2. Verificar NODE_ENV
console.log('2️⃣  NODE_ENV:', process.env.NODE_ENV || 'NO DEFINIDO');

// 3. Verificar window.location
if (typeof window !== 'undefined') {
  console.log('3️⃣  window.location.hostname:', window.location.hostname);
  console.log('4️⃣  window.location.href:', window.location.href);
}

// 5. Verificar API_CONFIG
import { API_CONFIG } from '@/lib/api-config';
console.log('5️⃣  API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);

// 6. Verificar que URLs tienen /api
const hasApi = API_CONFIG.BASE_URL.includes('/api');
console.log('6️⃣  ¿URL contiene /api?:', hasApi ? '✅ SÍ' : '❌ NO');

// 7. URL esperada en Vercel
console.log('\n📋 CONFIGURACIÓN ESPERADA EN VERCEL:');
console.log('   NEXT_PUBLIC_API_URL=https://repositoriodesplieguefitzone.onrender.com/api');
console.log('   (IMPORTANTE: incluir /api al final)');

// 8. Test de request
console.log('\n🧪 TEST DE REQUEST:');
console.log('   Intentando GET a:', `${API_CONFIG.BASE_URL}/health`);

fetch(`${API_CONFIG.BASE_URL}/health`)
  .then(r => {
    console.log('   ✅ Response status:', r.status);
    return r.json();
  })
  .then(data => console.log('   ✅ Response data:', data))
  .catch(e => console.log('   ❌ Error:', e.message));

console.log('\n=== FIN DIAGNÓSTICO ===');
