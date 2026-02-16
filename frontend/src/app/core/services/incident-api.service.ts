import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface IncidentResponse {
  id: string;
  title: string;
  service: string;
  severity: string;
  status: string;
  owner?: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentListParams {
  q?: string;
  service?: string;
  severity?: string;
  status?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root',
})
export class IncidentsApi {
  private baseUrl = 'http://localhost:8080/api/incidents';

  constructor(private http: HttpClient) {}
  list(paramsObj: IncidentListParams): Observable<PageResponse<IncidentResponse>> {
    const safeParams: IncidentListParams = {
      page: paramsObj.page ?? 1,
      size: paramsObj.size ?? 10,
      sortBy: paramsObj.sortBy ?? 'createdAt',
      sortDir: paramsObj.sortDir ?? 'desc',
      q: paramsObj.q,
      service: paramsObj.service,
      severity: paramsObj.severity,
      status: paramsObj.status,
    };

    let params = new HttpParams();

    Object.entries(safeParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<PageResponse<IncidentResponse>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<IncidentResponse> {
    return this.http.get<IncidentResponse>(`${this.baseUrl}/${id}`);
  }

  create(payload: Partial<IncidentResponse>): Observable<IncidentResponse> {
    return this.http.post<IncidentResponse>(this.baseUrl, payload);
  }

  patch(
    id: string,
    updates: Partial<IncidentResponse>
  ): Observable<IncidentResponse> {
    return this.http.patch<IncidentResponse>(
      `${this.baseUrl}/${id}`,
      updates
    );
  }
}
