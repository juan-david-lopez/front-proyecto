// Script para verificar el contenido del localStorage (ejecutar en consola del navegador)
console.log('=== FITZONE - Storage Debug ===');
console.log('');

console.log('🔑 Access Token:', localStorage.getItem('accessToken') ? '✓ Presente' : '✗ No encontrado');
console.log('🔄 Refresh Token:', localStorage.getItem('refreshToken') ? '✓ Presente' : '✗ No encontrado');
console.log('');

const userStr = localStorage.getItem('user');
if (userStr) {
  console.log('👤 User Data:');
  try {
    const user = JSON.parse(userStr);
    console.log('  - id:', user.id);
    console.log('  - idUser:', user.idUser);
    console.log('  - email:', user.email);
    console.log('  - name:', user.name);
    console.log('  - role:', user.role);
    console.log('  - userRole:', user.userRole);
    console.log('  - isActive:', user.isActive);
    console.log('  - Full object:', user);
  } catch (e) {
    console.error('  ✗ Error parseando user data:', e);
  }
} else {
  console.log('👤 User Data: ✗ No encontrado');
}

console.log('');
console.log('=== Todas las claves en localStorage ===');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(`  - ${key}: ${localStorage.getItem(key)?.substring(0, 50)}...`);
}
