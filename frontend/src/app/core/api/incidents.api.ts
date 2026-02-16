import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Incident } from '../models/incident.model';
import { PageResponse } from '../models/page-response.model';
import { Observable } from 'rxjs';

export interface ListQuery {
  q?: string;
  service?: string;
  severity?: string;
  status?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface CreateIncidentRequest {
  title: string;
  service: string;
  severity: string;
  status: string;
  owner?: string;
  summary?: string;
}

export interface UpdateIncidentRequest {
  status?: string;
  severity?: string;
  owner?: string;
  summary?: string;
}

@Injectable({ providedIn: 'root' })
export class IncidentsApi {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/incidents`;

  list(query: ListQuery): Observable<PageResponse<Incident>> {
    let params = new HttpParams();

    params = params
      .set('page', (query.page || 1).toString())
      .set('size', (query.size || 10).toString())
      .set('sortBy', query.sortBy || 'createdAt')
      .set('sortDir', query.sortDir || 'desc');

    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && !['page', 'size', 'sortBy', 'sortDir'].includes(k)) {
        params = params.set(k, String(v));
      }
    });

    return this.http.get<PageResponse<Incident>>(this.base, { params });
  }

  getById(id: string) {
    return this.http.get<Incident>(`${this.base}/${id}`);
  }

  create(body: CreateIncidentRequest) {
    return this.http.post<Incident>(this.base, body);
  }

  patch(id: string, body: UpdateIncidentRequest) {
    return this.http.patch<Incident>(`${this.base}/${id}`, body);
  }
}
