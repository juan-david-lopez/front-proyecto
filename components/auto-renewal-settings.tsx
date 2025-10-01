// components/auto-renewal-settings.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { membershipManagementService } from '@/services/membershipManagementService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RefreshCw, Bell, CreditCard, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface AutoRenewalPreferences {
  autoRenewalEnabled: boolean;
  notificationDays: number;
  paymentMethod?: string;
}

export function AutoRenewalSettings() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<AutoRenewalPreferences>({
    autoRenewalEnabled: false,
    notificationDays: 7,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const prefs = await membershipManagementService.getAutoRenewalPreferences(
        parseInt(user!.id, 10)
      );
      setPreferences(prefs);
    } catch (error) {
      console.error('Error al cargar preferencias:', error);
      showMessage('error', 'Error al cargar preferencias');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const success = await membershipManagementService.updateAutoRenewalPreferences(
        parseInt(user!.id, 10),
        preferences
      );

      if (success) {
        showMessage('success', 'Preferencias guardadas exitosamente');
      } else {
        showMessage('error', 'Error al guardar preferencias');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', 'Error al guardar preferencias');
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600 mb-4" />
            <p className="text-gray-600">Cargando configuración...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-orange-100">
            <RefreshCw className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <CardTitle>Renovación Automática</CardTitle>
            <CardDescription>
              Configura la renovación automática de tu membresía
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Mensaje de feedback */}
        {message && (
          <div
            className={`flex items-center gap-3 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        {/* Habilitar auto-renovación */}
        <div className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 bg-gray-50">
          <Checkbox
            id="autoRenewal"
            checked={preferences.autoRenewalEnabled}
            onCheckedChange={(checked) =>
              setPreferences({ ...preferences, autoRenewalEnabled: checked as boolean })
            }
          />
          <div className="flex-1">
            <label
              htmlFor="autoRenewal"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Activar renovación automática
            </label>
            <p className="text-sm text-gray-600 mt-1">
              Tu membresía se renovará automáticamente antes de vencer para que no pierdas acceso
              al gimnasio.
            </p>
          </div>
        </div>

        {/* Días de notificación */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-gray-600" />
            <Label htmlFor="notificationDays" className="text-base">
              Recordatorio de renovación
            </Label>
          </div>
          <Select
            value={preferences.notificationDays.toString()}
            onValueChange={(value) =>
              setPreferences({ ...preferences, notificationDays: parseInt(value, 10) })
            }
            disabled={!preferences.autoRenewalEnabled}
          >
            <SelectTrigger id="notificationDays">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 días antes</SelectItem>
              <SelectItem value="5">5 días antes</SelectItem>
              <SelectItem value="7">7 días antes (recomendado)</SelectItem>
              <SelectItem value="10">10 días antes</SelectItem>
              <SelectItem value="14">14 días antes</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-600">
            Recibirás una notificación {preferences.notificationDays} días antes de que tu
            membresía venza.
          </p>
        </div>

        {/* Método de pago */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-gray-600" />
            <Label htmlFor="paymentMethod" className="text-base">
              Método de pago predeterminado
            </Label>
          </div>
          <Select
            value={preferences.paymentMethod || 'none'}
            onValueChange={(value) =>
              setPreferences({
                ...preferences,
                paymentMethod: value === 'none' ? undefined : value,
              })
            }
            disabled={!preferences.autoRenewalEnabled}
          >
            <SelectTrigger id="paymentMethod">
              <SelectValue placeholder="Seleccionar método de pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Seleccionar al renovar</SelectItem>
              <SelectItem value="CREDIT_CARD">Tarjeta de Crédito</SelectItem>
              <SelectItem value="DEBIT_CARD">Tarjeta de Débito</SelectItem>
              <SelectItem value="PSE">PSE</SelectItem>
              <SelectItem value="TRANSFER">Transferencia Bancaria</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-600">
            {preferences.paymentMethod
              ? 'Este método se usará para renovaciones automáticas'
              : 'Deberás seleccionar el método al momento de renovar'}
          </p>
        </div>

        {/* Información adicional */}
        {preferences.autoRenewalEnabled && (
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900">
                  ¿Cómo funciona la renovación automática?
                </h4>
                <ul className="mt-2 text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Recibirás una notificación antes de la renovación</li>
                  <li>El pago se procesará automáticamente con tu método seleccionado</li>
                  <li>Puedes cancelar en cualquier momento desde esta configuración</li>
                  <li>Recibirás confirmación por email después de cada renovación</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-orange-600 hover:bg-orange-700"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
