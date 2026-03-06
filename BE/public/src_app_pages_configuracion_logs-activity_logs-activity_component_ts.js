"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_configuracion_logs-activity_logs-activity_component_ts"],{

/***/ 88993:
/*!*************************************************!*\
  !*** ./src/app/core/services/export.service.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExportService: () => (/* binding */ ExportService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 61699);

class ExportService {
  constructor() {}
  /**
   * Exportar logs de actividad a Excel
   */
  exportActivityLogsToExcel(logs, filters = {}) {
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
  generateExcelContent(logs, filters) {
    // Crear encabezados
    const headers = ['ID', 'Usuario', 'Nombre de Usuario', 'Acción', 'Descripción', 'Detalles del Cambio', 'Fecha de Creación', 'Fecha de Actualización'];
    // Crear filas de datos
    const rows = logs.map(log => [log.id || '', log.user_id || '', log.username || '', log.action || '', log.description || '', log.change_details || '', this.formatDateForExcel(log.created_at), this.formatDateForExcel(log.updated_at)]);
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
  generateFilterInfo(filters) {
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
  formatDateForExcel(dateString) {
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
  downloadExcelFile(content, filename) {
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
  getFormattedDate() {
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
  exportLogsByDateRange(logs, startDate, endDate, filters = {}) {
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
      this.exportActivityLogsToExcel(filteredLogs, {
        ...filters,
        start_date: startDate,
        end_date: endDate
      });
    } catch (error) {
      console.error('Error al exportar logs por rango de fechas:', error);
      throw new Error('Error al generar el archivo Excel por rango de fechas');
    }
  }
  /**
   * Exportar a CSV como alternativa
   */
  exportToCSV(logs, filename = 'logs_actividad') {
    try {
      // Crear encabezados
      const headers = ['ID', 'Usuario', 'Nombre de Usuario', 'Acción', 'Descripción', 'Detalles del Cambio', 'Fecha de Creación', 'Fecha de Actualización'];
      // Crear filas de datos
      const rows = logs.map(log => [log.id || '', log.user_id || '', log.username || '', log.action || '', log.description || '', log.change_details || '', this.formatDateForExcel(log.created_at), this.formatDateForExcel(log.updated_at)]);
      // Combinar encabezados y datos
      const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
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
  static #_ = this.ɵfac = function ExportService_Factory(t) {
    return new (t || ExportService)();
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
    token: ExportService,
    factory: ExportService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 66075:
/*!******************************************************************************!*\
  !*** ./src/app/pages/configuracion/logs-activity/logs-activity.component.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConfirmDialogComponent: () => (/* binding */ ConfirmDialogComponent),
/* harmony export */   LogsActivityComponent: () => (/* binding */ LogsActivityComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/table */ 46798);
/* harmony import */ var _angular_material_paginator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/paginator */ 39687);
/* harmony import */ var _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/sort */ 87963);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/select */ 96355);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/progress-spinner */ 33910);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/tooltip */ 60702);
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/chips */ 21757);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/snack-bar */ 49409);
/* harmony import */ var _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/datepicker */ 82226);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/core */ 55309);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material/card */ 18497);
/* harmony import */ var _angular_material_expansion__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/material/expansion */ 88060);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_services_activity_log_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../core/services/activity-log.service */ 41882);
/* harmony import */ var _core_services_export_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../core/services/export.service */ 88993);






































