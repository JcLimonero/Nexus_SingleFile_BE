import { Injectable } from '@angular/core';
import { ActivityLog } from './activity-log.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  /**
   * Exportar logs de actividad a Excel
   */
  exportActivityLogsToExcel(logs: ActivityLog[], filters: any = {}): void {
    try {
      // Crear el contenido del Excel
      const excelContent = this.generateExcelContent(logs, filters);
      
      // Crear y descargar el archivo
      this.downloadExcelFile(excelContent, 'logs_actividad');
      
    } catch (error) {
      console.error('Error al exportar logs:', error);
      throw new Error('Error al generar el archivo Excel');
    }
  }

  /**
   * Generar contenido del Excel
   */
  private generateExcelContent(logs: ActivityLog[], filters: any): string {
    // Crear encabezados
    const headers = [
      'ID',
      'Usuario',
      'Nombre de Usuario', 
      'Acción',
      'Descripción',
      'Detalles del Cambio',
      'Fecha de Creación',
      'Fecha de Actualización'
    ];

    // Crear filas de datos
    const rows = logs.map(log => [
      log.id || '',
      log.user_id || '',
      log.username || '',
      log.action || '',
      log.description || '',
      log.change_details || '',
      this.formatDateForExcel(log.created_at),
      this.formatDateForExcel(log.updated_at)
    ]);

    // Crear información de filtros aplicados
    const filterInfo = this.generateFilterInfo(filters);

    // Generar contenido HTML para Excel
    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="UTF-8">
          <title>Logs de Actividad</title>
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .filter-info { background-color: #e8f4fd; padding: 10px; margin-bottom: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 15px; text-align: center; font-size: 18px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Logs de Actividad del Sistema</h1>
            <p>Fecha de exportación: ${new Date().toLocaleString('es-ES')}</p>
          </div>
          
          ${filterInfo}
          
          <table>
            <thead>
              <tr>
                ${headers.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; padding: 10px; background-color: #f9f9f9;">
            <p><strong>Total de registros exportados:</strong> ${logs.length}</p>
            <p><strong>Generado por:</strong> Sistema de Logs de Actividad</p>
          </div>
        </body>
      </html>
    `;

    return htmlContent;
  }

  /**
   * Generar información de filtros aplicados
   */
  private generateFilterInfo(filters: any): string {
    const activeFilters = [];
    
    if (filters.user_id) activeFilters.push(`Usuario: ${filters.user_id}`);
    if (filters.action) activeFilters.push(`Acción: ${filters.action}`);
    if (filters.start_date) activeFilters.push(`Fecha inicio: ${filters.start_date}`);
    if (filters.end_date) activeFilters.push(`Fecha fin: ${filters.end_date}`);
    if (filters.change_details) activeFilters.push(`Detalles: ${filters.change_details}`);

    if (activeFilters.length === 0) {
      return '<div class="filter-info"><strong>Filtros aplicados:</strong> Ninguno (todos los registros)</div>';
    }

    return `
      <div class="filter-info">
        <strong>Filtros aplicados:</strong><br>
        ${activeFilters.map(filter => `• ${filter}`).join('<br>')}
      </div>
    `;
  }

  /**
   * Formatear fecha para Excel
   */
  private formatDateForExcel(dateString: string | undefined): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  }

  /**
   * Descargar archivo Excel
   */
  private downloadExcelFile(content: string, filename: string): void {
    // Crear blob con el contenido HTML
    const blob = new Blob([content], { 
      type: 'application/vnd.ms-excel;charset=utf-8' 
    });

    // Crear URL del blob
    const url = window.URL.createObjectURL(blob);

    // Crear elemento de descarga
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${this.getFormattedDate()}.xls`;
    
    // Simular clic para descargar
    document.body.appendChild(link);
    link.click();
    
    // Limpiar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Obtener fecha formateada para el nombre del archivo
   */
  private getFormattedDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${year}${month}${day}_${hours}${minutes}`;
  }

  /**
   * Exportar logs filtrados por rango de fechas
   */
  exportLogsByDateRange(logs: ActivityLog[], startDate: string, endDate: string, filters: any = {}): void {
    try {
      // Filtrar logs por rango de fechas
      const filteredLogs = logs.filter(log => {
        if (!log.created_at) return false;
        const logDate = new Date(log.created_at);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start && logDate < start) return false;
        if (end && logDate > end) return false;
        
        return true;
      });

      // Crear nombre de archivo con rango de fechas
      const startStr = startDate ? new Date(startDate).toISOString().split('T')[0] : 'inicio';
      const endStr = endDate ? new Date(endDate).toISOString().split('T')[0] : 'fin';
      const filename = `logs_actividad_${startStr}_${endStr}`;

      // Exportar logs filtrados
      this.exportActivityLogsToExcel(filteredLogs, { ...filters, start_date: startDate, end_date: endDate });
      
    } catch (error) {
      console.error('Error al exportar logs por rango de fechas:', error);
      throw new Error('Error al generar el archivo Excel por rango de fechas');
    }
  }

  /**
   * Exportar a CSV como alternativa
   */
  exportToCSV(logs: ActivityLog[], filename: string = 'logs_actividad'): void {
    try {
      // Crear encabezados
      const headers = [
        'ID',
        'Usuario',
        'Nombre de Usuario',
        'Acción',
        'Descripción',
        'Detalles del Cambio',
        'Fecha de Creación',
        'Fecha de Actualización'
      ];

      // Crear filas de datos
      const rows = logs.map(log => [
        log.id || '',
        log.user_id || '',
        log.username || '',
        log.action || '',
        log.description || '',
        log.change_details || '',
        this.formatDateForExcel(log.created_at),
        this.formatDateForExcel(log.updated_at)
      ]);

      // Combinar encabezados y datos
      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      // Crear y descargar archivo CSV
      const blob = new Blob(['\ufeff' + csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}_${this.getFormattedDate()}.csv`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error al exportar CSV:', error);
      throw new Error('Error al generar el archivo CSV');
    }
  }
}
