// utils/apiTester.ts
/**
 * Utilidad para testing manual de la integración Frontend-Backend
 * Usar en DevTools Console del navegador
 */

class ApiTester {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = this.getBaseURL();
    this.token = localStorage.getItem('accessToken');
    console.log('🔧 ApiTester inicializado');
    console.log('📡 Base URL:', this.baseURL);
    console.log('🔐 Token:', this.token ? '✅ Presente' : '❌ No encontrado');
  }

  private getBaseURL(): string {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return 'http://localhost:8080';
    }
    return 'https://desplieguefitzone.onrender.com';
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}/api/v1${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` })
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    };

    console.log(`🔄 ${config.method || 'GET'} ${url}`);
    console.log('📦 Headers:', config.headers);
    
    if (config.body) {
      console.log('📦 Body:', config.body);
    }

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type');
      
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (response.ok) {
        console.log(`✅ ${response.status} ${response.statusText}`);
        console.log('📦 Response:', data);
        return { success: true, status: response.status, data };
      } else {
        console.error(`❌ ${response.status} ${response.statusText}`);
        console.error('📦 Error:', data);
        return { success: false, status: response.status, error: data };
      }
    } catch (error) {
      console.error('💥 Network Error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // ======================
  // TESTING DE ENDPOINTS
  // ======================

  // Health Check
  async testHealth() {
    console.log('\n🏥 Testing Health Check...');
    return await this.request('/health');
  }

  // Autenticación
  async testLogin(email: string, password: string) {
    console.log('\n🔐 Testing Login...');
    return await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  // Recibos
  async testCreateReceipt(receiptData: any) {
    console.log('\n🧾 Testing Create Receipt...');
    return await this.request('/receipts', {
      method: 'POST',
      body: JSON.stringify(receiptData)
    });
  }

  async testGetUserReceipts(userId: string) {
    console.log('\n🧾 Testing Get User Receipts...');
    return await this.request(`/users/${userId}/receipts`);
  }

  async testGetReceiptById(receiptId: string) {
    console.log('\n🧾 Testing Get Receipt By ID...');
    return await this.request(`/receipts/${receiptId}`);
  }

  // Notificaciones
  async testGetNotifications(userId: string) {
    console.log('\n🔔 Testing Get Notifications...');
    return await this.request(`/notifications/${userId}`);
  }

  async testCreateNotification(notificationData: any) {
    console.log('\n🔔 Testing Create Notification...');
    return await this.request('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData)
    });
  }

  async testMarkAsRead(notificationId: string) {
    console.log('\n🔔 Testing Mark Notification as Read...');
    return await this.request(`/notifications/${notificationId}/read`, {
      method: 'PATCH'
    });
  }

  // Auto-Renovación
  async testGetAutoRenewalPreferences(userId: string) {
    console.log('\n🔄 Testing Get Auto-Renewal Preferences...');
    return await this.request(`/users/${userId}/membership/auto-renewal-preferences`);
  }

  async testUpdateAutoRenewalPreferences(userId: string, preferences: any) {
    console.log('\n🔄 Testing Update Auto-Renewal Preferences...');
    return await this.request(`/users/${userId}/membership/auto-renewal-preferences`, {
      method: 'PUT',
      body: JSON.stringify(preferences)
    });
  }

  async testCheckExpiration(userId: string) {
    console.log('\n🔄 Testing Check Expiration...');
    return await this.request(`/users/${userId}/membership/check-expiration`);
  }

  async testProcessAutoRenewal(userId: string) {
    console.log('\n🔄 Testing Process Auto-Renewal...');
    return await this.request(`/users/${userId}/membership/auto-renew`, {
      method: 'POST'
    });
  }

  // Reportes Administrativos
  async testGetKPIs(period = 'monthly') {
    console.log('\n📊 Testing Get KPIs...');
    return await this.request(`/admin/reports/kpis?period=${period}`);
  }

  async testGetRevenueReport(period = 'monthly') {
    console.log('\n📊 Testing Get Revenue Report...');
    return await this.request(`/admin/reports/revenue?period=${period}`);
  }

  async testGetMembershipStats() {
    console.log('\n📊 Testing Get Membership Stats...');
    return await this.request('/admin/reports/memberships');
  }

  async testGetPaymentMethodStats() {
    console.log('\n📊 Testing Get Payment Method Stats...');
    return await this.request('/admin/reports/payment-methods');
  }

  async testGetRenewalStats() {
    console.log('\n📊 Testing Get Renewal Stats...');
    return await this.request('/admin/reports/renewals');
  }

  async testGetDashboard() {
    console.log('\n📊 Testing Get Admin Dashboard...');
    return await this.request('/admin/reports/dashboard');
  }

  // ===================
  // TESTS INTEGRALES
  // ===================

  async runBasicTests(userId: string) {
    console.log('\n🚀 Ejecutando tests básicos...');
    
    const results = {
      health: await this.testHealth(),
      receipts: await this.testGetUserReceipts(userId),
      notifications: await this.testGetNotifications(userId),
      autoRenewal: await this.testGetAutoRenewalPreferences(userId)
    };

    console.log('\n📊 Resumen de tests básicos:');
    Object.entries(results).forEach(([test, result]) => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${test}: ${result.status || 'Error'}`);
    });

    return results;
  }

  async runAdminTests() {
    console.log('\n👑 Ejecutando tests de admin...');
    
    const results = {
      kpis: await this.testGetKPIs(),
      revenue: await this.testGetRevenueReport(),
      memberships: await this.testGetMembershipStats(),
      paymentMethods: await this.testGetPaymentMethodStats(),
      renewals: await this.testGetRenewalStats(),
      dashboard: await this.testGetDashboard()
    };

    console.log('\n📊 Resumen de tests de admin:');
    Object.entries(results).forEach(([test, result]) => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${test}: ${result.status || 'Error'}`);
    });

    return results;
  }

  async runFullIntegrationTest(userId: string) {
    console.log('\n🎯 Ejecutando test completo de integración...');
    
    // Test 1: Health
    const health = await this.testHealth();
    if (!health.success) {
      console.error('💥 Backend no disponible. Abortando tests.');
      return;
    }

    // Test 2: Datos básicos
    const basic = await this.runBasicTests(userId);
    
    // Test 3: Crear datos de prueba
    console.log('\n🧪 Creando datos de prueba...');
    
    const testReceipt = await this.testCreateReceipt({
      userId,
      transactionType: 'MEMBERSHIP_PAYMENT',
      amount: 250000,
      paymentMethod: 'CREDIT_CARD',
      membershipType: 'PREMIUM',
      membershipDuration: 30,
      notes: 'Test receipt from ApiTester'
    });

    const testNotification = await this.testCreateNotification({
      userId,
      type: 'EXPIRATION_WARNING',
      priority: 'HIGH',
      title: 'Test Notification',
      message: 'This is a test notification from ApiTester'
    });

    // Test 4: Admin (si tienes permisos)
    const admin = await this.runAdminTests();

    console.log('\n🎉 Test completo finalizado!');
    
    return {
      health,
      basic,
      testReceipt,
      testNotification,
      admin
    };
  }

  // =================
  // DATOS DE PRUEBA
  // =================

  getSampleReceiptData(userId: string) {
    return {
      userId,
      transactionType: 'MEMBERSHIP_PAYMENT',
      amount: 250000,
      tax: 47500,
      total: 297500,
      paymentMethod: 'CREDIT_CARD',
      membershipType: 'PREMIUM',
      membershipDuration: 30,
      notes: 'Pago de membresía Premium - Testing'
    };
  }

  getSampleNotificationData(userId: string) {
    return {
      userId,
      type: 'EXPIRATION_WARNING',
      priority: 'HIGH',
      title: 'Tu membresía está por vencer',
      message: 'Tu membresía Premium vence en 7 días. Renueva ahora para mantener tus beneficios.',
      metadata: {
        daysUntilExpiry: 7,
        membershipType: 'PREMIUM'
      }
    };
  }

  getSampleAutoRenewalPreferences() {
    return {
      enabled: true,
      notificationDays: 7,
      paymentMethod: 'CREDIT_CARD'
    };
  }

  // ================
  // UTILIDADES
  // ================

  refreshToken() {
    this.token = localStorage.getItem('accessToken');
    console.log('🔄 Token actualizado:', this.token ? '✅ Presente' : '❌ No encontrado');
  }

  setCustomToken(token: string) {
    this.token = token;
    localStorage.setItem('accessToken', token);
    console.log('🔐 Token personalizado configurado');
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('accessToken');
    console.log('🗑️ Token eliminado');
  }

  showInstructions() {
    console.log(`
🔧 ApiTester - Instrucciones de Uso

📋 Configuración:
   const tester = new ApiTester();

🔐 Autenticación:
   await tester.testLogin('user@fitzone.com', 'password123');
   tester.refreshToken(); // Actualizar token después del login

🧪 Tests individuales:
   await tester.testHealth();
   await tester.testGetUserReceipts('user-id');
   await tester.testCreateReceipt(tester.getSampleReceiptData('user-id'));

🚀 Tests completos:
   await tester.runBasicTests('user-id');
   await tester.runAdminTests();
   await tester.runFullIntegrationTest('user-id');

📊 Datos de prueba:
   tester.getSampleReceiptData('user-id');
   tester.getSampleNotificationData('user-id');
   tester.getSampleAutoRenewalPreferences();

🔧 Utilidades:
   tester.refreshToken();
   tester.setCustomToken('your-jwt-token');
   tester.clearToken();
    `);
  }
}

// Hacer disponible globalmente para uso en console
if (typeof window !== 'undefined') {
  (window as any).ApiTester = ApiTester;
  (window as any).apiTester = new ApiTester();
  
  console.log('🎉 ApiTester cargado!');
  console.log('💡 Usa "apiTester" en console o crea nueva instancia: new ApiTester()');
  console.log('📖 Para ver instrucciones: apiTester.showInstructions()');
}

export default ApiTester;