const _c0 = ["exportMenuContainer"];
function LogsActivityComponent_mat_spinner_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "mat-spinner", 60);
  }
}
function LogsActivityComponent_mat_icon_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "download");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function LogsActivityComponent_div_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 61)(1, "button", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function LogsActivityComponent_div_20_Template_button_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r22);
      const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r21.exportLogs());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "mat-icon", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "table_chart");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "span", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "Exportar P\u00E1gina Actual");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "span", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "button", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function LogsActivityComponent_div_20_Template_button_click_8_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r22);
      const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r23.exportAllLogs());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "mat-icon", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](10, "cloud_download");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "span", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](12, "Exportar Todos los Logs");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](13, "span", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](15, "div", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](16, "button", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function LogsActivityComponent_div_20_Template_button_click_16_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r22);
      const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r24.exportLogsByDateRange());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](17, "mat-icon", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](18, "date_range");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](19, "span", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](20, "Exportar por Rango de Fechas");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](21, "span", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](22);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx_r3.loading || ctx_r3.dataSource.data.length === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("(", ctx_r3.dataSource.data.length, " registros)");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx_r3.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("(", ctx_r3.totalLogs, " total)");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx_r3.loading || !ctx_r3.filters.start_date && !ctx_r3.filters.end_date);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r3.filters.start_date || ctx_r3.filters.end_date ? "Filtrado" : "Sin filtros", " ");
  }
}
function LogsActivityComponent_mat_option_83_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mat-option", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const action_r25 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("value", action_r25);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", action_r25, " ");
  }
}
function LogsActivityComponent_th_109_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "th", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Fecha y Hora ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function LogsActivityComponent_td_110_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const log_r26 = ctx.$implicit;
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r8.formatTimestamp(log_r26.created_at), " ");
  }
}
function LogsActivityComponent_th_112_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "th", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Usuario ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function LogsActivityComponent_td_113_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 72)(1, "div", 73)(2, "div", 74)(3, "span", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "span", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const log_r27 = ctx.$implicit;
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](log_r27.username == null ? null : (tmp_0_0 = log_r27.username.charAt(0)) == null ? null : tmp_0_0.toUpperCase());
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](log_r27.username);
  }
}
function LogsActivityComponent_th_115_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "th", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Acci\u00F3n ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function LogsActivityComponent_td_116_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 72)(1, "div", 77)(2, "div", 78)(3, "mat-icon", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const log_r28 = ctx.$implicit;
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", ctx_r12.getActionColor(log_r28.action).class);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", ctx_r12.getActionColor(log_r28.action).iconClass);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r12.getActionColor(log_r28.action).icon, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](log_r28.action);
  }
}
function LogsActivityComponent_th_118_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "th", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Descripci\u00F3n ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function LogsActivityComponent_td_119_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 72)(1, "div", 81)(2, "span", 82);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const log_r29 = ctx.$implicit;
    const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("matTooltip", log_r29.description || "Sin descripci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r14.truncateText(log_r29.description || "Sin descripci\u00F3n", 50), " ");
  }
}
function LogsActivityComponent_th_121_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "th", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Detalles del Cambio ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function LogsActivityComponent_td_122_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 72)(1, "div", 81)(2, "span", 82);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const log_r30 = ctx.$implicit;
    const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("matTooltip", log_r30.change_details || "Sin detalles");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r16.truncateText(log_r30.change_details || "Sin detalles", 60), " ");
  }
}
function LogsActivityComponent_tr_123_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "tr", 83);
  }
}
function LogsActivityComponent_tr_124_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "tr", 84);
  }
}
function LogsActivityComponent_div_125_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "mat-spinner", 86);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function LogsActivityComponent_div_126_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 87)(1, "mat-icon", 88);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "history");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "p", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "No se encontraron logs");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "p", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "Intenta ajustar los filtros de b\u00FAsqueda");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
}
const _c1 = () => [10, 25, 50, 100];
class LogsActivityComponent {
  constructor(activityLogService, exportService, snackBar, dialog) {
    this.activityLogService = activityLogService;
    this.exportService = exportService;
    this.snackBar = snackBar;
    this.dialog = dialog;
    this.displayedColumns = ['timestamp', 'username', 'action', 'description', 'change_details'];
    this.dataSource = new _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatTableDataSource([]);
    this.loading = false;
    this.stats = null;
    this.statsLoading = false;
    this.showExportMenu = false;
    // Filtros
    this.filters = {
      limit: 10,
      offset: 0,
      change_details: ''
    };
    // Opciones de acciones para el filtro
    this.actionOptions = ['CREATE', 'DELETE', 'EXPORT', 'LOGIN', 'LOGOUT', 'UPDATE'];
    // Paginación
    this.totalLogs = 0;
    this.pageSize = 100;
    this.pageSizeOptions = [25, 50, 100, 200];
  }
  ngOnInit() {
    this.loadLogs();
    this.loadStats();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  /**
   * Cargar logs con filtros aplicados
   */
  loadLogs() {
    this.loading = true;
    this.activityLogService.getLogs(this.filters).subscribe({
      next: response => {
        this.dataSource.data = response.data;
        this.totalLogs = response.pagination?.total || 0;
        // Actualizar el paginador si es necesario
        if (this.paginator && this.filters.limit !== this.paginator.pageSize) {
          this.paginator.pageSize = this.filters.limit || 100;
        }
        this.loading = false;
      },
      error: error => {
        console.error('Error loading logs:', error);
        this.snackBar.open('Error al cargar los logs', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }
  /**
   * Cargar estadísticas
   */
  loadStats() {
    this.statsLoading = true;
    this.activityLogService.getStats().subscribe({
      next: response => {
        this.stats = response.data;
        this.statsLoading = false;
      },
      error: error => {
        console.error('Error loading stats:', error);
        this.statsLoading = false;
      }
    });
  }
  /**
   * Aplicar filtros
   */
  applyFilters() {
    this.filters.offset = 0; // Resetear offset al aplicar filtros
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.loadLogs();
  }
  /**
   * Limpiar filtros
   */
  clearFilters() {
    this.filters = {
      limit: 100,
      offset: 0,
      change_details: ''
    };
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.loadLogs();
  }
  /**
   * Cambiar página
   */
  onPageChange(event) {
    this.filters.offset = event.pageIndex * event.pageSize;
    this.filters.limit = event.pageSize;
    this.pageSize = event.pageSize;
    this.loadLogs();
  }
  /**
   * Limpiar logs antiguos
   */
  cleanOldLogs() {
    const days = 90; // Por defecto 90 días
    this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Limpiar Logs Antiguos',
        message: `¿Estás seguro de que quieres eliminar todos los logs de más de ${days} días? Esta acción no se puede deshacer.`,
        confirmText: 'Limpiar',
        cancelText: 'Cancelar'
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.activityLogService.cleanOldLogs(days).subscribe({
          next: response => {
            this.snackBar.open(response.message, 'Éxito', {
              duration: 3000
            });
            this.loadLogs();
            this.loadStats();
          },
          error: error => {
            console.error('Error cleaning old logs:', error);
            this.snackBar.open('Error al limpiar logs antiguos', 'Error', {
              duration: 3000
            });
          }
        });
      }
    });
  }
  /**
   * Exportar logs de la página actual
   */
  exportLogs() {
    if (!this.dataSource.data || this.dataSource.data.length === 0) {
      this.snackBar.open('No hay datos para exportar', 'Advertencia', {
        duration: 2000
      });
      return;
    }
    try {
      this.loading = true;
      // Mostrar mensaje de inicio
      this.snackBar.open('Generando archivo Excel...', 'Info', {
        duration: 2000
      });
      // Exportar logs con filtros aplicados
      this.exportService.exportActivityLogsToExcel(this.dataSource.data, this.filters);
      // Mensaje de éxito
      this.snackBar.open(`Archivo Excel generado exitosamente con ${this.dataSource.data.length} registros`, 'Éxito', {
        duration: 3000
      });
      // Cerrar menú después de exportar
      this.closeExportMenu();
    } catch (error) {
      console.error('Error al exportar logs:', error);
      this.snackBar.open('Error al generar el archivo Excel', 'Error', {
        duration: 3000
      });
    } finally {
      this.loading = false;
    }
  }
  /**
   * Exportar todos los logs (no solo los de la página actual)
   */
  exportAllLogs() {
    // Confirmar antes de exportar todos los logs
    const confirmMessage = `¿Estás seguro de que quieres exportar TODOS los logs?\n\n` + `• Total de logs: ${this.totalLogs}\n` + `• Filtros aplicados: ${this.getActiveFiltersText()}\n` + `• El archivo puede ser muy grande\n\n` + `¿Continuar con la exportación?`;
    if (confirm(confirmMessage)) {
      try {
        this.loading = true;
        // Mostrar mensaje de inicio
        this.snackBar.open('Obteniendo todos los logs para exportar...', 'Info', {
          duration: 2000
        });
        // Obtener todos los logs con los filtros actuales pero sin límite de paginación
        const exportFilters = {
          ...this.filters,
          limit: 10000,
          offset: 0
        };
        this.activityLogService.getLogs(exportFilters).subscribe({
          next: response => {
            if (response.data && response.data.length > 0) {
              // Mostrar mensaje de generación
              this.snackBar.open('Generando archivo Excel con todos los logs...', 'Info', {
                duration: 2000
              });
              // Exportar todos los logs
              this.exportService.exportActivityLogsToExcel(response.data, this.filters);
              // Mensaje de éxito
              this.snackBar.open(`Archivo Excel generado exitosamente con ${response.data.length} registros`, 'Éxito', {
                duration: 3000
              });
              // Cerrar menú después de exportar
              this.closeExportMenu();
            } else {
              this.snackBar.open('No se encontraron logs para exportar', 'Advertencia', {
                duration: 2000
              });
            }
            this.loading = false;
          },
          error: error => {
            console.error('Error al obtener logs para exportar:', error);
            this.snackBar.open('Error al obtener los logs para exportar', 'Error', {
              duration: 3000
            });
            this.loading = false;
          }
        });
      } catch (error) {
        console.error('Error al exportar todos los logs:', error);
        this.snackBar.open('Error al generar el archivo Excel', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    }
  }
  /**
   * Obtener texto de filtros activos para mostrar en confirmación
   */
  getActiveFiltersText() {
    const activeFilters = [];
    if (this.filters.user_id) activeFilters.push(`Usuario: ${this.filters.user_id}`);
    if (this.filters.action) activeFilters.push(`Acción: ${this.filters.action}`);
    if (this.filters.start_date) activeFilters.push(`Fecha inicio: ${this.filters.start_date}`);
    if (this.filters.end_date) activeFilters.push(`Fecha fin: ${this.filters.end_date}`);
    if (this.filters.change_details) activeFilters.push(`Detalles: ${this.filters.change_details}`);
    return activeFilters.length > 0 ? activeFilters.join(', ') : 'Ninguno (todos los registros)';
  }
  /**
   * Alternar menú de exportación
   */
  toggleExportMenu(event) {
    if (event) {
      event.stopPropagation();
    }
    this.showExportMenu = !this.showExportMenu;
  }
  /**
   * Cerrar menú de exportación
   */
  closeExportMenu() {
    this.showExportMenu = false;
  }
  /**
   * Listener para cerrar el menú cuando se hace clic fuera
   */
  onDocumentClick(event) {
    if (this.exportMenuContainer && !this.exportMenuContainer.nativeElement.contains(event.target)) {
      this.closeExportMenu();
    }
  }
  /**
   * Exportar logs por rango de fechas
   */
  exportLogsByDateRange() {
    if (!this.filters.start_date && !this.filters.end_date) {
      this.snackBar.open('Debes seleccionar al menos una fecha para exportar por rango', 'Advertencia', {
        duration: 3000
      });
      return;
    }
    try {
      this.loading = true;
      // Mostrar mensaje de inicio
      this.snackBar.open('Exportando logs por rango de fechas...', 'Info', {
        duration: 2000
      });
      // Obtener todos los logs para filtrar por fecha
      const exportFilters = {
        ...this.filters,
        limit: 10000,
        offset: 0
      };
      this.activityLogService.getLogs(exportFilters).subscribe({
        next: response => {
          if (response.data && response.data.length > 0) {
            // Exportar logs filtrados por fecha
            this.exportService.exportLogsByDateRange(response.data, this.filters.start_date || '', this.filters.end_date || '', this.filters);
            // Mensaje de éxito
            const startDate = this.filters.start_date ? new Date(this.filters.start_date).toLocaleDateString('es-ES') : 'inicio';
            const endDate = this.filters.end_date ? new Date(this.filters.end_date).toLocaleDateString('es-ES') : 'fin';
            this.snackBar.open(`Archivo Excel generado exitosamente para el rango ${startDate} - ${endDate}`, 'Éxito', {
              duration: 3000
            });
            // Cerrar menú después de exportar
            this.closeExportMenu();
          } else {
            this.snackBar.open('No se encontraron logs en el rango de fechas especificado', 'Advertencia', {
              duration: 2000
            });
          }
          this.loading = false;
        },
        error: error => {
          console.error('Error al obtener logs para exportar por fecha:', error);
          this.snackBar.open('Error al obtener los logs para exportar', 'Error', {
            duration: 3000
          });
          this.loading = false;
        }
      });
    } catch (error) {
      console.error('Error al exportar logs por rango de fechas:', error);
      this.snackBar.open('Error al generar el archivo Excel', 'Error', {
        duration: 3000
      });
      this.loading = false;
    }
  }
  /**
   * Obtener color del chip según la acción
   */
  getActionColor(action) {
    const colorMap = {
      'LOGIN': {
        class: 'bg-green-100 text-green-800 border-green-200',
        icon: 'login',
        iconClass: 'text-green-600'
      },
      'LOGOUT': {
        class: 'bg-red-100 text-red-800 border-red-200',
        icon: 'logout',
        iconClass: 'text-red-600'
      },
      'NAVIGATION': {
        class: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: 'navigation',
        iconClass: 'text-blue-600'
      },
      'CREATE': {
        class: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: 'add_circle',
        iconClass: 'text-emerald-600'
      },
      'UPDATE': {
        class: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: 'edit',
        iconClass: 'text-amber-600'
      },
      'DELETE': {
        class: 'bg-red-100 text-red-800 border-red-200',
        icon: 'delete',
        iconClass: 'text-red-600'
      },
      'SEARCH': {
        class: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        icon: 'search',
        iconClass: 'text-indigo-600'
      },
      'EXPORT': {
        class: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: 'download',
        iconClass: 'text-purple-600'
      }
    };
    return colorMap[action] || {
      class: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: 'help',
      iconClass: 'text-gray-600'
    };
  }
  // Método getMethodColor removido ya que no tenemos la columna de método HTTP
  /**
   * Calcular tiempo promedio de ejecución
   */
  getAverageExecutionTime() {
    // Como removimos el campo execution_time, retornamos un valor fijo
    // En el futuro se puede implementar un sistema de medición de tiempo real
    return 0;
  }
  /**
   * Obtener rango de página actual
   */
  getPageRange() {
    if (!this.paginator) return '0-0';
    const start = this.paginator.pageIndex * this.paginator.pageSize + 1;
    const end = Math.min(start + this.paginator.pageSize - 1, this.totalLogs);
    return `${start}-${end}`;
  }
  /**
   * Formatear timestamp
   */
  formatTimestamp(timestamp) {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString('es-ES');
  }
  /**
   * Formatear tiempo de ejecución
   */
  formatExecutionTime(time) {
    // Como removimos el campo execution_time, retornamos un valor por defecto
    return 'N/A';
  }
  /**
   * Truncar texto largo
   */
  truncateText(text, maxLength = 50) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  static #_ = this.ɵfac = function LogsActivityComponent_Factory(t) {
    return new (t || LogsActivityComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_core_services_activity_log_service__WEBPACK_IMPORTED_MODULE_0__.ActivityLogService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_core_services_export_service__WEBPACK_IMPORTED_MODULE_1__.ExportService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__.MatSnackBar), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__.MatDialog));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
    type: LogsActivityComponent,
    selectors: [["app-logs-activity"]],
    viewQuery: function LogsActivityComponent_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_angular_material_paginator__WEBPACK_IMPORTED_MODULE_6__.MatPaginator, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_angular_material_sort__WEBPACK_IMPORTED_MODULE_7__.MatSort, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c0, 5);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.paginator = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.sort = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.exportMenuContainer = _t.first);
      }
    },
    hostBindings: function LogsActivityComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function LogsActivityComponent_click_HostBindingHandler($event) {
          return ctx.onDocumentClick($event);
        }, false, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresolveDocument"]);
      }
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵStandaloneFeature"]],
    decls: 128,
    vars: 33,
    consts: [[1, "p-6"], [1, "flex", "items-center", "justify-between", "mb-6"], [1, "text-3xl", "font-bold", "text-gray-900"], [1, "text-gray-600", "mt-1"], [1, "flex", "gap-2"], ["mat-raised-button", "", "color", "warn", 1, "flex", "items-center", "gap-2", 3, "click"], [1, "export-menu-container"], ["exportMenuContainer", ""], ["mat-raised-button", "", "color", "accent", "matTooltip", "Exportar logs de actividad a Excel", "matTooltipPosition", "above", 1, "flex", "items-center", "gap-2", 3, "disabled", "click"], ["diameter", "16", "class", "mr-1", 4, "ngIf"], [4, "ngIf"], [1, "ml-1", "transition-transform"], ["class", "export-menu animate-fade-in", 4, "ngIf"], [1, "grid", "grid-cols-1", "md:grid-cols-4", "gap-4", "mb-6"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "p-4"], [1, "flex", "items-center"], [1, "p-2", "bg-blue-100", "rounded-lg"], [1, "text-blue-600"], [1, "ml-3"], [1, "text-sm", "font-medium", "text-gray-600"], [1, "text-2xl", "font-bold", "text-gray-900"], [1, "p-2", "bg-green-100", "rounded-lg"], [1, "text-green-600"], [1, "text-lg", "font-semibold", "text-gray-900"], [1, "text-sm", "text-gray-500"], [1, "p-2", "bg-purple-100", "rounded-lg"], [1, "text-purple-600"], [1, "p-2", "bg-orange-100", "rounded-lg"], [1, "text-orange-600"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "p-4", "mb-6"], [1, "flex", "flex-wrap", "gap-4", "items-start"], ["appearance", "outline", 1, "flex-1", "min-w-48"], ["matInput", "", "placeholder", "Buscar por usuario...", "maxlength", "100", 3, "ngModel", "ngModelChange"], ["matSuffix", ""], [3, "ngModel", "ngModelChange"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], ["matInput", "", 3, "matDatepicker", "ngModel", "ngModelChange"], ["matIconSuffix", "", 3, "for"], ["startPicker", ""], ["endPicker", ""], ["mat-raised-button", "", "color", "primary", 1, "flex", "items-center", "gap-2", 3, "click"], ["mat-stroked-button", "", 1, "flex", "items-center", "gap-2", 3, "click"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "overflow-hidden"], ["mat-table", "", "matSort", "", 1, "w-full", 2, "line-height", "1", 3, "dataSource"], ["matColumnDef", "timestamp"], ["mat-header-cell", "", "mat-sort-header", "", "class", "w-48 text-center py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "text-xs font-mono text-gray-600 py-0 text-center", 4, "matCellDef"], ["matColumnDef", "username"], ["mat-header-cell", "", "mat-sort-header", "", "class", "min-w-0 flex-1 py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "text-xs py-0", 4, "matCellDef"], ["matColumnDef", "action"], ["matColumnDef", "description"], ["mat-header-cell", "", "class", "min-w-0 flex-1 py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["matColumnDef", "change_details"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", "class", "!min-h-0 !h-8", 4, "matRowDef", "matRowDefColumns"], ["class", "flex justify-center items-center py-8", 4, "ngIf"], ["class", "flex flex-col items-center justify-center py-8 text-gray-500", 4, "ngIf"], ["showFirstLastButtons", "", 1, "border-t", 3, "pageSizeOptions", "pageSize", "length", "page"], ["diameter", "16", 1, "mr-1"], [1, "export-menu", "animate-fade-in"], [1, "export-menu-item", 3, "disabled", "click"], [1, "menu-item-icon"], [1, "menu-item-text"], [1, "menu-item-count"], [1, "text-sm"], [1, "export-menu-divider"], [3, "value"], ["mat-header-cell", "", "mat-sort-header", "", 1, "w-48", "text-center", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], ["mat-cell", "", 1, "text-xs", "font-mono", "text-gray-600", "py-0", "text-center"], ["mat-header-cell", "", "mat-sort-header", "", 1, "min-w-0", "flex-1", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], ["mat-cell", "", 1, "text-xs", "py-0"], [1, "flex", "items-center", "gap-2"], [1, "w-6", "h-6", "bg-blue-100", "rounded-full", "flex", "items-center", "justify-center"], [1, "text-xs", "font-medium", "text-blue-600"], [1, "font-medium"], [1, "flex", "justify-center", "items-center"], [1, "flex", "items-center", "gap-1", "px-2", "py-1", "rounded-full", "text-xs", "font-medium", "border", 3, "ngClass"], [1, "!text-xs", "!w-3", "!h-3", 3, "ngClass"], ["mat-header-cell", "", 1, "min-w-0", "flex-1", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], [1, "max-w-xs"], [1, "text-gray-700", 3, "matTooltip"], ["mat-header-row", ""], ["mat-row", "", 1, "!min-h-0", "!h-8"], [1, "flex", "justify-center", "items-center", "py-8"], ["diameter", "40"], [1, "flex", "flex-col", "items-center", "justify-center", "py-8", "text-gray-500"], [1, "text-6xl", "text-gray-300", "mb-2"], [1, "text-lg", "font-medium"]],
    template: function LogsActivityComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "Logs de Actividad");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "p", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "Monitoreo completo de todas las acciones realizadas por los usuarios");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "div", 4)(8, "button", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function LogsActivityComponent_Template_button_click_8_listener() {
          return ctx.cleanOldLogs();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](10, "delete_sweep");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](11, " Limpiar Logs Antiguos ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "div", 6, 7)(14, "button", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function LogsActivityComponent_Template_button_click_14_listener($event) {
          return ctx.toggleExportMenu($event);
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](15, LogsActivityComponent_mat_spinner_15_Template, 1, 0, "mat-spinner", 9)(16, LogsActivityComponent_mat_icon_16_Template, 2, 0, "mat-icon", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](17);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](18, "mat-icon", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](19, "expand_more");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](20, LogsActivityComponent_div_20_Template, 23, 6, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](21, "div", 13)(22, "div", 14)(23, "div", 15)(24, "div", 16)(25, "mat-icon", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](26, "history");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](27, "div", 18)(28, "p", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](29, "Total de Logs");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](30, "p", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](31);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](32, "number");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](33, "div", 14)(34, "div", 15)(35, "div", 21)(36, "mat-icon", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](37, "trending_up");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](38, "div", 18)(39, "p", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](40, "Acci\u00F3n Principal");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](41, "p", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](42);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](43, "p", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](44);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](45, "div", 14)(46, "div", 15)(47, "div", 25)(48, "mat-icon", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](49, "person");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](50, "div", 18)(51, "p", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](52, "Usuario M\u00E1s Activo");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](53, "p", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](54);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](55, "p", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](56);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](57, "div", 14)(58, "div", 15)(59, "div", 27)(60, "mat-icon", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](61, "trending_down");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](62, "div", 18)(63, "p", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](64, "Acciones Recientes");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](65, "p", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](66);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](67, "p", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](68, "en esta sesi\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](69, "div", 29)(70, "div", 30)(71, "mat-form-field", 31)(72, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](73, "Buscar logs");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](74, "input", 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function LogsActivityComponent_Template_input_ngModelChange_74_listener($event) {
          return ctx.filters.user_id = $event;
        })("ngModelChange", function LogsActivityComponent_Template_input_ngModelChange_74_listener() {
          return ctx.applyFilters();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](75, "mat-icon", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](76, "\uD83D\uDD0D");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](77, "mat-form-field", 31)(78, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](79, "Acci\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](80, "mat-select", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function LogsActivityComponent_Template_mat_select_ngModelChange_80_listener($event) {
          return ctx.filters.action = $event;
        })("ngModelChange", function LogsActivityComponent_Template_mat_select_ngModelChange_80_listener() {
          return ctx.applyFilters();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](81, "mat-option", 35);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](82, "Todas las acciones");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](83, LogsActivityComponent_mat_option_83_Template, 2, 2, "mat-option", 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](84, "mat-form-field", 31)(85, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](86, "Fecha inicio");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](87, "input", 37);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function LogsActivityComponent_Template_input_ngModelChange_87_listener($event) {
          return ctx.filters.start_date = $event;
        })("ngModelChange", function LogsActivityComponent_Template_input_ngModelChange_87_listener() {
          return ctx.applyFilters();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](88, "mat-datepicker-toggle", 38)(89, "mat-datepicker", null, 39);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](91, "mat-form-field", 31)(92, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](93, "Fecha fin");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](94, "input", 37);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function LogsActivityComponent_Template_input_ngModelChange_94_listener($event) {
          return ctx.filters.end_date = $event;
        })("ngModelChange", function LogsActivityComponent_Template_input_ngModelChange_94_listener() {
          return ctx.applyFilters();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](95, "mat-datepicker-toggle", 38)(96, "mat-datepicker", null, 40);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](98, "button", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function LogsActivityComponent_Template_button_click_98_listener() {
          return ctx.applyFilters();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](99, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](100, "filter_list");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](101, " Aplicar Filtros ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](102, "button", 42);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function LogsActivityComponent_Template_button_click_102_listener() {
          return ctx.clearFilters();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](103, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](104, "clear");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](105, " Limpiar Filtros ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](106, "div", 43)(107, "table", 44);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](108, 45);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](109, LogsActivityComponent_th_109_Template, 2, 0, "th", 46)(110, LogsActivityComponent_td_110_Template, 2, 1, "td", 47);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](111, 48);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](112, LogsActivityComponent_th_112_Template, 2, 0, "th", 49)(113, LogsActivityComponent_td_113_Template, 7, 2, "td", 50);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](114, 51);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](115, LogsActivityComponent_th_115_Template, 2, 0, "th", 49)(116, LogsActivityComponent_td_116_Template, 7, 4, "td", 50);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](117, 52);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](118, LogsActivityComponent_th_118_Template, 2, 0, "th", 53)(119, LogsActivityComponent_td_119_Template, 4, 2, "td", 50);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](120, 54);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](121, LogsActivityComponent_th_121_Template, 2, 0, "th", 53)(122, LogsActivityComponent_td_122_Template, 4, 2, "td", 50);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](123, LogsActivityComponent_tr_123_Template, 1, 0, "tr", 55)(124, LogsActivityComponent_tr_124_Template, 1, 0, "tr", 56);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](125, LogsActivityComponent_div_125_Template, 2, 0, "div", 57)(126, LogsActivityComponent_div_126_Template, 7, 0, "div", 58);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](127, "mat-paginator", 59);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("page", function LogsActivityComponent_Template_mat_paginator_page_127_listener($event) {
          return ctx.onPageChange($event);
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
      }
      if (rf & 2) {
        const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](90);
        const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](97);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx.loading ? "Exportando..." : "Exportar", " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("rotate-180", ctx.showExportMenu);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.showExportMenu);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](32, 30, (ctx.stats == null ? null : ctx.stats.total_logs) || 0));
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"]((ctx.stats == null ? null : ctx.stats.actions_count == null ? null : ctx.stats.actions_count[0] == null ? null : ctx.stats.actions_count[0].action) || "N/A");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("", (ctx.stats == null ? null : ctx.stats.actions_count == null ? null : ctx.stats.actions_count[0] == null ? null : ctx.stats.actions_count[0].count) || 0, " veces");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"]((ctx.stats == null ? null : ctx.stats.users_count == null ? null : ctx.stats.users_count[0] == null ? null : ctx.stats.users_count[0].username) || "N/A");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("", (ctx.stats == null ? null : ctx.stats.users_count == null ? null : ctx.stats.users_count[0] == null ? null : ctx.stats.users_count[0].count) || 0, " acciones");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx.dataSource.data.length);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx.filters.user_id);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx.filters.action);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.actionOptions);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("matDatepicker", _r5)("ngModel", ctx.filters.start_date);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("for", _r5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("matDatepicker", _r6)("ngModel", ctx.filters.end_date);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("for", _r6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](12);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("dataSource", ctx.dataSource);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](16);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("matHeaderRowDef", ctx.displayedColumns);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("matRowDefColumns", ctx.displayedColumns);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.loading && ctx.dataSource.data.length === 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("pageSizeOptions", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](32, _c1))("pageSize", 10)("length", ctx.totalLogs);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_8__.DecimalPipe, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgModel, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatTableModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatTable, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatHeaderCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatHeaderRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatColumnDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatHeaderCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatHeaderRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatRow, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_6__.MatPaginatorModule, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_6__.MatPaginator, _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__.MatSortModule, _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__.MatSort, _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__.MatSortHeader, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__.MatSuffix, _angular_material_input__WEBPACK_IMPORTED_MODULE_11__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_11__.MatInput, _angular_material_select__WEBPACK_IMPORTED_MODULE_12__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_12__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_13__.MatOption, _angular_material_button__WEBPACK_IMPORTED_MODULE_14__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_14__.MatButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_15__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_15__.MatIcon, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_16__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_16__.MatProgressSpinner, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__.MatTooltipModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__.MatTooltip, _angular_material_chips__WEBPACK_IMPORTED_MODULE_18__.MatChipsModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__.MatSnackBarModule, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_19__.MatDatepickerModule, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_19__.MatDatepicker, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_19__.MatDatepickerInput, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_19__.MatDatepickerToggle, _angular_material_core__WEBPACK_IMPORTED_MODULE_13__.MatNativeDateModule, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__.MatDialogModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_20__.MatCardModule, _angular_material_expansion__WEBPACK_IMPORTED_MODULE_21__.MatExpansionModule],
    styles: [".mat-mdc-table[_ngcontent-%COMP%] {\n  width: 100%;\n  background: white;\n}\n\n.mat-mdc-row[_ngcontent-%COMP%]:hover {\n  background-color: #f8fafc;\n}\n\n.mat-mdc-cell[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n  border-bottom: 1px solid #e2e8f0;\n}\n\n.mat-mdc-header-cell[_ngcontent-%COMP%] {\n  background-color: #f1f5f9;\n  font-weight: 600;\n  color: #374151;\n  padding: 16px;\n  border-bottom: 2px solid #e2e8f0;\n}\n\n.mat-mdc-chip.mat-mdc-chip-selected.mat-mdc-chip-color-success[_ngcontent-%COMP%] {\n  background-color: #dcfce7;\n  color: #166534;\n}\n\n.mat-mdc-chip.mat-mdc-chip-selected.mat-mdc-chip-color-warn[_ngcontent-%COMP%] {\n  background-color: #fef3c7;\n  color: #92400e;\n}\n\n.mat-mdc-chip.mat-mdc-chip-selected.mat-mdc-chip-color-primary[_ngcontent-%COMP%] {\n  background-color: #dbeafe;\n  color: #1e40af;\n}\n\n.mat-mdc-chip.mat-mdc-chip-selected.mat-mdc-chip-color-accent[_ngcontent-%COMP%] {\n  background-color: #f3e8ff;\n  color: #7c3aed;\n}\n\n.mat-mdc-form-field[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.mat-mdc-card[_ngcontent-%COMP%] {\n  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);\n  border-radius: 8px;\n  border: 1px solid #e2e8f0;\n}\n\n.mat-mdc-card-header[_ngcontent-%COMP%] {\n  background-color: #f8fafc;\n  border-bottom: 1px solid #e2e8f0;\n  border-radius: 8px 8px 0 0;\n}\n\n.mat-mdc-raised-button[_ngcontent-%COMP%] {\n  border-radius: 6px;\n  font-weight: 500;\n}\n\n.mat-mdc-stroked-button[_ngcontent-%COMP%] {\n  border-radius: 6px;\n  font-weight: 500;\n}\n\n.mat-mdc-paginator[_ngcontent-%COMP%] {\n  background-color: #f8fafc;\n  border-top: 1px solid #e2e8f0;\n}\n\n.mat-mdc-tooltip[_ngcontent-%COMP%] {\n  font-size: 12px;\n  max-width: 300px;\n}\n\n.mat-mdc-progress-spinner[_ngcontent-%COMP%] {\n  margin: 0 auto;\n}\n\n.stats-card[_ngcontent-%COMP%] {\n  transition: transform 0.2s ease-in-out;\n}\n.stats-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n}\n\n@media (max-width: 768px) {\n  .mat-mdc-table[_ngcontent-%COMP%] {\n    font-size: 12px;\n  }\n  .mat-mdc-cell[_ngcontent-%COMP%], .mat-mdc-header-cell[_ngcontent-%COMP%] {\n    padding: 8px 12px;\n  }\n  .mat-mdc-card-content[_ngcontent-%COMP%] {\n    padding: 16px;\n  }\n}\n.mat-mdc-datepicker-toggle[_ngcontent-%COMP%] {\n  color: #6b7280;\n}\n\n.truncated-text[_ngcontent-%COMP%] {\n  max-width: 200px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.code-block[_ngcontent-%COMP%] {\n  font-family: \"Monaco\", \"Menlo\", \"Ubuntu Mono\", monospace;\n  background-color: #f3f4f6;\n  padding: 2px 6px;\n  border-radius: 4px;\n  font-size: 11px;\n}\n\n.http-method[_ngcontent-%COMP%] {\n  font-family: \"Monaco\", \"Menlo\", \"Ubuntu Mono\", monospace;\n  font-weight: 600;\n  padding: 2px 8px;\n  border-radius: 4px;\n  font-size: 11px;\n  text-transform: uppercase;\n}\n\n.loading-overlay[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 200px;\n}\n\n.no-data-message[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 48px 24px;\n  color: #6b7280;\n}\n.no-data-message[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  font-size: 64px;\n  width: 64px;\n  height: 64px;\n  margin-bottom: 16px;\n  opacity: 0.5;\n}\n\n.filters-section[_ngcontent-%COMP%] {\n  background-color: #f8fafc;\n  border-radius: 8px;\n  padding: 20px;\n  margin-bottom: 24px;\n}\n\n.logs-table-container[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  border-radius: 8px;\n  border: 1px solid #e2e8f0;\n}\n\n.table-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 16px;\n  padding: 16px 0;\n  border-bottom: 1px solid #e2e8f0;\n}\n\n.advanced-filters[_ngcontent-%COMP%] {\n  margin-top: 16px;\n  padding-top: 16px;\n  border-top: 1px solid #e2e8f0;\n}\n\n.filter-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  align-items: flex-end;\n}\n\n.filters-grid[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 16px;\n}\n@media (min-width: 768px) {\n  .filters-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (min-width: 1024px) {\n  .filters-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(4, 1fr);\n  }\n}\n\n.stats-grid[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 24px;\n}\n@media (min-width: 768px) {\n  .stats-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}\n\n.stat-card[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 24px;\n  border-radius: 8px;\n  transition: all 0.2s ease-in-out;\n}\n.stat-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n}\n.stat-card[_ngcontent-%COMP%]   .stat-value[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n  font-weight: 700;\n  margin-bottom: 8px;\n}\n.stat-card[_ngcontent-%COMP%]   .stat-label[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: #6b7280;\n}\n\n.page-header[_ngcontent-%COMP%] {\n  margin-bottom: 32px;\n}\n.page-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 2.25rem;\n  font-weight: 700;\n  color: #111827;\n  margin-bottom: 8px;\n}\n.page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1.125rem;\n  color: #6b7280;\n}\n\n.export-menu-container[_ngcontent-%COMP%] {\n  position: relative;\n}\n.export-menu-container[_ngcontent-%COMP%]   .export-menu[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0;\n  top: 100%;\n  margin-top: 8px;\n  width: 12rem;\n  background: white;\n  border-radius: 8px;\n  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);\n  border: 1px solid #e5e7eb;\n  z-index: 50;\n  overflow: hidden;\n}\n.export-menu-container[_ngcontent-%COMP%]   .export-menu[_ngcontent-%COMP%]   .export-menu-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  width: 100%;\n  padding: 12px 16px;\n  text-align: left;\n  font-size: 14px;\n  color: #374151;\n  background: transparent;\n  border: none;\n  cursor: pointer;\n  transition: background-color 0.15s ease;\n}\n.export-menu-container[_ngcontent-%COMP%]   .export-menu[_ngcontent-%COMP%]   .export-menu-item[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background-color: #f9fafb;\n}\n.export-menu-container[_ngcontent-%COMP%]   .export-menu[_ngcontent-%COMP%]   .export-menu-item[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.export-menu-container[_ngcontent-%COMP%]   .export-menu[_ngcontent-%COMP%]   .export-menu-item[_ngcontent-%COMP%]   .menu-item-icon[_ngcontent-%COMP%] {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n}\n.export-menu-container[_ngcontent-%COMP%]   .export-menu[_ngcontent-%COMP%]   .export-menu-item[_ngcontent-%COMP%]   .menu-item-text[_ngcontent-%COMP%] {\n  flex: 1;\n  text-align: left;\n}\n.export-menu-container[_ngcontent-%COMP%]   .export-menu[_ngcontent-%COMP%]   .export-menu-item[_ngcontent-%COMP%]   .menu-item-count[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #6b7280;\n  margin-left: auto;\n}\n.export-menu-container[_ngcontent-%COMP%]   .export-menu[_ngcontent-%COMP%]   .export-menu-divider[_ngcontent-%COMP%] {\n  height: 1px;\n  background-color: #e5e7eb;\n  margin: 4px 0;\n}\n\n.animate-fade-in[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeIn 0.2s ease-out;\n}\n\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(-8px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.rotate-180[_ngcontent-%COMP%] {\n  transform: rotate(180deg);\n}\n\n.transition-transform[_ngcontent-%COMP%] {\n  transition: transform 0.2s ease;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvY29uZmlndXJhY2lvbi9sb2dzLWFjdGl2aXR5L2xvZ3MtYWN0aXZpdHkuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDRSxXQUFBO0VBQ0EsaUJBQUE7QUFERjs7QUFJQTtFQUNFLHlCQUFBO0FBREY7O0FBSUE7RUFDRSxrQkFBQTtFQUNBLGdDQUFBO0FBREY7O0FBSUE7RUFDRSx5QkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtFQUNBLGFBQUE7RUFDQSxnQ0FBQTtBQURGOztBQUtBO0VBQ0UseUJBQUE7RUFDQSxjQUFBO0FBRkY7O0FBS0E7RUFDRSx5QkFBQTtFQUNBLGNBQUE7QUFGRjs7QUFLQTtFQUNFLHlCQUFBO0VBQ0EsY0FBQTtBQUZGOztBQUtBO0VBQ0UseUJBQUE7RUFDQSxjQUFBO0FBRkY7O0FBTUE7RUFDRSxXQUFBO0FBSEY7O0FBT0E7RUFDRSwyRUFBQTtFQUNBLGtCQUFBO0VBQ0EseUJBQUE7QUFKRjs7QUFPQTtFQUNFLHlCQUFBO0VBQ0EsZ0NBQUE7RUFDQSwwQkFBQTtBQUpGOztBQVFBO0VBQ0Usa0JBQUE7RUFDQSxnQkFBQTtBQUxGOztBQVFBO0VBQ0Usa0JBQUE7RUFDQSxnQkFBQTtBQUxGOztBQVNBO0VBQ0UseUJBQUE7RUFDQSw2QkFBQTtBQU5GOztBQVVBO0VBQ0UsZUFBQTtFQUNBLGdCQUFBO0FBUEY7O0FBV0E7RUFDRSxjQUFBO0FBUkY7O0FBWUE7RUFDRSxzQ0FBQTtBQVRGO0FBV0U7RUFDRSwyQkFBQTtBQVRKOztBQWNBO0VBQ0U7SUFDRSxlQUFBO0VBWEY7RUFjQTs7SUFFRSxpQkFBQTtFQVpGO0VBZUE7SUFDRSxhQUFBO0VBYkY7QUFDRjtBQWlCQTtFQUNFLGNBQUE7QUFmRjs7QUFtQkE7RUFDRSxnQkFBQTtFQUNBLGdCQUFBO0VBQ0EsdUJBQUE7RUFDQSxtQkFBQTtBQWhCRjs7QUFvQkE7RUFDRSx3REFBQTtFQUNBLHlCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLGVBQUE7QUFqQkY7O0FBcUJBO0VBQ0Usd0RBQUE7RUFDQSxnQkFBQTtFQUNBLGdCQUFBO0VBQ0Esa0JBQUE7RUFDQSxlQUFBO0VBQ0EseUJBQUE7QUFsQkY7O0FBc0JBO0VBQ0UsYUFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7RUFDQSxpQkFBQTtBQW5CRjs7QUF1QkE7RUFDRSxrQkFBQTtFQUNBLGtCQUFBO0VBQ0EsY0FBQTtBQXBCRjtBQXNCRTtFQUNFLGVBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUNBLG1CQUFBO0VBQ0EsWUFBQTtBQXBCSjs7QUF5QkE7RUFDRSx5QkFBQTtFQUNBLGtCQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0FBdEJGOztBQTBCQTtFQUNFLGdCQUFBO0VBQ0Esa0JBQUE7RUFDQSx5QkFBQTtBQXZCRjs7QUEyQkE7RUFDRSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSxtQkFBQTtFQUNBLG1CQUFBO0VBQ0EsZUFBQTtFQUNBLGdDQUFBO0FBeEJGOztBQTRCQTtFQUNFLGdCQUFBO0VBQ0EsaUJBQUE7RUFDQSw2QkFBQTtBQXpCRjs7QUE2QkE7RUFDRSxhQUFBO0VBQ0EsU0FBQTtFQUNBLHFCQUFBO0FBMUJGOztBQThCQTtFQUNFLGFBQUE7RUFDQSxTQUFBO0FBM0JGO0FBNkJFO0VBSkY7SUFLSSxxQ0FBQTtFQTFCRjtBQUNGO0FBNEJFO0VBUkY7SUFTSSxxQ0FBQTtFQXpCRjtBQUNGOztBQTZCQTtFQUNFLGFBQUE7RUFDQSxTQUFBO0FBMUJGO0FBNEJFO0VBSkY7SUFLSSxxQ0FBQTtFQXpCRjtBQUNGOztBQTRCQTtFQUNFLGtCQUFBO0VBQ0EsYUFBQTtFQUNBLGtCQUFBO0VBQ0EsZ0NBQUE7QUF6QkY7QUEyQkU7RUFDRSwyQkFBQTtFQUNBLGlGQUFBO0FBekJKO0FBNEJFO0VBQ0UsaUJBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0FBMUJKO0FBNkJFO0VBQ0UsbUJBQUE7RUFDQSxjQUFBO0FBM0JKOztBQWdDQTtFQUNFLG1CQUFBO0FBN0JGO0FBK0JFO0VBQ0Usa0JBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7RUFDQSxrQkFBQTtBQTdCSjtBQWdDRTtFQUNFLG1CQUFBO0VBQ0EsY0FBQTtBQTlCSjs7QUFtQ0E7RUFDRSxrQkFBQTtBQWhDRjtBQWtDRTtFQUNFLGtCQUFBO0VBQ0EsUUFBQTtFQUNBLFNBQUE7RUFDQSxlQUFBO0VBQ0EsWUFBQTtFQUNBLGlCQUFBO0VBQ0Esa0JBQUE7RUFDQSxtRkFBQTtFQUNBLHlCQUFBO0VBQ0EsV0FBQTtFQUNBLGdCQUFBO0FBaENKO0FBa0NJO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsU0FBQTtFQUNBLFdBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0VBQ0EsZUFBQTtFQUNBLGNBQUE7RUFDQSx1QkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0EsdUNBQUE7QUFoQ047QUFrQ007RUFDRSx5QkFBQTtBQWhDUjtBQW1DTTtFQUNFLFlBQUE7RUFDQSxtQkFBQTtBQWpDUjtBQW9DTTtFQUNFLGVBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtBQWxDUjtBQXFDTTtFQUNFLE9BQUE7RUFDQSxnQkFBQTtBQW5DUjtBQXNDTTtFQUNFLGVBQUE7RUFDQSxjQUFBO0VBQ0EsaUJBQUE7QUFwQ1I7QUF3Q0k7RUFDRSxXQUFBO0VBQ0EseUJBQUE7RUFDQSxhQUFBO0FBdENOOztBQTRDQTtFQUNFLCtCQUFBO0FBekNGOztBQTRDQTtFQUNFO0lBQ0UsVUFBQTtJQUNBLDJCQUFBO0VBekNGO0VBMkNBO0lBQ0UsVUFBQTtJQUNBLHdCQUFBO0VBekNGO0FBQ0Y7QUE2Q0E7RUFDRSx5QkFBQTtBQTNDRjs7QUErQ0E7RUFDRSwrQkFBQTtBQTVDRiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEVzdGlsb3MgZXNwZWPDg8KtZmljb3MgcGFyYSBlbCBjb21wb25lbnRlIGRlIGxvZ3MgZGUgYWN0aXZpZGFkXG5cbi5tYXQtbWRjLXRhYmxlIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGJhY2tncm91bmQ6IHdoaXRlO1xufVxuXG4ubWF0LW1kYy1yb3c6aG92ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjhmYWZjO1xufVxuXG4ubWF0LW1kYy1jZWxsIHtcbiAgcGFkZGluZzogMTJweCAxNnB4O1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2UyZThmMDtcbn1cblxuLm1hdC1tZGMtaGVhZGVyLWNlbGwge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjFmNWY5O1xuICBmb250LXdlaWdodDogNjAwO1xuICBjb2xvcjogIzM3NDE1MTtcbiAgcGFkZGluZzogMTZweDtcbiAgYm9yZGVyLWJvdHRvbTogMnB4IHNvbGlkICNlMmU4ZjA7XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBsb3MgY2hpcHMgZGUgYWNjacODwrNuXG4ubWF0LW1kYy1jaGlwLm1hdC1tZGMtY2hpcC1zZWxlY3RlZC5tYXQtbWRjLWNoaXAtY29sb3Itc3VjY2VzcyB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNkY2ZjZTc7XG4gIGNvbG9yOiAjMTY2NTM0O1xufVxuXG4ubWF0LW1kYy1jaGlwLm1hdC1tZGMtY2hpcC1zZWxlY3RlZC5tYXQtbWRjLWNoaXAtY29sb3Itd2FybiB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZWYzYzc7XG4gIGNvbG9yOiAjOTI0MDBlO1xufVxuXG4ubWF0LW1kYy1jaGlwLm1hdC1tZGMtY2hpcC1zZWxlY3RlZC5tYXQtbWRjLWNoaXAtY29sb3ItcHJpbWFyeSB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNkYmVhZmU7XG4gIGNvbG9yOiAjMWU0MGFmO1xufVxuXG4ubWF0LW1kYy1jaGlwLm1hdC1tZGMtY2hpcC1zZWxlY3RlZC5tYXQtbWRjLWNoaXAtY29sb3ItYWNjZW50IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2YzZThmZjtcbiAgY29sb3I6ICM3YzNhZWQ7XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBsb3MgY2FtcG9zIGRlIGZpbHRyb1xuLm1hdC1tZGMtZm9ybS1maWVsZCB7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4vLyBFc3RpbG9zIHBhcmEgbGFzIHRhcmpldGFzXG4ubWF0LW1kYy1jYXJkIHtcbiAgYm94LXNoYWRvdzogMCAxcHggM3B4IDAgcmdiYSgwLCAwLCAwLCAwLjEpLCAwIDFweCAycHggMCByZ2JhKDAsIDAsIDAsIDAuMDYpO1xuICBib3JkZXItcmFkaXVzOiA4cHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNlMmU4ZjA7XG59XG5cbi5tYXQtbWRjLWNhcmQtaGVhZGVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y4ZmFmYztcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNlMmU4ZjA7XG4gIGJvcmRlci1yYWRpdXM6IDhweCA4cHggMCAwO1xufVxuXG4vLyBFc3RpbG9zIHBhcmEgbG9zIGJvdG9uZXNcbi5tYXQtbWRjLXJhaXNlZC1idXR0b24ge1xuICBib3JkZXItcmFkaXVzOiA2cHg7XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG59XG5cbi5tYXQtbWRjLXN0cm9rZWQtYnV0dG9uIHtcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xuICBmb250LXdlaWdodDogNTAwO1xufVxuXG4vLyBFc3RpbG9zIHBhcmEgbGEgcGFnaW5hY2nDg8KzblxuLm1hdC1tZGMtcGFnaW5hdG9yIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y4ZmFmYztcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNlMmU4ZjA7XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBsb3MgdG9vbHRpcHNcbi5tYXQtbWRjLXRvb2x0aXAge1xuICBmb250LXNpemU6IDEycHg7XG4gIG1heC13aWR0aDogMzAwcHg7XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBsb3Mgc3Bpbm5lcnNcbi5tYXQtbWRjLXByb2dyZXNzLXNwaW5uZXIge1xuICBtYXJnaW46IDAgYXV0bztcbn1cblxuLy8gRXN0aWxvcyBwYXJhIGxhcyBlc3RhZMODwq1zdGljYXNcbi5zdGF0cy1jYXJkIHtcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMnMgZWFzZS1pbi1vdXQ7XG4gIFxuICAmOmhvdmVyIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7XG4gIH1cbn1cblxuLy8gRXN0aWxvcyBwYXJhIGxhIHRhYmxhIHJlc3BvbnNpdmVcbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAubWF0LW1kYy10YWJsZSB7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICB9XG4gIFxuICAubWF0LW1kYy1jZWxsLFxuICAubWF0LW1kYy1oZWFkZXItY2VsbCB7XG4gICAgcGFkZGluZzogOHB4IDEycHg7XG4gIH1cbiAgXG4gIC5tYXQtbWRjLWNhcmQtY29udGVudCB7XG4gICAgcGFkZGluZzogMTZweDtcbiAgfVxufVxuXG4vLyBFc3RpbG9zIHBhcmEgbG9zIGNhbXBvcyBkZSBmZWNoYVxuLm1hdC1tZGMtZGF0ZXBpY2tlci10b2dnbGUge1xuICBjb2xvcjogIzZiNzI4MDtcbn1cblxuLy8gRXN0aWxvcyBwYXJhIGxvcyBjYW1wb3MgZGUgdGV4dG8gdHJ1bmNhZG9zXG4udHJ1bmNhdGVkLXRleHQge1xuICBtYXgtd2lkdGg6IDIwMHB4O1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbn1cblxuLy8gRXN0aWxvcyBwYXJhIGxvcyBjw4PCs2RpZ29zIChJUCwgZXRjLilcbi5jb2RlLWJsb2NrIHtcbiAgZm9udC1mYW1pbHk6ICdNb25hY28nLCAnTWVubG8nLCAnVWJ1bnR1IE1vbm8nLCBtb25vc3BhY2U7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmM2Y0ZjY7XG4gIHBhZGRpbmc6IDJweCA2cHg7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgZm9udC1zaXplOiAxMXB4O1xufVxuXG4vLyBFc3RpbG9zIHBhcmEgbG9zIG3Dg8KpdG9kb3MgSFRUUFxuLmh0dHAtbWV0aG9kIHtcbiAgZm9udC1mYW1pbHk6ICdNb25hY28nLCAnTWVubG8nLCAnVWJ1bnR1IE1vbm8nLCBtb25vc3BhY2U7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIHBhZGRpbmc6IDJweCA4cHg7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgZm9udC1zaXplOiAxMXB4O1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xufVxuXG4vLyBFc3RpbG9zIHBhcmEgZWwgZXN0YWRvIGRlIGNhcmdhXG4ubG9hZGluZy1vdmVybGF5IHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIG1pbi1oZWlnaHQ6IDIwMHB4O1xufVxuXG4vLyBFc3RpbG9zIHBhcmEgZWwgbWVuc2FqZSBkZSBubyBkYXRvc1xuLm5vLWRhdGEtbWVzc2FnZSB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgcGFkZGluZzogNDhweCAyNHB4O1xuICBjb2xvcjogIzZiNzI4MDtcbiAgXG4gIC5tYXQtaWNvbiB7XG4gICAgZm9udC1zaXplOiA2NHB4O1xuICAgIHdpZHRoOiA2NHB4O1xuICAgIGhlaWdodDogNjRweDtcbiAgICBtYXJnaW4tYm90dG9tOiAxNnB4O1xuICAgIG9wYWNpdHk6IDAuNTtcbiAgfVxufVxuXG4vLyBFc3RpbG9zIHBhcmEgbG9zIGZpbHRyb3Ncbi5maWx0ZXJzLXNlY3Rpb24ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjhmYWZjO1xuICBib3JkZXItcmFkaXVzOiA4cHg7XG4gIHBhZGRpbmc6IDIwcHg7XG4gIG1hcmdpbi1ib3R0b206IDI0cHg7XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBsYSB0YWJsYSBkZSBsb2dzXG4ubG9ncy10YWJsZS1jb250YWluZXIge1xuICBvdmVyZmxvdy14OiBhdXRvO1xuICBib3JkZXItcmFkaXVzOiA4cHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNlMmU4ZjA7XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBsYXMgYWNjaW9uZXMgZGUgbGEgdGFibGFcbi50YWJsZS1hY3Rpb25zIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBtYXJnaW4tYm90dG9tOiAxNnB4O1xuICBwYWRkaW5nOiAxNnB4IDA7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZTJlOGYwO1xufVxuXG4vLyBFc3RpbG9zIHBhcmEgbG9zIGZpbHRyb3MgYXZhbnphZG9zXG4uYWR2YW5jZWQtZmlsdGVycyB7XG4gIG1hcmdpbi10b3A6IDE2cHg7XG4gIHBhZGRpbmctdG9wOiAxNnB4O1xuICBib3JkZXItdG9wOiAxcHggc29saWQgI2UyZThmMDtcbn1cblxuLy8gRXN0aWxvcyBwYXJhIGxvcyBib3RvbmVzIGRlIGZpbHRyb1xuLmZpbHRlci1idXR0b25zIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZ2FwOiAxMnB4O1xuICBhbGlnbi1pdGVtczogZmxleC1lbmQ7XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBlbCBncmlkIGRlIGZpbHRyb3Ncbi5maWx0ZXJzLWdyaWQge1xuICBkaXNwbGF5OiBncmlkO1xuICBnYXA6IDE2cHg7XG4gIFxuICBAbWVkaWEgKG1pbi13aWR0aDogNzY4cHgpIHtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgyLCAxZnIpO1xuICB9XG4gIFxuICBAbWVkaWEgKG1pbi13aWR0aDogMTAyNHB4KSB7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoNCwgMWZyKTtcbiAgfVxufVxuXG4vLyBFc3RpbG9zIHBhcmEgbGFzIGVzdGFkw4PCrXN0aWNhc1xuLnN0YXRzLWdyaWQge1xuICBkaXNwbGF5OiBncmlkO1xuICBnYXA6IDI0cHg7XG4gIFxuICBAbWVkaWEgKG1pbi13aWR0aDogNzY4cHgpIHtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgzLCAxZnIpO1xuICB9XG59XG5cbi5zdGF0LWNhcmQge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHBhZGRpbmc6IDI0cHg7XG4gIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZS1pbi1vdXQ7XG4gIFxuICAmOmhvdmVyIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7XG4gICAgYm94LXNoYWRvdzogMCA0cHggNnB4IC0xcHggcmdiYSgwLCAwLCAwLCAwLjEpLCAwIDJweCA0cHggLTFweCByZ2JhKDAsIDAsIDAsIDAuMDYpO1xuICB9XG4gIFxuICAuc3RhdC12YWx1ZSB7XG4gICAgZm9udC1zaXplOiAyLjVyZW07XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICBtYXJnaW4tYm90dG9tOiA4cHg7XG4gIH1cbiAgXG4gIC5zdGF0LWxhYmVsIHtcbiAgICBmb250LXNpemU6IDAuODc1cmVtO1xuICAgIGNvbG9yOiAjNmI3MjgwO1xuICB9XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBlbCBoZWFkZXIgcHJpbmNpcGFsXG4ucGFnZS1oZWFkZXIge1xuICBtYXJnaW4tYm90dG9tOiAzMnB4O1xuICBcbiAgaDEge1xuICAgIGZvbnQtc2l6ZTogMi4yNXJlbTtcbiAgICBmb250LXdlaWdodDogNzAwO1xuICAgIGNvbG9yOiAjMTExODI3O1xuICAgIG1hcmdpbi1ib3R0b206IDhweDtcbiAgfVxuICBcbiAgcCB7XG4gICAgZm9udC1zaXplOiAxLjEyNXJlbTtcbiAgICBjb2xvcjogIzZiNzI4MDtcbiAgfVxufVxuXG4vLyBFc3RpbG9zIHBhcmEgZWwgbWVuw4PCuiBkZXNwbGVnYWJsZSBkZSBleHBvcnRhY2nDg8KzblxuLmV4cG9ydC1tZW51LWNvbnRhaW5lciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgXG4gIC5leHBvcnQtbWVudSB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHJpZ2h0OiAwO1xuICAgIHRvcDogMTAwJTtcbiAgICBtYXJnaW4tdG9wOiA4cHg7XG4gICAgd2lkdGg6IDEycmVtO1xuICAgIGJhY2tncm91bmQ6IHdoaXRlO1xuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICBib3gtc2hhZG93OiAwIDEwcHggMTVweCAtM3B4IHJnYmEoMCwgMCwgMCwgMC4xKSwgMCA0cHggNnB4IC0ycHggcmdiYSgwLCAwLCAwLCAwLjA1KTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjZTVlN2ViO1xuICAgIHotaW5kZXg6IDUwO1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgXG4gICAgLmV4cG9ydC1tZW51LWl0ZW0ge1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICBnYXA6IDEycHg7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIHBhZGRpbmc6IDEycHggMTZweDtcbiAgICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICBjb2xvcjogIzM3NDE1MTtcbiAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjE1cyBlYXNlO1xuICAgICAgXG4gICAgICAmOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2Y5ZmFmYjtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgJjpkaXNhYmxlZCB7XG4gICAgICAgIG9wYWNpdHk6IDAuNTtcbiAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLm1lbnUtaXRlbS1pY29uIHtcbiAgICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgICB3aWR0aDogMTZweDtcbiAgICAgICAgaGVpZ2h0OiAxNnB4O1xuICAgICAgfVxuICAgICAgXG4gICAgICAubWVudS1pdGVtLXRleHQge1xuICAgICAgICBmbGV4OiAxO1xuICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgICAgfVxuICAgICAgXG4gICAgICAubWVudS1pdGVtLWNvdW50IHtcbiAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICBjb2xvcjogIzZiNzI4MDtcbiAgICAgICAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC5leHBvcnQtbWVudS1kaXZpZGVyIHtcbiAgICAgIGhlaWdodDogMXB4O1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2U1ZTdlYjtcbiAgICAgIG1hcmdpbjogNHB4IDA7XG4gICAgfVxuICB9XG59XG5cbi8vIEFuaW1hY2lvbmVzIHBhcmEgZWwgbWVuw4PCulxuLmFuaW1hdGUtZmFkZS1pbiB7XG4gIGFuaW1hdGlvbjogZmFkZUluIDAuMnMgZWFzZS1vdXQ7XG59XG5cbkBrZXlmcmFtZXMgZmFkZUluIHtcbiAgZnJvbSB7XG4gICAgb3BhY2l0eTogMDtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLThweCk7XG4gIH1cbiAgdG8ge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICB9XG59XG5cbi8vIFJvdGFjacODwrNuIGRlbCBpY29ubyBkZSBleHBhbmRpclxuLnJvdGF0ZS0xODAge1xuICB0cmFuc2Zvcm06IHJvdGF0ZSgxODBkZWcpO1xufVxuXG4vLyBUcmFuc2ljacODwrNuIHN1YXZlIHBhcmEgZWwgaWNvbm9cbi50cmFuc2l0aW9uLXRyYW5zZm9ybSB7XG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjJzIGVhc2U7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}
// Componente de diálogo de confirmación
class ConfirmDialogComponent {
  constructor(data) {
    this.data = data;
  }
  static #_ = this.ɵfac = function ConfirmDialogComponent_Factory(t) {
    return new (t || ConfirmDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__.MAT_DIALOG_DATA));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
    type: ConfirmDialogComponent,
    selectors: [["app-confirm-dialog"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵStandaloneFeature"]],
    decls: 9,
    vars: 5,
    consts: [["mat-dialog-title", ""], ["align", "end"], ["mat-button", "", "mat-dialog-close", ""], ["mat-raised-button", "", "color", "warn", 3, "mat-dialog-close"]],
    template: function ConfirmDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "h2", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "mat-dialog-content");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "mat-dialog-actions", 1)(5, "button", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx.data.title);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx.data.message);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx.data.cancelText);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("mat-dialog-close", true);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx.data.confirmText);
      }
    },
    dependencies: [_angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__.MatDialogModule, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__.MatDialogClose, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__.MatDialogTitle, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__.MatDialogActions, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__.MatDialogContent, _angular_material_button__WEBPACK_IMPORTED_MODULE_14__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_14__.MatButton],
    encapsulation: 2
  });
}

/***/ })

}]);
//# sourceMappingURL=src_app_pages_configuracion_logs-activity_logs-activity_component_ts.js.map