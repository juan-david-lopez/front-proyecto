'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { receiptService } from '@/services/receiptService';
import { membershipManagementService } from '@/services/membershipManagementService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Users,
  DollarSign,
  CreditCard,
  Calendar,
  Download,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';

// Colores para los gráficos
const COLORS = {
  primary: '#ea580c', // orange-600
  secondary: '#f97316', // orange-500
  success: '#22c55e', // green-500
  info: '#3b82f6', // blue-500
  warning: '#eab308', // yellow-500
  danger: '#ef4444', // red-500
};

const CHART_COLORS = ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa'];

interface MonthlyRevenue {
  month: string;
  revenue: number;
  transactions: number;
}

interface MembershipStats {
  type: string;
  count: number;
  percentage: number;
}

interface PaymentMethodStats {
  method: string;
  amount: number;
  count: number;
}

interface RenewalStats {
  period: string;
  renewals: number;
  total: number;
  rate: number;
}

function AdminReportsContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  
  // Datos de los reportes
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [membershipStats, setMembershipStats] = useState<MembershipStats[]>([]);
  const [paymentMethodStats, setPaymentMethodStats] = useState<PaymentMethodStats[]>([]);
  const [renewalStats, setRenewalStats] = useState<RenewalStats[]>([]);
  
  // Estadísticas generales
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [avgTransactionValue, setAvgTransactionValue] = useState(0);
  const [renewalRate, setRenewalRate] = useState(0);

  useEffect(() => {
    if (user) {
      loadReports();
    }
  }, [user, period]);

  const loadReports = async () => {
    try {
      setLoading(true);
      
      // Cargar datos desde el backend
      // Por ahora usaremos datos de demostración
      await loadDemoData();
      
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = async () => {
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Ingresos mensuales
    setMonthlyRevenue([
      { month: 'Ene', revenue: 15000000, transactions: 60 },
      { month: 'Feb', revenue: 18000000, transactions: 72 },
      { month: 'Mar', revenue: 22000000, transactions: 88 },
      { month: 'Abr', revenue: 20000000, transactions: 80 },
      { month: 'May', revenue: 25000000, transactions: 100 },
      { month: 'Jun', revenue: 28000000, transactions: 112 },
      { month: 'Jul', revenue: 30000000, transactions: 120 },
      { month: 'Ago', revenue: 27000000, transactions: 108 },
      { month: 'Sep', revenue: 32000000, transactions: 128 },
      { month: 'Oct', revenue: 35000000, transactions: 140 },
    ]);

    // Membresías por tipo
    setMembershipStats([
      { type: 'Básico', count: 450, percentage: 45 },
      { type: 'Premium', count: 350, percentage: 35 },
      { type: 'Elite', count: 200, percentage: 20 },
    ]);

    // Métodos de pago
    setPaymentMethodStats([
      { method: 'Tarjeta de Crédito', amount: 120000000, count: 480 },
      { method: 'Tarjeta de Débito', amount: 85000000, count: 340 },
      { method: 'PSE', amount: 45000000, count: 180 },
      { method: 'Transferencia', amount: 30000000, count: 120 },
      { method: 'Efectivo', amount: 20000000, count: 80 },
    ]);

    // Tasa de renovación
    setRenewalStats([
      { period: 'Ene-Mar', renewals: 145, total: 180, rate: 80.6 },
      { period: 'Abr-Jun', renewals: 165, total: 200, rate: 82.5 },
      { period: 'Jul-Sep', renewals: 185, total: 220, rate: 84.1 },
      { period: 'Oct-Dic', renewals: 195, total: 230, rate: 84.8 },
    ]);

    // Estadísticas generales
    setTotalRevenue(300000000);
    setTotalMembers(1000);
    setAvgTransactionValue(250000);
    setRenewalRate(83.5);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reportes Administrativos</h1>
          <p className="text-gray-600">Análisis detallado de ingresos, membresías y rendimiento</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Mensual</SelectItem>
              <SelectItem value="quarterly">Trimestral</SelectItem>
              <SelectItem value="yearly">Anual</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={loadReports}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          
          <Button className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-green-600 mt-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +12.5% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Miembros Activos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalMembers}</p>
              </div>
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-blue-600 mt-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +8.3% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ticket Promedio</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(avgTransactionValue)}
                </p>
              </div>
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-orange-100">
                <CreditCard className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-orange-600 mt-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +5.2% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasa de Renovación</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{renewalRate}%</p>
              </div>
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100">
                <RefreshCw className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-purple-600 mt-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +2.1% vs mes anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Ingresos Mensuales */}
        <Card>
          <CardHeader>
            <CardTitle>Ingresos Mensuales</CardTitle>
            <CardDescription>Evolución de ingresos en los últimos 10 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: '#374151' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Ingresos"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  dot={{ fill: COLORS.primary, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Membresías por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle>Membresías por Tipo</CardTitle>
            <CardDescription>Distribución de miembros según plan</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={membershipStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percentage }) => `${type}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {membershipStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos secundarios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingresos por Método de Pago */}
        <Card>
          <CardHeader>
            <CardTitle>Ingresos por Método de Pago</CardTitle>
            <CardDescription>Distribución de ingresos según medio de pago</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentMethodStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="method" angle={-15} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: '#374151' }}
                />
                <Legend />
                <Bar dataKey="amount" name="Monto" fill={COLORS.secondary} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tasa de Renovación */}
        <Card>
          <CardHeader>
            <CardTitle>Tasa de Renovación</CardTitle>
            <CardDescription>Porcentaje de renovaciones por trimestre</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={renewalStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                  labelStyle={{ color: '#374151' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rate"
                  name="Tasa de Renovación (%)"
                  stroke={COLORS.success}
                  strokeWidth={2}
                  dot={{ fill: COLORS.success, r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminReportsPage() {
  return (
    <AuthGuard>
      <AdminReportsContent />
    </AuthGuard>
  );
}
