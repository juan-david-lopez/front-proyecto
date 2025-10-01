// components/export-dialog.tsx
'use client';

import React, { useState } from 'react';
import { ExportFormat } from '@/services/exportService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import {
  Download,
  FileSpreadsheet,
  FileJson,
  FileText,
  CheckCircle2
} from 'lucide-react';

interface ExportDialogProps {
  onExport: (options: ExportOptions) => Promise<void>;
  disabled?: boolean;
  recordCount?: number;
}

export interface ExportOptions {
  format: ExportFormat;
  includeStats: boolean;
  includeHeaders: boolean;
  fileName?: string;
}

export function ExportDialog({ 
  onExport, 
  disabled = false,
  recordCount = 0 
}: ExportDialogProps) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [includeStats, setIncludeStats] = useState(true);
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      await onExport({
        format,
        includeStats,
        includeHeaders,
      });
      setOpen(false);
    } catch (error) {
      console.error('Error en exportación:', error);
    } finally {
      setExporting(false);
    }
  };

  const getFormatIcon = (formatType: ExportFormat) => {
    switch (formatType) {
      case 'csv':
        return FileText;
      case 'excel':
        return FileSpreadsheet;
      case 'json':
        return FileJson;
    }
  };

  const getFormatDescription = (formatType: ExportFormat) => {
    switch (formatType) {
      case 'csv':
        return 'Archivo de texto separado por comas, compatible con Excel y Google Sheets';
      case 'excel':
        return 'Archivo de Microsoft Excel con formato mejorado';
      case 'json':
        return 'Formato JSON para integración con otras aplicaciones';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled || recordCount === 0}
          className="bg-green-600 hover:bg-green-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar Datos
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Exportar Datos</DialogTitle>
          <DialogDescription>
            Configura las opciones de exportación para {recordCount} registro{recordCount !== 1 ? 's' : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Formato de archivo */}
          <div className="space-y-3">
            <Label htmlFor="format" className="text-base font-semibold">
              Formato de Archivo
            </Label>
            <Select value={format} onValueChange={(value) => setFormat(value as ExportFormat)}>
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2 py-1">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">CSV</div>
                      <div className="text-xs text-gray-500">Valores separados por comas</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="excel">
                  <div className="flex items-center gap-2 py-1">
                    <FileSpreadsheet className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">Excel</div>
                      <div className="text-xs text-gray-500">Microsoft Excel (.xls)</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2 py-1">
                    <FileJson className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-medium">JSON</div>
                      <div className="text-xs text-gray-500">JavaScript Object Notation</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600">
              {getFormatDescription(format)}
            </p>
          </div>

          {/* Opciones adicionales */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Opciones</Label>
            
            <div className="flex items-start space-x-3">
              <Checkbox
                id="headers"
                checked={includeHeaders}
                onCheckedChange={(checked) => setIncludeHeaders(checked as boolean)}
                disabled={format === 'json'}
              />
              <div className="flex-1">
                <label
                  htmlFor="headers"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Incluir encabezados
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Primera fila con nombres de columnas
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="stats"
                checked={includeStats}
                onCheckedChange={(checked) => setIncludeStats(checked as boolean)}
              />
              <div className="flex-1">
                <label
                  htmlFor="stats"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Incluir estadísticas
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Archivo adicional con resumen de estadísticas
                </p>
              </div>
            </div>
          </div>

          {/* Preview del archivo */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-start gap-3">
              {React.createElement(getFormatIcon(format), {
                className: 'h-8 w-8 text-gray-600 mt-0.5'
              })}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {recordCount} registro{recordCount !== 1 ? 's' : ''} se exportará{recordCount !== 1 ? 'n' : ''}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Archivo: transacciones_{new Date().toISOString().split('T')[0]}.{format}
                </p>
                {includeStats && (
                  <p className="text-sm text-gray-600">
                    + estadisticas_{new Date().toISOString().split('T')[0]}.json
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={exporting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="bg-green-600 hover:bg-green-700"
          >
            {exporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Exportando...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Exportar
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
