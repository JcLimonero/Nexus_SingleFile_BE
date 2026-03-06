import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api-base.service';

export interface ReporteCumplimientoDashboard {
  clientesAlertaAml: number;
  expedientesActivos: number;
  documentosPendientes: number;
  expedientesSinBeneficiario?: number;
  expedientesSinAviso?: number;
  umbralAml: number;
  periodoMeses?: number;
  umbralUMA?: number;
  anio?: number;
}

export interface ExpedienteSinBeneficiario {
  idFile: number;
  ndPedido: number;
  cliente: string;
  tipoCliente: string;
  agencia: string;
  proceso: string;
  fase: string;
  registro: string;
}

export interface ExpedienteAlertaPld {
  idCliente: number;
  ndCliente: string;
  cliente: string;
  totalMonto: number;
  idCompany: number;
}

export interface ResumenRazonSocialAgencia {
  razonSocial: string;
  idCompany: number | null;
  idAgency: number;
  nombreAgencia: string;
  porEstado: { idEstado: number; nombreEstado: string; total: number }[];
  total: number;
}

export interface DocumentosPendientesAgencia {
  idAgency: number;
  nombreAgencia: string;
  porEstatus: { idEstatus: number; nombreEstatus: string; total: number }[];
  total: number;
}

export interface DocumentosPendientesGrupo {
  razonSocial: string;
  idCompany: number | null;
  idAgency: number;
  nombreAgencia: string;
  porEstatus: { idEstatus: number; nombreEstatus: string; total: number }[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportesCumplimientoService {
  private readonly API = 'reportes-cumplimiento';

  constructor(
    private http: HttpClient,
    private apiBase: ApiBaseService
  ) {}

  getDashboard(params?: { idCompany?: number }): Observable<{ success: boolean; data: ReporteCumplimientoDashboard }> {
    let httpParams = new HttpParams();
    if (params?.idCompany != null) httpParams = httpParams.set('idCompany', params.idCompany.toString());
    const url = this.apiBase.buildApiUrl(`${this.API}/dashboard`);
    return this.http.get<{ success: boolean; data: ReporteCumplimientoDashboard }>(url, { params: httpParams });
  }

  getExpedientesAlertaPld(params?: { idAgency?: number; idAgencies?: number[]; idCompany?: number; limit?: number; offset?: number }): Observable<any> {
    let httpParams = new HttpParams();
    if (params?.idAgencies?.length) {
      httpParams = httpParams.set('idAgency', params.idAgencies.join(','));
    } else if (params?.idAgency != null) {
      httpParams = httpParams.set('idAgency', params.idAgency.toString());
    }
    if (params?.idCompany != null) httpParams = httpParams.set('idCompany', params.idCompany.toString());
    if (params?.limit != null) httpParams = httpParams.set('limit', params.limit.toString());
    if (params?.offset != null) httpParams = httpParams.set('offset', params.offset.toString());
    const url = this.apiBase.buildApiUrl(`${this.API}/expedientes-alerta-pld`);
    return this.http.get<any>(url, { params: httpParams });
  }

  getResumenPorAgencia(params?: { idAgency?: number; idAgencies?: number[]; idCompany?: number; anio?: number; mes?: number }): Observable<any> {
    let httpParams = new HttpParams();
    if (params?.idAgencies?.length) {
      httpParams = httpParams.set('idAgency', params.idAgencies.join(','));
    } else if (params?.idAgency != null) {
      httpParams = httpParams.set('idAgency', params.idAgency.toString());
    }
    if (params?.idCompany != null) httpParams = httpParams.set('idCompany', params.idCompany.toString());
    if (params?.anio != null) httpParams = httpParams.set('anio', params.anio.toString());
    if (params?.mes != null) httpParams = httpParams.set('mes', params.mes.toString());
    const url = this.apiBase.buildApiUrl(`${this.API}/resumen-por-agencia`);
    return this.http.get<any>(url, { params: httpParams });
  }

  getDocumentosPendientes(params?: { idAgency?: number; idAgencies?: number[]; idCompany?: number }): Observable<any> {
    let httpParams = new HttpParams();
    if (params?.idAgencies?.length) {
      httpParams = httpParams.set('idAgency', params.idAgencies.join(','));
    } else if (params?.idAgency != null) {
      httpParams = httpParams.set('idAgency', params.idAgency.toString());
    }
    if (params?.idCompany != null) httpParams = httpParams.set('idCompany', params.idCompany.toString());
    const url = this.apiBase.buildApiUrl(`${this.API}/documentos-pendientes`);
    return this.http.get<any>(url, { params: httpParams });
  }

  getExpedientesSinBeneficiario(params?: { idAgency?: number; idAgencies?: number[]; idCompany?: number; anio?: number; limit?: number; offset?: number }): Observable<any> {
    let httpParams = new HttpParams();
    if (params?.idAgencies?.length) {
      httpParams = httpParams.set('idAgency', params.idAgencies.join(','));
    } else if (params?.idAgency != null) {
      httpParams = httpParams.set('idAgency', params.idAgency.toString());
    }
    if (params?.idCompany != null) httpParams = httpParams.set('idCompany', params.idCompany.toString());
    if (params?.anio != null) httpParams = httpParams.set('anio', params.anio.toString());
    if (params?.limit != null) httpParams = httpParams.set('limit', params.limit.toString());
    if (params?.offset != null) httpParams = httpParams.set('offset', params.offset.toString());
    const url = this.apiBase.buildApiUrl(`${this.API}/expedientes-sin-beneficiario`);
    return this.http.get<any>(url, { params: httpParams });
  }

  getExpedientesSinAviso(params?: { idAgency?: number; idAgencies?: number[]; idCompany?: number; anio?: number; limit?: number; offset?: number }): Observable<any> {
    let httpParams = new HttpParams();
    if (params?.idAgencies?.length) {
      httpParams = httpParams.set('idAgency', params.idAgencies.join(','));
    } else if (params?.idAgency != null) {
      httpParams = httpParams.set('idAgency', params.idAgency.toString());
    }
    if (params?.idCompany != null) httpParams = httpParams.set('idCompany', params.idCompany.toString());
    if (params?.anio != null && params?.anio !== undefined) httpParams = httpParams.set('anio', params.anio.toString());
    if (params?.limit != null) httpParams = httpParams.set('limit', params.limit.toString());
    if (params?.offset != null) httpParams = httpParams.set('offset', params.offset.toString());
    const url = this.apiBase.buildApiUrl(`${this.API}/expedientes-sin-aviso`);
    return this.http.get<any>(url, { params: httpParams });
  }
}
