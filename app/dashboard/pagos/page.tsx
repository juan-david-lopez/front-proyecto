// app/dashboard/pagos/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { receiptService } from '@/services/receiptService';
import { exportService } from '@/services/exportService';
import { TransactionSummary, TransactionStatus, TransactionType, PaymentStats } from '@/types/receipt';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Receipt,
  Mail,
  Search,
  Filter,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';
import { ExportDialog, ExportOptions } from '@/components/export-dialog';
import Link from 'next/link';

function PaymentHistoryContent() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TransactionSummary[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionSummary[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState<string>('ALL');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [transactions, searchTerm, statusFilter, typeFilter, dateRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const userId = parseInt(user!.id, 10);
      const [transactionsData, statsData] = await Promise.all([
        receiptService.getTransactionSummaries(userId),
        receiptService.getPaymentStats(userId)
      ]);
      setTransactions(transactionsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.membershipType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    // Filtro por tipo
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    // Filtro por rango de fecha
    if (dateRange !== 'ALL') {
      const now = new Date();
      const startDate = new Date();

      switch (dateRange) {
        case 'LAST_MONTH':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'LAST_3_MONTHS':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'LAST_6_MONTHS':
          startDate.setMonth(now.getMonth() - 6);
          break;
        case 'LAST_YEAR':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(t => new Date(t.date) >= startDate);
    }

    setFilteredTransactions(filtered);
  };

  const handleExport = async (options: ExportOptions) => {
    try {
      // Exportar transacciones filtradas
      exportService.exportTransactions(filteredTransactions, {
        format: options.format,
        includeHeaders: options.includeHeaders,
      });

      // Opcionalmente también exportar estadísticas
      if (options.includeStats && stats) {
        exportService.exportStats(stats, {
          format: 'json',
        });
      }
    } catch (error) {
      console.error('Error al exportar:', error);
      throw error; // Re-lanzar para que el diálogo lo maneje
    }
  };

  const getStatusBadge = (status: TransactionStatus) => {
    const configs = {
      [TransactionStatus.COMPLETED]: {
        variant: 'default' as const,
        icon: CheckCircle2,
        label: 'Completado',
        className: 'bg-green-100 text-green-800'
      },
      [TransactionStatus.PENDING]: {
        variant: 'secondary' as const,
        icon: Clock,
        label: 'Pendiente',
        className: 'bg-yellow-100 text-yellow-800'
      },
      [TransactionStatus.FAILED]: {
        variant: 'destructive' as const,
        icon: XCircle,
        label: 'Fallido',
        className: 'bg-red-100 text-red-800'
      },
      [TransactionStatus.REFUNDED]: {
        variant: 'outline' as const,
        icon: RefreshCw,
        label: 'Reembolsado',
        className: 'bg-blue-100 text-blue-800'
      },
      [TransactionStatus.CANCELLED]: {
        variant: 'outline' as const,
        icon: XCircle,
        label: 'Cancelado',
        className: 'bg-gray-100 text-gray-800'
      }
    };

    const config = configs[status];
    const Icon = config.icon;

    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getTransactionTypeName = (type: TransactionType): string => {
    const names = {
      [TransactionType.MEMBERSHIP_PURCHASE]: 'Compra',
      [TransactionType.MEMBERSHIP_RENEWAL]: 'Renovación',
      [TransactionType.MEMBERSHIP_UPGRADE]: 'Upgrade',
      [TransactionType.REFUND]: 'Reembolso',
      [TransactionType.ADJUSTMENT]: 'Ajuste'
    };
    return names[type] || type;
  };

  const formatCurrency = (amount: number, currency: string = 'COP'): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial de pagos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Historial de Pagos</h1>
        <p className="text-gray-600">Gestiona y consulta todas tus transacciones</p>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Pagado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalAmount)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Transacciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-blue-600" />
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalTransactions}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Exitosas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <p className="text-2xl font-bold text-gray-900">
                  {stats.successfulTransactions}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-orange-600" />
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.averageTransactionAmount)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
            
            {/* Botón de exportación */}
            <ExportDialog
              onExport={handleExport}
              recordCount={filteredTransactions.length}
              disabled={loading}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por número o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtro por estado */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los estados</SelectItem>
                <SelectItem value={TransactionStatus.COMPLETED}>Completado</SelectItem>
                <SelectItem value={TransactionStatus.PENDING}>Pendiente</SelectItem>
                <SelectItem value={TransactionStatus.FAILED}>Fallido</SelectItem>
                <SelectItem value={TransactionStatus.REFUNDED}>Reembolsado</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro por tipo */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los tipos</SelectItem>
                <SelectItem value={TransactionType.MEMBERSHIP_PURCHASE}>Compra</SelectItem>
                <SelectItem value={TransactionType.MEMBERSHIP_RENEWAL}>Renovación</SelectItem>
                <SelectItem value={TransactionType.MEMBERSHIP_UPGRADE}>Upgrade</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro por fecha */}
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todo el tiempo</SelectItem>
                <SelectItem value="LAST_MONTH">Último mes</SelectItem>
                <SelectItem value="LAST_3_MONTHS">Últimos 3 meses</SelectItem>
                <SelectItem value="LAST_6_MONTHS">Últimos 6 meses</SelectItem>
                <SelectItem value="LAST_YEAR">Último año</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de transacciones */}
      {filteredTransactions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron transacciones
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL' || dateRange !== 'ALL'
                ? 'Intenta ajustar los filtros'
                : 'Aún no has realizado ninguna transacción'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Info principal */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-100">
                        <Receipt className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <Link
                          href={`/dashboard/pagos/${transaction.id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors"
                        >
                          {transaction.receiptNumber}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            {formatDate(transaction.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 ml-13">
                      {getStatusBadge(transaction.status)}
                      <Badge variant="outline">
                        {getTransactionTypeName(transaction.type)}
                      </Badge>
                      <Badge variant="secondary">
                        {transaction.membershipType}
                      </Badge>
                    </div>
                  </div>

                  {/* Monto y acciones */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {transaction.paymentMethod.replace('_', ' ')}
                      </p>
                    </div>
                    <Link href={`/dashboard/pagos/${transaction.id}`}>
                      <Button variant="outline" size="sm">
                        Ver Detalle
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PaymentHistoryPage() {
  return (
    <AuthGuard>
      <PaymentHistoryContent />
    </AuthGuard>
  );
}
